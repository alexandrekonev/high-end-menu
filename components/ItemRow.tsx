import { Locale, t, toBgn } from '@/lib/i18n'
import { MenuItemData } from './MenuShell'
import styles from './ItemRow.module.css'

interface ItemRowProps {
  item: MenuItemData
  locale: Locale
  compact?: boolean
  showPriceBgn?: boolean
  showPriceEur?: boolean
}

export default function ItemRow({ item, locale, compact = false, showPriceBgn = true, showPriceEur = true }: ItemRowProps) {
  const allTags = [...(item.tags || []), ...(item.customTags || [])]

  return (
    <div className={styles.rowOuter}>
      <div className={`${styles.row} ${compact ? styles.compact : ''}`}>
        {/* NEW badge — inside row, top-right corner */}
        {item.isNew && (
          <span className={styles.newBadge}>
            {locale === 'bg' ? 'НОВО' : 'NEW'}
          </span>
        )}
        {/* Optional Image Thumbnail */}
        {item.image && (
          <div className={styles.thumbnail}>
            <img
              src={item.image}
              alt={t(item.name, locale)}
              className={styles.image}
            />
          </div>
        )}

        {/* Main Content */}
        <div className={`${styles.mainContent} ${item.isNew ? styles.hasNewBadge : ''}`}>
          <div className={styles.header}>
            <div className={styles.nameCol}>
              <h4 className={styles.name}>{t(item.name, locale)}</h4>
              {item.isFeatured && (
                <span className={styles.featuredBadge}>
                  ⭐ {locale === 'bg' ? 'Препоръчано' : 'Featured'}
                </span>
              )}
            </div>
            {(showPriceBgn || showPriceEur) && (
              <div className={styles.priceGroup}>
                {showPriceEur && <span className={styles.priceEur}>€ {item.price}</span>}
                {showPriceBgn && <span className={styles.price}>{toBgn(item.price)} лв.</span>}
              </div>
            )}
          </div>

          {item.description && (
            <p className={styles.description}>{t(item.description, locale)}</p>
          )}

          {/* Volume & Tags */}
          <div className={styles.meta}>
            {item.volume && (
              <span className={styles.volume}>
                <span className={styles.label}>Vol:</span> {item.volume}
              </span>
            )}

            {allTags.length > 0 && (
              <div className={styles.tags}>
                {allTags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className={styles.allergens}>
              <strong>⚠️</strong> {item.allergens.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
