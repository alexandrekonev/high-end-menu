/**
 * migrate-category-refs.mjs
 *
 * Конвертира menuItem.categorySlug (string) → menuItem.category (Sanity reference)
 *
 * Употреба:
 *   SANITY_API_TOKEN=sk... node scripts/migrate-category-refs.mjs
 *
 * Или с --dry-run за предварителен преглед без записване:
 *   SANITY_API_TOKEN=sk... node scripts/migrate-category-refs.mjs --dry-run
 */

import { createClient } from '@sanity/client'

const DRY_RUN = process.argv.includes('--dry-run')

const client = createClient({
  projectId: 'wq48qcpb',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// ── Helpers ──────────────────────────────────────────────────────
const log  = (...a) => console.log('  ', ...a)
const warn = (...a) => console.warn('⚠️ ', ...a)
const ok   = (...a) => console.log('✅', ...a)
const err  = (...a) => console.error('❌', ...a)

// ── Main ─────────────────────────────────────────────────────────
async function migrate() {
  console.log(`\n🚀  Sanity migration — categorySlug → reference`)
  console.log(`   Project : wq48qcpb  |  Dataset : production`)
  console.log(`   Mode    : ${DRY_RUN ? '🔍 DRY RUN (no writes)' : '✏️  LIVE'}`)
  console.log('─'.repeat(52))

  // 1. Load all categories → build slug → _id map
  const categories = await client.fetch(
    `*[_type == "category"] { _id, "slug": slug.current, "name": name.bg }`
  )

  if (!categories.length) {
    err('No categories found in dataset. Create categories in Studio first.')
    process.exit(1)
  }

  log(`Loaded ${categories.length} categories:`)
  categories.forEach(c => log(`  • ${c.slug}  →  ${c._id}  (${c.name})`))
  console.log()

  const slugToId = Object.fromEntries(categories.map(c => [c.slug, c._id]))

  // 2. Find menuItems that still have the old categorySlug field
  //    OR that have category as a plain string instead of a reference
  const items = await client.fetch(`
    *[_type == "menuItem"] {
      _id,
      "name": name.bg,
      categorySlug,
      category,
    }
  `)

  log(`Total menuItem documents: ${items.length}`)

  // Identify items that need migration:
  //   a) has categorySlug string field
  //   b) category is not a proper reference (missing _ref)
  const toMigrate = items.filter(item => {
    const hasSlug = typeof item.categorySlug === 'string' && item.categorySlug.trim()
    const hasRef  = item.category?._ref
    return hasSlug && !hasRef
  })

  const alreadyDone = items.filter(i => i.category?._ref)
  const noData      = items.filter(i => !i.categorySlug && !i.category?._ref)

  log(`Already linked (reference OK) : ${alreadyDone.length}`)
  log(`Need migration (have slug)    : ${toMigrate.length}`)
  log(`No category data at all       : ${noData.length}`)
  console.log()

  if (!toMigrate.length) {
    ok('Nothing to migrate — all items already have proper references.')
    return
  }

  // 3. Build patches
  let patched = 0
  let skipped = 0
  const transaction = client.transaction()

  for (const item of toMigrate) {
    const slug  = item.categorySlug.trim()
    const catId = slugToId[slug]

    if (!catId) {
      warn(`Unknown slug "${slug}" for item "${item.name}" (${item._id}) — SKIPPED`)
      skipped++
      continue
    }

    log(`Patch: "${item.name}"  ${slug} → ${catId}`)

    if (!DRY_RUN) {
      transaction.patch(item._id, {
        set:   { category: { _type: 'reference', _ref: catId } },
        unset: ['categorySlug'],
      })
    }
    patched++
  }

  console.log()

  if (DRY_RUN) {
    ok(`DRY RUN complete. ${patched} items would be patched, ${skipped} skipped.`)
    log('Run without --dry-run to apply changes.')
    return
  }

  if (patched === 0) {
    warn('No valid patches to commit.')
    return
  }

  // 4. Commit all patches in one transaction
  try {
    const result = await transaction.commit({ visibility: 'async' })
    ok(`Migration complete!`)
    log(`Patched : ${patched}`)
    log(`Skipped : ${skipped}`)
    log(`Tx ID   : ${result.transactionId}`)
  } catch