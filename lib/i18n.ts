export type Locale = 'bg' | 'en'

export const ui = {
  bg: {
    // Nav
    menu: 'Меню',
    lunchMenu: 'Обедно меню',
    langSwitch: 'EN',
    // Lunch
    lunchTitle: 'Обедно меню',
    lunchActive: 'Обедното меню е активно',
    lunchInactive: 'Обедното меню не е активно в момента',
    lunchHours: 'Работи от {from} до {until}',
    // Happy hour
    happyHour: 'Happy Hour',
    // Tags
    tag_vegetarian: '🌱 Вегетарианско',
    tag_vegan: '🌿 Веган',
    tag_gluten_free: '🌾 Без глутен',
    tag_spicy: '🌶 Пикантно',
    tag_premium: '⭐ Premium',
    tag_special: '⭐ Специалитет',
    tag_featured: '⚡ Препоръчано',
    tag_new: '🆕 Ново',
    // Allergens
    allergens: 'Алергени',
    allergen_gluten: 'Глутен',
    allergen_eggs: 'Яйца',
    allergen_milk: 'Мляко',
    allergen_nuts: 'Ядки',
    allergen_peanuts: 'Фъстъци',
    allergen_soy: 'Соя',
    allergen_sulphites: 'Серен диоксид',
    allergen_fish: 'Риба',
    allergen_shellfish: 'Морски дарове',
    allergen_sesame: 'Сусам',
    allergen_celery: 'Целина',
    allergen_mustard: 'Синап',
    // Footer
    scanQr: 'Сканирай QR кода',
    copyright: '© The High-End Bar. Всички права запазени.',
  },
  en: {
    menu: 'Menu',
    lunchMenu: "Today's Lunch",
    langSwitch: 'BG',
    lunchTitle: "Today's Lunch Menu",
    lunchActive: 'Lunch menu is now active',
    lunchInactive: 'Lunch menu is not active right now',
    lunchHours: 'Served from {from} to {until}',
    happyHour: 'Happy Hour',
    tag_vegetarian: '🌱 Vegetarian',
    tag_vegan: '🌿 Vegan',
    tag_gluten_free: '🌾 Gluten-free',
    tag_spicy: '🌶 Spicy',
    tag_premium: '⭐ Premium',
    tag_special: '⭐ Special',
    tag_featured: '⚡ Recommended',
    tag_new: '🆕 New',
    allergens: 'Allergens',
    allergen_gluten: 'Gluten',
    allergen_eggs: 'Eggs',
    allergen_milk: 'Milk',
    allergen_nuts: 'Nuts',
    allergen_peanuts: 'Peanuts',
    allergen_soy: 'Soy',
    allergen_sulphites: 'Sulphites',
    allergen_fish: 'Fish',
    allergen_shellfish: 'Shellfish',
    allergen_sesame: 'Sesame',
    allergen_celery: 'Celery',
    allergen_mustard: 'Mustard',
    scanQr: 'Scan QR code',
    copyright: '© The High-End Bar. All rights reserved.',
  },
} as const

export type UIKey = keyof typeof ui.bg

/** Pick the right locale string from a { bg, en } object */
export function t(
  field: { bg?: string | null; en?: string | null } | null | undefined,
  locale: Locale
): string {
  if (!field) return ''
  if (locale === 'en') return field.en || field.bg || ''
  return field.bg || ''
}

/** Get a UI string by key */
export function ui_t(key: UIKey, locale: Locale, vars?: Record<string, string>): string {
  let str = (ui[locale] as Record<string, string>)[key] ?? (ui.bg as Record<string, string>)[key] ?? key
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, v) })
  }
  return str
}

/** Is an item "new" (created < 14 days ago)? */
export function isNew(createdAt: string): boolean {
  const ms = Date.now() - new Date(createdAt).getTime()
  return ms < 14 * 24 * 60 * 60 * 1000
}

/** Is current time within HH:MM–HH:MM window? */
export function isWithinTimeWindow(from: string, until: string): boolean {
  const now = new Date()
  const [fh, fm] = from.split(':').map(Number)
  const [uh, um] = until.split(':').map(Number)
  const