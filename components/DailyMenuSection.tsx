import { Locale, t, ui_t, isWithinTimeWindow } from '@/lib/i18n'
import styles from './DailyMenuSection.module.css'

interface DailyMenuSectionProps {
  menu: any
  locale: Locale
  hideTitle?: boolean
}

export default function DailyMenuSection({ menu, locale, hideTitle = false }: DailyMenuSectionProps) {
  if (!menu) {
    return null
  }

  const isActive = isWithinTimeWindow(
    menu.validFrom || '12:00',
    menu.validUntil || '15:00'
  )

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        {!hideTitle && <h2 className={styles.title}>{ui_t('lunchMenu', locale)}</h2>}
        <div className={styles.timeWindow}>
          <span className={styles.timeLabel}>{ui_t('validFrom', locale)}:</span>
          <span className={styles.time}>{menu.validFrom}</span>
          <span className={styles.timeLabel}>{ui_t('validUntil', locale)}:</span>
          <span className={styles.time}>{menu.validUntil}</span>
        </div>
      </div>

      {menu.chefNote && (
        <div className={styles.chefNote}>
          <strong>{ui_t('chefNote', locale)}:</strong>{' '}
          {t(menu.chefNote, locale)}
        </div>
      )}

      {!isActive && (
        <div className={styles.notActive}>
          {ui_t('notActiveYet', locale)}
        </div>
      )}

      {isActive && menu.sections && (
        <div className={styles.sections}>
          {menu.sections.map((section: any, idx: number) => (
            <div key={idx} className={styles.sectionGroup}>
              <h3 className={styles.sectionHeading}>
                {t(section.heading, locale)}
              </h3>
              <div className={styles.dishes}>
                {section.dishes && section.dishes.map((dish: any, dishIdx: number) => (
                  <div key={dishIdx} className={styles.dish}>
                    <div className={styles.dishHeader}>
                      <h4 className={styles.dishName}>
                        {t(dish.name, locale)}
                      </h4>
                      {dish.price && (
                        <span className={styles.dishPrice}>{dish.price}</span>
                      )}
                    </div>
                    {dish.description && (
                      <p className={styles.dishDescription}>
                        {t(dish.description, locale)}
                      </p>
                    )}
                    {dish.tags && dish.tags.length > 0 && (
                      <div className={styles.tags}>
                        {dish.tags.map((tag: string) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
