/**
 * add-categories.mjs
 * Adds the missing Hayde menu categories to Sanity.
 * Run: node scripts/add-categories.mjs
 *
 * Existing categories are NOT touched.
 * New ones are created with displayStyle: 'list' and isActive: true.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

if (!TOKEN) {
  console.error('❌  SANITY_API_TOKEN not found in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

// ── Categories to add ──────────────────────────────────────────────────────
// slug must be unique. displayStyle: 'list' for drinks/food.
const NEW_CATEGORIES = [
  { slug: 'cold-drinks',              nameBg: 'Студени напитки',        nameEn: 'Cold Drinks',                   displayStyle: 'list' },
  { slug: 'fresh-juice-lemonade',     nameBg: 'Фрешове и лимонади',     nameEn: 'Fresh Juice & Lemonade',        displayStyle: 'list' },
  { slug: 'smoothies',                nameBg: 'Смутита',                nameEn: 'Smoothies',                     displayStyle: 'list' },
  { slug: 'soft-drinks',              nameBg: 'Безалкохолни',           nameEn: 'Soft Drinks',                   displayStyle: 'list' },
  { slug: 'vodka',                    nameBg: 'Водка',                  nameEn: 'Vodka',                         displayStyle: 'list' },
  { slug: 'gin',                      nameBg: 'Джин',                   nameEn: 'Gin',                           displayStyle: 'list' },
  { slug: 'rum',                      nameBg: 'Ром',                    nameEn: 'Rum',                           displayStyle: 'list' },
  { slug: 'cocktails',                nameBg: 'Коктейли',               nameEn: 'Cocktails',                     displayStyle: 'list' },
  { slug: 'cold-organic-latte',       nameBg: 'Студено органично лате', nameEn: 'Cold Organic Latte Drinks',     displayStyle: 'list' },
  { slug: 'non-alcoholic-cocktails',  nameBg: 'Безалкохолни коктейли',  nameEn: 'Non Alcoholic Cocktails',       displayStyle: 'list' },
  { slug: 'nuts',                     nameBg: 'Ядки',                   nameEn: 'Nuts',                          displayStyle: 'list' },
  { slug: 'irish-whiskey',            nameBg: 'Ирландско уиски',        nameEn: 'Irish Whiskey',                 displayStyle: 'list' },
  { slug: 'scotch-whisky',            nameBg: 'Шотландско уиски',       nameEn: 'Scotch Whisky',                 displayStyle: 'list' },
  { slug: 'japanese-whiskey',         nameBg: 'Японско уиски',          nameEn: 'Japanese Whiskey',              displayStyle: 'list' },
  { slug: 'single-malt-whiskey',      nameBg: 'Сингъл молт уиски',      nameEn: 'Single Malt Whiskey',           displayStyle: 'list' },
  { slug: 'tequila',                  nameBg: 'Текила',                 nameEn: 'Tequila',                       displayStyle: 'list' },
  { slug: 'liqueurs-vermouths',       nameBg: 'Ликьори и вермути',      nameEn: 'Liqueurs and Vermouths',        displayStyle: 'list' },
  { slug: 'cognac',                   nameBg: 'Коняк',                  nameEn: 'Cognac',                        displayStyle: 'list' },
  { slug: 'tennessee-bourbon',        nameBg: 'Тенеси и бърбън',        nameEn: 'Tennessee Whiskey and Bourbon', displayStyle: 'list' },
  { slug: 'white-wines',              nameBg: 'Бели вина',              nameEn: 'White Wines',                   displayStyle: 'list' },
  { slug: 'red-wines',                nameBg: 'Червени вина',           nameEn: 'Red Wines',                     displayStyle: 'list' },
  { slug: 'rose-wines',               nameBg: 'Розе вина',              nameEn: 'Rosé Wines',                    displayStyle: 'list' },
  { slug: 'sparkling-wines',          nameBg: 'Пенливи вина',           nameEn: 'Sparkling Wines',               displayStyle: 'list' },
  { slug: 'food',                     nameBg: 'Храна',                  nameEn: 'Food',                          displayStyle: 'list' },
]

async function run() {
  // Fetch all existing slugs
  const existing = await client.fetch(`*[_type == "category"]{slug}`)
  const existingSlugs = new Set(existing.map(c => c.slug?.current || c.slug))

  console.log(`ℹ️   Found ${existingSlugs.size} existing categories`)

  const toAdd = NEW_CATEGORIES.filter(c => !existingSlugs.has(c.slug))
  console.log(`➕  Adding ${toAdd.length} new categories...\n`)

  let order = 100 // start order high so they sort after existing categories
  for (const cat of toAdd) {
    const doc = {
      _type: 'category',
      name: { bg: cat.nameBg, en: cat.nameEn },
      slug: { _type: 'slug', current: cat.slug },
      displayStyle: cat.displayStyle,
      isActive: true,
      order: order++,
    }
    await client.create(doc)
    console.log(`   ✅  ${cat.nameEn} (${cat.slug})`)
  }

  if (toAdd.length === 0) {
    console.log('✅  All categories already exist — nothing to add.')
  } else {
    console.log(`\n✅  Done! ${toAdd.length} categories added.`)
  }
}

run().catch(err => {
  console.error('❌  Error:', err.message)
  process.exit(1)
})
