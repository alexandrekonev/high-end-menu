import { Locale, t, isNew, toEur } from '@/lib/i18n'
import { MenuItemData } from './MenuShell'
import styles from './ItemCard.module.css'

interface ItemCardProps {
  item: MenuItemData
  locale: Locale
  showPriceBgn?: boolean
  showPriceEur?: boolean
}

export default function ItemCard({ item, locale, showPriceBgn = true, showPriceEur = true }: ItemCardProps) {
  const isNewItem = isNew(item._createdAt)

  const tagLabels: { [key: string]: string } = {
    vegetarian: locale === 'bg' ? 'Вегетариански' : 'Vegetarian',
    vegan: locale === 'bg' ? 'Веган' : 'Vegan',
    'gluten-free': locale === 'bg' ? 'Без глутен' : 'Gluten-Free',
    spicy: locale === 'bg' ? 'Остро' : 'Spicy',
    premium: 'Premium',
    featured: locale === 'bg' ? 'Препоръчано' : 'Featured',
  }

  return (
    <div className={styles.card}>
      {/* Image Section */}
      {item.image && (
        <div className={styles.imageWrapper}>
          <img
            src={item.image}
            alt={t(item.name, locale)}
            className={styles.image}
          />
          {isNewItem && <div className={styles.newBadge}>NEW</div>}
        </div>
      )}

      {/* Content Section */}
      <div className={styles.content}>
        <h3 className={styles.name}>{t(item.name, locale)}</h3>

        {item.description && (
          <p className={styles.description}>{t(item.description, locale)}</p>
        )}

        {item.volume && (
          <p className={styles.volume}>
            <span className={styles.volumeLabel}>Vol:</span> {item.volume}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className={styles.tags}>
            {item.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tagLabels[tag] || tag}
              </span>
            ))}
          </div>
        )}

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className={styles.allergens}>
            <strong>⚠️</strong> {item.allergens.join(', ')}
          </div>
        )}

        {/* Price */}
        {(showPriceBgn || showPriceEur) && (
          <div className={styles.priceSection}>
            {showPriceEur && <span className={styles.priceEur}>€ {toEur(item.price)}</span>}
            {showPriceBgn && <span className={styles.price}>{item.price} лв.</span>}
          </div>
        )}
      </div>
    </div>
  )
}
