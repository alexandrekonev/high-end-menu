import Image from 'next/image'
import { t, ui_t, isNew, type Locale } from '@/lib/i18n'
import type { MenuItemData } from './MenuShell'
import s from './ItemRow.module.css'

interface Props { item: MenuItemData; locale: Locale; compact?: boolean }

const TAG_ICONS: Record<string, string> = {
  vegetarian: '🌱', vegan: '🌿', 'gluten-free': '🌾', spicy: '🌶', premium: '⭐',
}

export default function ItemRow({ item, locale, compact = false }: Props) {
  const novel = isNew(item._createdAt)
  const name = t(item.name, locale)
  const desc = t(item.description, locale)

  if (compact) {
    return (
      <div className={s.compact}>
        <div className={s.compactInfo}>
          <span className={s.compactName}>
            {name}
            {novel && <span className={s.inlineNew}> 🆕</span>}
            {item.isFeatured && <span className={s.inlineFeat}> ⚡</span>}
          </span>
          {desc && <span className={s.compactDesc}>{desc}</span>}
          {item.tags?.map((tag) => <span key={tag} className={s.smallTag}>{TAG_ICONS[tag]}</span>)}
        </div>
        <div className={s.compactRight}>
          <span className={s.price}>{item.price} €</span>
          {item.volume && <span className={s.vol}>{item.volume}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className={s.row}>
      {/* Thumbnail — само ако е въведена снимка */}
      {item.image && (
        <div className={s.thumb}>
          <Image src={item.image} alt={name} fill sizes="64px" className={s.thumbImg} />
        </div>
      )}

      <div className={s.info}>
        <div className={s.nameRow}>
          <span className={s.name}>{name}</span>
          {novel && <span className={`${s.badge} ${s.badgeNew}`}>{ui_t('tag_new', locale)}</span>}
          {item.isFeatured && <span className={`${s.badge} ${s.badgeFeat}`}>{ui_t('tag_featured', locale)}</span>}
        </div>
        {item.subCategory && <div className={s.origin}>{item.subCategory}</div>}
        {desc && <div className={s.desc}>{desc}</div>}
        {item.tags && item.tags.length > 0 && (
          <div className={s.tags}>
            {item.tags.map((tag) => <span key={tag} className={s.tag}>{TAG_ICONS[tag]}</span>)}
          </div>
        )}
        {item.allergens && item.allergens.length > 0 && (
          <div className={s.allergens}>
            {ui_t('allergens', locale)}: {item.allergens.map((a) => ui_t(`allergen_${a}` as never, locale)).join(', ')}
          </div>
        )}
      </div>

      <div className={s.right}>
        <span className={s.price}>{item.price} €</span>
        {item.volume && <span className={s.vol}>{item.volume}</span>}
      </div>
    </div>
  )
}
