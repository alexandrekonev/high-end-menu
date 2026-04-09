/**
 * add-menu-items.mjs
 * Adds all Hayde menu items to Sanity, matched by category English name.
 *
 * Run AFTER add-categories.mjs:
 *   node scripts/add-categories.mjs
 *   node scripts/add-menu-items.mjs
 *
 * Items that already exist (same name.en + same category) are SKIPPED.
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

// ── Price helper ────────────────────────────────────────────────────────────
// Hayde shows BGN. We store EUR. 1 EUR = 1.95583 BGN.
const toEur = (bgn) => (bgn / 1.95583).toFixed(2)

// ── Menu data from Hayde ─────────────────────────────────────────────────────
// Format: { category: <English name>, items: [{ en, bg?, price_bgn, tags? }] }
// price_bgn = null means price unknown (will be set to "0")
const MENU = [
  {
    category: 'Hot drink',
    categorySlugFallback: 'hot-drinks',
    items: [
      { en: 'Espresso',          bg: 'Еспресо',          price_bgn: 3.40 },
      { en: 'Double Espresso',   bg: 'Двоен еспресо',    price_bgn: 4.80 },
      { en: 'Macchiato',         bg: 'Макиато',          price_bgn: 4.50 },
      { en: 'Flat White',        bg: 'Флат Уайт',        price_bgn: 5.80 },
      { en: 'Latte',             bg: 'Лате',             price_bgn: 5.60 },
      { en: 'Cappuccino',        bg: 'Капучино',         price_bgn: 5.40 },
      { en: 'Tea — Luxury Bag',  bg: 'Чай — Luxury Bag', price_bgn: 5.40 },
    ],
  },
  {
    category: 'Cold Drinks',
    categorySlugFallback: 'cold-drinks',
    items: [
      { en: 'Frappe',           bg: 'Фрапе',                   price_bgn: 5.90 },
      { en: 'Frappe Baileys',   bg: 'Фрапе Бейлис',            price_bgn: 6.90 },
      { en: 'Freddo Espresso',  bg: 'Фредо Еспресо',           price_bgn: 5.20 },
      { en: 'Freddo Cappuccino',bg: 'Фредо Капучино',          price_bgn: 5.90 },
    ],
  },
  {
    category: 'Fresh Juice & Lemonade',
    categorySlugFallback: 'fresh-juice-lemonade',
    items: [
      { en: 'Orange Fresh',                   bg: 'Портокалов фреш',              price_bgn: 5.80 },
      { en: 'Grapefruit Fresh',               bg: 'Грейпфрут фреш',               price_bgn: 5.80 },
      { en: 'Strawberry Lemonade with Honey', bg: 'Ягодова лимонада с мед',       price_bgn: 5.50 },
      { en: 'Raspberry Lemonade with Citrus', bg: 'Малинова лимонада с цитрус',   price_bgn: 5.50 },
    ],
  },
  {
    category: 'Smoothies',
    categorySlugFallback: 'smoothies',
    items: [
      { en: 'Chocolate Smoothie',       bg: 'Шоколадово смути',    price_bgn: 6.90 },
      { en: 'Lilac Smoothie',           bg: 'Люляково смути',      price_bgn: 6.90 },
      { en: 'Tropical Frozen Smoothie', bg: 'Тропическо смути',    price_bgn: 6.90 },
    ],
  },
  {
    category: 'Soft Drinks',
    categorySlugFallback: 'soft-drinks',
    items: [
      { en: 'Aqua Panna',             bg: 'Aqua Panna',           price_bgn: 4.49 },
      { en: 'Pelisterka',             bg: 'Пелистерка',           price_bgn: 2.99 },
      { en: 'Borjomi',                bg: 'Боржоми',              price_bgn: 4.99 },
      { en: 'S. Pellegrino (small)',   bg: 'S. Pellegrino (малка)',price_bgn: 4.49 },
      { en: 'S. Pellegrino (large)',   bg: 'S. Pellegrino (голяма)',price_bgn: 7.49 },
      { en: 'Hartridges Original Cola',bg: 'Хартриджис Кола',     price_bgn: 4.99 },
      { en: 'Hartridges Ginger Beer',  bg: 'Хартриджис Джинджифил',price_bgn: 4.99 },
      { en: 'Thomas Henry',            bg: 'Томас Хенри',         price_bgn: 4.49 },
      { en: 'Knjaz Milos',             bg: 'Кнез Милош',          price_bgn: 2.99 },
      { en: 'White Water (large)',      bg: 'White Water (голяма)',price_bgn: 4.99 },
      { en: 'White Water (small)',      bg: 'White Water (малка)', price_bgn: 2.99 },
      { en: 'Vichy Catalan',           bg: 'Виши Каталан',        price_bgn: 4.99 },
    ],
  },
  {
    category: 'Beer',
    categorySlugFallback: 'beer',
    items: [
      { en: 'Corona',             bg: 'Корона',           price_bgn: 6.99 },
      { en: 'Grolsch',            bg: 'Гролш',            price_bgn: 5.99 },
      { en: 'Stella Artois',      bg: 'Стела Артоа',      price_bgn: 5.49 },
      { en: 'Clausthaler Original',bg: 'Клаусталер',      price_bgn: 4.49 },
      { en: 'Leffe Blonde',       bg: 'Лефе Блонд',       price_bgn: 6.99 },
      { en: 'Alhambra Reserva',   bg: 'Алхамбра Резерва', price_bgn: 4.49 },
    ],
  },
  {
    category: 'Vodka',
    categorySlugFallback: 'vodka',
    items: [
      { en: 'Belvedere',  bg: 'Белведере',  price_bgn: 12.99 },
      { en: 'Grey Goose', bg: 'Грей Гус',   price_bgn: 10.99 },
      { en: 'Ketel One',  bg: 'Кетел Уан',  price_bgn: 7.99  },
    ],
  },
  {
    category: 'Gin',
    categorySlugFallback: 'gin',
    items: [
      { en: "Gin Mare",       bg: 'Джин Маре',        price_bgn: 11.99 },
      { en: "Hendrick's",     bg: 'Хендрикс',         price_bgn: 9.99  },
      { en: 'Tanqueray',      bg: 'Танкерей',         price_bgn: 6.99  },
      { en: "Gordon's Pink",  bg: 'Гордънс Пинк',     price_bgn: 4.99  },
    ],
  },
  {
    category: 'Rum',
    categorySlugFallback: 'rum',
    items: [
      { en: 'Zacapa 23',                    bg: 'Закапа 23',                       price_bgn: 20.99 },
      { en: 'Flor de Caña 18',              bg: 'Флор де Кания 18',                price_bgn: 13.99 },
      { en: 'Diplomatico Reserva Exclusiva',bg: 'Дипломатико Резерва Ексклузива',  price_bgn: 12.99 },
      { en: 'Bumbu XO',                     bg: 'Бумбу XO',                        price_bgn: 11.99 },
      { en: 'Bumbu The Original',           bg: 'Бумбу Оригинал',                  price_bgn: 9.99  },
    ],
  },
  {
    category: 'Cocktails',
    categorySlugFallback: 'cocktails',
    items: [
      { en: 'Luxurious',        bg: 'Луксозен',         price_bgn: 22.90 },
      { en: 'High-End',         bg: 'Хай-Енд',          price_bgn: 21.00 },
      { en: 'Hidden Berry',     bg: 'Скрита горска',    price_bgn: 14.60 },
      { en: 'Pink Elderflower', bg: 'Розов Бъз',        price_bgn: 15.20 },
      { en: 'Tropicano',        bg: 'Тропикано',        price_bgn: 14.90 },
      { en: 'Blooming Sour',    bg: 'Блуминг Сауър',    price_bgn: 14.40 },
      { en: 'Refresher',        bg: 'Рефрешър',         price_bgn: 17.20 },
    ],
  },
  {
    category: 'Cold Organic Latte Drinks',
    categorySlugFallback: 'cold-organic-latte',
    items: [
      { en: 'Spirulina Latte',  bg: 'Спирулина лате',   price_bgn: 7.90 },
      { en: 'Dragon Latte',     bg: 'Дракон лате',      price_bgn: 7.90 },
      { en: 'Golden Latte',     bg: 'Златно лате',      price_bgn: 7.20 },
      { en: 'Matcha Latte',     bg: 'Матча лате',       price_bgn: 7.50 },
      { en: 'Powerful Latte',   bg: 'Пауърфул лате',    price_bgn: 7.50 },
      { en: 'Butterfly Latte',  bg: 'Бътърфлай лате',   price_bgn: 7.50 },
    ],
  },
  {
    category: 'Non Alcoholic Cocktails',
    categorySlugFallback: 'non-alcoholic-cocktails',
    items: [
      { en: 'Tropical Mango 0%',   bg: 'Тропическо Манго 0%',   price_bgn: 16.90 },
      { en: 'Pineapple Mojito 0%', bg: 'Ананасов Мохито 0%',    price_bgn: 15.90 },
    ],
  },
  {
    category: 'Nuts',
    categorySlugFallback: 'nuts',
    items: [
      { en: 'Cashews',    bg: 'Кашу',     price_bgn: 6.49 },
      { en: 'Almonds',    bg: 'Бадеми',   price_bgn: 6.49 },
      { en: 'Pistachios', bg: 'Шам-фъстък',price_bgn: 6.49 },
      { en: 'Hazelnuts',  bg: 'Лешници',  price_bgn: 6.49 },
    ],
  },
  {
    category: 'Irish Whiskey',
    categorySlugFallback: 'irish-whiskey',
    items: [
      { en: 'Bushmills 16', bg: 'Бушмилс 16', price_bgn: 23.00 },
      { en: 'Bushmills 10', bg: 'Бушмилс 10', price_bgn: 8.99  },
    ],
  },
  {
    category: 'Scotch Whisky',
    categorySlugFallback: 'scotch-whisky',
    items: [
      { en: 'Johnnie Walker Blue Label',   bg: 'Джони Уокър Блу Лейбъл',   price_bgn: 89.99 },
      { en: 'Chivas Royal Salute 21',      bg: 'Чивас Роял Салют 21',      price_bgn: 42.00 },
      { en: 'Aberlour 14',                 bg: 'Абърлауър 14',             price_bgn: 19.99 },
      { en: 'Nomad Reserve 10',            bg: 'Номад Резерв 10',          price_bgn: 18.00 },
      { en: 'Chivas Regal 12',             bg: 'Чивас Регал 12',           price_bgn: 11.99 },
      { en: 'Johnnie Walker Black Label 12',bg:'Джони Уокър Блек Лейбъл 12',price_bgn: 8.99 },
    ],
  },
  {
    category: 'Japanese Whiskey',
    categorySlugFallback: 'japanese-whiskey',
    items: [
      { en: 'Nikka From The Barrel',  bg: 'Никка Фром Де Барел',  price_bgn: 18.00 },
      { en: 'Hibiki Japanese Harmony',bg: 'Хибики Джапанис Хармони', price_bgn: 28.00 },
      { en: 'Nobushi Blended',        bg: 'Нобуши Блендед',       price_bgn: 9.99  },
    ],
  },
  {
    category: 'Single Malt Whiskey',
    categorySlugFallback: 'single-malt-whiskey',
    items: [
      { en: 'Glenfiddich 18',   bg: 'Гленфидих 18',   price_bgn: 27.99 },
      { en: 'Lagavulin 16',     bg: 'Лагавулин 16',   price_bgn: 24.99 },
      { en: 'Macallan 12',      bg: 'Макалан 12',      price_bgn: 23.49 },
      { en: 'Dalmore 12',       bg: 'Далмор 12',       price_bgn: 23.99 },
      { en: 'Glenfiddich 15',   bg: 'Гленфидих 15',   price_bgn: 17.99 },
      { en: 'The Singleton 12', bg: 'Дъ Сингълтън 12',price_bgn: 11.99 },
      { en: 'Glenfiddich 12',   bg: 'Гленфидих 12',   price_bgn: 11.99 },
    ],
  },
  {
    category: 'Tequila',
    categorySlugFallback: 'tequila',
    items: [
      { en: 'Don Julio',               bg: 'Дон Хулио',         price_bgn: 8.49 },
      { en: 'Jose Cuervo Tradicional', bg: 'Хосе Куерво',       price_bgn: 4.49 },
    ],
  },
  {
    category: 'Liqueurs and Vermouths',
    categorySlugFallback: 'liqueurs-vermouths',
    items: [
      { en: 'Disaronno Originale', bg: 'Дизаронно',         price_bgn: 6.49 },
      { en: 'Baileys',             bg: 'Бейлис',            price_bgn: 5.99 },
      { en: 'Aperol',              bg: 'Апарол',            price_bgn: 5.99 },
      { en: 'Campari Bitter',      bg: 'Кампари Битер',     price_bgn: 5.99 },
      { en: 'Skinos',              bg: 'Скинос',            price_bgn: 5.99 },
      { en: 'Amaro Montenegro',    bg: 'Амаро Монтенегро',  price_bgn: 5.99 },
      { en: 'Jagermeister',        bg: 'Йегермайстер',      price_bgn: 3.99 },
    ],
  },
  {
    category: 'Cognac',
    categorySlugFallback: 'cognac',
    items: [
      { en: 'Hennessy VSOP',          bg: 'Хенеси ВСОП',           price_bgn: 17.49 },
      { en: 'Courvoisier VSOP',       bg: 'Курвоазие ВСОП',        price_bgn: 11.99 },
    ],
  },
  {
    category: 'Tennessee Whiskey and Bourbon',
    categorySlugFallback: 'tennessee-bourbon',
    items: [
      { en: 'Jack Daniels Sinatra Select', bg: 'Джак Даниелс Синатра Селект', price_bgn: 42.00 },
      { en: 'Gentleman Jack',              bg: 'Джентълмен Джак',              price_bgn: 11.99 },
      { en: 'Bulleit Bourbon',             bg: 'Булет Бърбън',                 price_bgn: 8.99  },
      { en: 'Bulleit Rye',                 bg: 'Булет Рай',                    price_bgn: 8.99  },
      { en: "Maker's Mark",                bg: 'Мейкърс Марк',                 price_bgn: 8.99  },
      { en: 'Jack Daniels',                bg: 'Джак Даниелс',                 price_bgn: 6.99  },
    ],
  },
  {
    category: 'White Wines',
    categorySlugFallback: 'white-wines',
    items: [
      { en: 'Petit-Chablis 2021',                    bg: 'Пти-Шабли 2021',                  price_bgn: 130.00 },
      { en: 'Albariño Atlantico',                    bg: 'Албариньо Атлантико',             price_bgn: 74.00  },
      { en: 'Marlborough Sauvignon Blanc',           bg: 'Марлборо Совиньон Блан',          price_bgn: 62.00  },
      { en: 'Sauvignon Blanc Babich 2022',           bg: 'Совиньон Блан Бабич 2022',        price_bgn: 54.00  },
      { en: 'Charme de Loire Sauvignon Blanc',       bg: 'Шарм де Лоар Совиньон Блан',     price_bgn: 46.00  },
      { en: 'Sauvignon Blanc',                       bg: 'Совиньон Блан',                  price_bgn: 44.00  },
      { en: 'La Petite Perrière Sauvignon Blanc',    bg: 'Ла Пти Пер Совиньон Блан',       price_bgn: 38.00  },
      { en: 'Origin Sauvignon Blanc Marlborough',    bg: 'Ориджин Совиньон Блан',          price_bgn: 30.00  },
      { en: 'Sauvignon Blanc Babich',                bg: 'Совиньон Блан Бабич',            price_bgn: 27.00  },
    ],
  },
  {
    category: 'Red Wines',
    categorySlugFallback: 'red-wines',
    items: [
      { en: 'Clinet Pomerol',                          bg: 'Клине Померол',                     price_bgn: 180.00 },
      { en: 'Cabernet Sauvignon',                      bg: 'Каберне Совиньон',                  price_bgn: 130.00 },
      { en: 'Valpolicella DOC',                        bg: 'Валполичела DOC',                   price_bgn: 68.00  },
      { en: 'Mavrud Unfiltered',                       bg: 'Мавруд Нефилтриран',               price_bgn: 52.00  },
      { en: 'Primitivo di Manduria San Gaetano DOP',   bg: 'Примитиво ди Мандурия',             price_bgn: 48.00  },
      { en: 'Primitivo di Manduria Lirica',            bg: 'Примитиво ди Мандурия Лирика',     price_bgn: 32.00  },
    ],
  },
  {
    category: 'Rosé Wines',
    categorySlugFallback: 'rose-wines',
    items: [
      { en: 'BY. OTT Rosé (750ml)',             bg: 'BY. OTT Розе (750мл)',            price_bgn: 88.00 },
      { en: 'BY. OTT Rosé (375ml)',             bg: 'BY. OTT Розе (375мл)',            price_bgn: 66.00 },
      { en: 'M De Minuty Rosé Côtes de Provence',bg:"М де Минюти Розе Кот де Прованс", price_bgn: 74.00 },
      { en: 'M De Minuty Rosé',                 bg: 'М де Минюти Розе',               price_bgn: 42.00 },
      { en: 'Rosé Miraflors',                   bg: 'Розе Мирафлорс',                 price_bgn: 54.00 },
      { en: 'Whispering Angel Rosé (750ml)',     bg: 'Уиспъринг Ейнджъл Розе (750мл)',price_bgn: 94.00 },
      { en: 'Whispering Angel Rosé (375ml)',     bg: 'Уиспъринг Ейнджъл Розе (375мл)',price_bgn: 52.00 },
    ],
  },
  {
    category: 'Sparkling Wines',
    categorySlugFallback: 'sparkling-wines',
    items: [
      { en: 'Veuve Clicquot Brut NV (750ml)',   bg: 'Вьов Кликo Брют NV (750мл)',    price_bgn: 220.00 },
      { en: 'Veuve Clicquot Brut NV (375ml)',   bg: 'Вьов Кликo Брют NV (375мл)',    price_bgn: 120.00 },
      { en: 'Deutz Brut Classic',               bg: 'Дютц Брют Класик',              price_bgn: 195.00 },
      { en: 'Billecart-Salmon Brut Réserve Rosé',bg:'Билкар-Салмон Брют Розе',       price_bgn: 295.00 },
      { en: 'Prosecco Rosé DOC',                bg: 'Просеко Розе DOC',              price_bgn: 70.00  },
      { en: 'Prosecco Brut',                    bg: 'Просеко Брют',                  price_bgn: 60.00  },
      { en: 'Prosecco Extra Dry',               bg: 'Просеко Екстра Драй',           price_bgn: 60.00  },
      { en: 'Prosecco Ruggeri',                 bg: 'Просеко Ружери',                price_bgn: 52.00  },
      { en: 'Prosecco Rosé Extra Dry',          bg: 'Просеко Розе Екстра Драй',      price_bgn: 42.00  },
      { en: 'CAJ Prosecco Extra Dry',           bg: 'CAJ Просеко Екстра Драй',       price_bgn: 29.00  },
      { en: 'Prosecco Argeo Ruggeri (glass)',    bg: 'Просеко Арджео Ружери (чаша)', price_bgn: 19.00  },
    ],
  },
  {
    category: 'Food',
    categorySlugFallback: 'food',
    items: [
      { en: 'Plate of Cheese and Sausages', bg: 'Плато сирена и колбаси', price_bgn: 18.90 },
      { en: 'Crackers',                     bg: 'Крекери',                price_bgn: 2.49  },
      { en: 'Spicy Pickles',                bg: 'Лют туршия',             price_bgn: 3.49  },
      { en: 'Taggiasca Olives',             bg: 'Маслини Тажаска',        price_bgn: 3.49  },
    ],
  },
]

// ── Main ────────────────────────────────────────────────────────────────────
async function run() {
  // 1. Fetch all categories (id + name.en + slug)
  const categories = await client.fetch(
    `*[_type == "category"]{_id, "nameEn": name.en, "slug": slug.current}`
  )

  console.log(`ℹ️   Loaded ${categories.length} categories from Sanity\n`)

  // Build lookup: normalised English name → _id
  const catByName = {}
  const catBySlug = {}
  categories.forEach(c => {
    if (c.nameEn) catByName[c.nameEn.toLowerCase().trim()] = c._id
    if (c.slug)   catBySlug[c.slug.toLowerCase().trim()] = c._id
  })

  // 2. Fetch existing items to avoid duplicates
  const existing = await client.fetch(
    `*[_type == "menuItem"]{_id, "nameEn": name.en, "catId": category._ref}`
  )
  const existingSet = new Set(existing.map(i => `${i.nameEn}|${i.catId}`))

  let created = 0, skipped = 0, missing = []

  for (const section of MENU) {
    // Resolve category ID
    const catId =
      catByName[section.category.toLowerCase().trim()] ||
      catBySlug[section.categorySlugFallback] ||
      null

    if (!catId) {
      missing.push(section.category)
      console.warn(`⚠️   Category not found: "${section.category}" — items skipped`)
      continue
    }

    console.log(`📂  ${section.category}`)

    let order = 1
    for (const item of section.items) {
      const key = `${item.en}|${catId}`
      if (existingSet.has(key)) {
        console.log(`   ⏭️   Skip (exists): ${item.en}`)
        skipped++
        continue
      }

      const priceEur = toEur(item.price_bgn)

      const doc = {
        _type: 'menuItem',
        name: { bg: item.bg || item.en, en: item.en },
        price: priceEur,
        category: { _type: 'reference', _ref: catId },
        isAvailable: true,
        isFeatured: false,
        isNew: false,
        order: order,
      }

      await client.create(doc)
      console.log(`   ✅  ${item.en} — €${priceEur} (${item.price_bgn} лв)`)
      created++
      order++
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅  Created: ${created} items`)
  console.log(`⏭️   Skipped: ${skipped} (already exist)`)
  if (missing.length) {
    console.log(`\n⚠️   Categories NOT found in Sanity:`)
    missing.forEach(m => console.log(`   - ${m}`))
    console.log(`\n   Run node scripts/add-categories.mjs first, then re-run this script.`)
  }
}

run().catch(err => {
  console.error('❌  Error:', err.message)
  process.exit(1)
})
