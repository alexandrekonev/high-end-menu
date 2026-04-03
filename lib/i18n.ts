export type Locale = 'bg' | 'en'

export interface LocalizedField {
  bg?: string | null
  en?: string | null
}

export function t(
  field: LocalizedField | null | undefined,
  locale: Locale
): string {
  if (!field) return ''
  if (locale === 'bg') {
    return field.bg || field.en || ''
  }
  return field.en || field.bg || ''
}

export function isWithinTimeWindow(from: string, until: string): boolean {
  const now = new Date()
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()
  const currentTime = currentHours * 60 + currentMinutes

  const [fromH, fromM] = from.split(':').map(Number)
  const fromTime = fromH * 60 + fromM

  const [untilH, untilM] = until.split(':').map(Number)
  const untilTime = untilH * 60 + untilM

  return currentTime >= fromTime && currentTime < untilTime
}

export function isNew(createdAt: string): boolean {
  const created = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays < 14
}

export const UI_STRINGS = {
  bg: {
    title: 'The High‑End Bar',
    menu: 'Меню',
    happyHour: 'Щастлив час',
    lunchMenu: 'Меню за обед',
    language: 'EN',
    back: 'Назад',
    price: 'Цена',
    volume: 'Обем',
    allergens: 'Алергени',
    notAvailable: 'Недостъпно',
    vegetarian: 'Вегетариански',
    vegan: 'Веган',
    glutenFree: 'Без глутен',
    spicy: 'Острo',
    premium: 'Premium',
    featured: 'Препоръчано',
    address: 'Адрес',
    copyright: 'Всички права запазени',
    new: 'НОВО',
    notActiveYet: 'Менюто не е активно в момента',
    validFrom: 'Валидно от',
    validUntil: 'до',
    chefNote: 'Забележка на шефа',
  },
  en: {
    title: 'The High-End Bar',
    menu: 'Menu',
    happyHour: 'Happy Hour',
    lunchMenu: 'Lunch Menu',
    language: 'BG',
    back: 'Back',
    price: 'Price',
    volume: 'Volume',
    allergens: 'Allergens',
    notAvailable: 'Not Available',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    glutenFree: 'Gluten-Free',
    spicy: 'Spicy',
    premium: 'Premium',
    featured: 'Featured',
    address: 'Address',
    copyright: 'All rights reserved',
    new: 'NEW',
    notActiveYet: 'This menu is not active at the moment',
    validFrom: 'Valid from',
    validUntil: 'to',
    chefNote: 'Chef\'s Note',
  },
}

export function ui_t(key: keyof typeof UI_STRINGS.bg, locale: Locale): string {
  return UI_STRINGS[locale][key] || ''
}

// BGN is fixed to EUR at 1.95583 (Bulgarian Currency Board)
const BGN_TO_EUR = 1.95583

/**
 * Converts a BGN price string to EUR.
 * Handles formats like "8", "12.50", "12 / 55", "8лв", etc.
 * Returns e.g. "4.09" or "6.14 / 28.12"
 */
export function toEur(priceBgn: string): string {
  return priceBgn.replace(/\d+([.,]\d+)?/g, (match) => {
    const num = parseFloat(match.replace(',', '.'))
    if (isNaN(num)) return match
    return (num / BGN_TO_EUR).toFixed(2)
  })
}
