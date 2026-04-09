/**
 * cleanup-old-data.mjs
 * Deletes old categories (and their items) that were replaced by the new Hayde structure.
 *
 * KEEPS:
 *  - All categories matching the new slugs (from add-categories.mjs)
 *  - "Director's Cabinet" / "Директорски шкаф" (slug: directors-cabinet or similar)
 *  - "Beer" category (we added items to it)
 *  - Any category whose slug starts with one of the new slugs
 *
 * DELETES:
 *  - All other categories
 *  - All menu items belonging to deleted categories
 *
 * DRY RUN by default — pass --execute to actually delete.
 * Run:
 *   node scripts/cleanup-old-data.mjs           (preview)
 *   node scripts/cleanup-old-data.mjs --execute  (delete)
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EXECUTE = process.argv.includes('--execute')

const envPath = resolve(__dirname, '../.env.local')
const env = {}
try {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length) env[k.trim()] = v.join('=').trim()
  })
} catch {}

const TOKEN   = env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN
const PROJECT = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wq48qcpb'

if (!TOKEN) { console.error('❌  SANITY_API_TOKEN not found'); process.exit(1) }

const client = createClient({
  projectId: PROJECT, dataset: 'production',
  apiVersion: '2024-01-01', token: TOKEN, useCdn: false,
})

// ── Slugs to KEEP ────────────────────────────────────────────────────────────
const KEEP_SLUGS = new Set([
  // New Hayde categories
  'cold-drinks', 'fresh-juice-lemonade', 'smoothies', 'soft-drinks',
  'vodka', 'gin', 'rum', 'cocktails', 'cold-organic-latte',
  'non-alcoholic-cocktails', 'nuts', 'irish-whiskey', 'scotch-whisky',
  'japanese-whiskey', 'single-malt-whiskey', 'tequila',
  'liqueurs-vermouths', 'cognac', 'tennessee-bourbon',
  'white-wines', 'red-wines', 'rose-wines', 'sparkling-wines', 'food',
  // Kept from old structure
  'beer', 'hot-drinks',
])

// ── English names to KEEP (fallback if slug differs) ─────────────────────────
const KEEP_NAMES = new Set([
  'beer', 'hot drink', 'hot drinks', 'espresso drinks',
  "director's cabinet", 'directors cabinet', 'директорски шкаф',
])

async function run() {
  console.log(EXECUTE
    ? '🔴  EXECUTE MODE — items will be deleted!\n'
    : '🟡  DRY RUN — nothing will be deleted. Pass --execute to delete.\n'
  )

  const categories = await client.fetch(
    `*[_type == "category"]{_id, "slug": slug.current, "nameEn": name.en, "nameBg": name.bg}`
  )

  const toDelete = []
  const toKeep   = []

  for (const cat of categories) {
    const slug   = (cat.slug   || '').toLowerCase().trim()
    const nameEn = (cat.nameEn || '').toLowerCase().trim()
    const nameBg = (cat.nameBg || '').toLowerCase().trim()

    const keep =
      KEEP_SLUGS.has(slug) ||
      KEEP_NAMES.has(nameEn) ||
      KEEP_NAMES.has(nameBg) ||
      nameEn.includes("director") ||
      nameBg.includes("директорски")

    if (keep) toKeep.push(cat)
    else       toDelete.push(cat)
  }

  console.log(`✅  KEEP  (${toKeep.length}):`)
  toKeep.forEach(c => console.log(`   - ${c.nameEn || c.nameBg} (${c.slug})`))

  console.log(`\n🗑️   DELETE (${toDelete.length}):`)
  toDelete.forEach(c => console.log(`   - ${c.nameEn || c.nameBg} (${c.slug})  [${c._id}]`))

  if (toDelete.length === 0) {
    console.log('\n✅  Nothing to delete.')
    return
  }

  if (!EXECUTE) {
    console.log('\n👆  Run with --execute to perform the deletion.')
    return
  }

  // ── Delete items belonging to old categories ────────────────────────────────
  let itemsDeleted = 0
  for (const cat of toDelete) {
    const items = await client.fetch(
      `*[_type == "menuItem" && category._ref == $id]{_id}`,
      { id: cat._id }
    )
    for (const item of items) {
      await client.delete(item._id)
      itemsDeleted++
    }
    console.log(`   🗑️   Deleted ${items.length} items from "${cat.nameEn || cat.nameBg}"`)
  }

  // ── Delete the categories themselves ────────────────────────────────────────
  for (const cat of toDelete) {
    await client.delete(cat._id)
    console.log(`   🗑️   Deleted category: ${cat.nameEn || cat.nameBg}`)
  }

  console.log(`\n✅  Done. Deleted ${toDelete.length} categories and ${itemsDeleted} items.`)
}

run().catch(err => { console.error('❌', err.message); process.exit(1) })
