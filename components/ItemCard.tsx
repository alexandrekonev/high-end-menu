import Image from 'next/image'
import { t, ui_t, isNew, type Locale } from '@/lib/i18n'
import type { MenuItemData } from './MenuShell'
import s from './ItemCard.module.css'

interface Props {
  item: MenuItemData
  locale: Locale
  fallbackIcon?: string
}

const TAG_LABELS: Record<string, string> = {
  vegetarian: '🌱', vegan: '🌿', 'gluten-free': '🌾',
  spicy: '🌶', premium: '⭐', featured: '⚡',
}

export default function ItemCard({ item, locale, fallbackIcon }: Props) {
  const novel = isNew(item._createdAt)
  const featured = item.isFeatured
  const name = t(item.name, locale)
  const desc = t(item.description, locale)

  return (
    <article className={s.card}>
      {/* Photo — само ако е въведена снимка */}
      {item.image && (
        <div className={s.photoWrap}>
          <Image
            src={item.image}
            alt={name}
            fill
            sizes="(max-width:480px) 50vw, (max-width:700px) 33vw, 25vw"
            className={s.photo}
          />

          {/* Badges */}
          <div className={s.badges}>
            {novel && <span className={`${s.badge} ${s.badgeNew}`}>{ui_t('tag_new', locale)}</span>}
            {featured && <span className={`${s.badge} ${s.badgeFeatured}`}>{ui_t('tag_featured', locale)}</span>}
          </div>
        </div>
      )}

      <div className={s.body}>
        <div className={s.name}>{name}</div>
        {desc && <div className={s.desc}>{desc}</div>}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className={s.tags}>
            {item.tags.map((tag) => (
              <span key={tag} className={s.tag}>{TAG_LABELS[tag] ?? tag}</span>
            ))}
          </div>
        )}

        <div className={s.footer}>
          <span className={s.price}>{item.price} €</span>
          {item.volume && <span className={s.volume}>{item.volume}</span>}
        </div>

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className={s.allergens}>
            {ui_t('allergens', locale)}: {item.allergens.map((a) => ui_t(`allergen_${a}` as never, locale)).join(', ')