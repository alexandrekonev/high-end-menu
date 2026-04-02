import { groq } from 'next-sanity'

// ── Settings ────────────────────────────────────────────────────
export const settingsQuery = groq`
  *[_type == "siteSettings"][0] {
    happyHourActive,
    happyHourFrom,
    happyHourUntil,
    happyHourText,
    address,
    footerNote,
  }
`

// ── Categories ──────────────────────────────────────────────────
export const categoriesQuery = groq`
  *[_type == "category" && isActive == true] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    icon,
    group,
    displayStyle,
  }
`

// ── Menu Items ──────────────────────────────────────────────────
export const menuItemsQuery = groq`
  *[_type == "menuItem" && isAvailable == true] | order(category->order asc, order asc) {
    _id,
    name,
    description,
    price,
    volume,
    tags,
    isFeatured,
    allergens,
    subCategory,
    _createdAt,
    "image": image.asset->url,
    "imageHotspot": image.hotspot,
    "imageCrop": image.crop,
    "categorySlug": category->slug.current,
    "categoryIcon": category->icon,
  }
`

// ── Today's Daily Menu ───────────────────────────────────────────
export const todayMenuQuery = groq`
  *[
    _type == "dailyMenu"
    && date == $today
    && isActive == true
  ][0] {
    _id,
    date,
    validFrom,
    validUntil,
    chefNote,
    sections[] {
      heading,
      dishes[] {
        name,
        description,
        price,
        tags,
        "image": image.asset->url,
        "imageHotspot": image.hotspot,
      }
    }
  }
`

// ── All Daily Menus (for Studio preview / archive) ──────────────
export const allDailyMenusQuery = groq`
  *[_type == "dailyMenu"] | order(date desc) {
    _id, date, validFrom, validUntil, isActive,
  }
`
