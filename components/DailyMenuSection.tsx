'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { t, ui_t, isWithinTimeWindow, type Locale } from '@/lib/i18n'
import s from './DailyMenuSection.module.css'

interface Dish {
  name: { bg?: string; en?: string }
  description?: { bg?: string; en?: string }
  price?: string
  tags?: string[]
  image?: string
}

interface Section {
  heading: { bg?: string; en?: string }
  dishes: Dish[]
}

interface Props {
  menu: {
    validFrom: string
    validUntil: string
    chefNote?: { bg?: string; en?: string }
    sections: Section[]
  }
  locale: Locale
}

const TAG_ICONS: Record<string, string> = {
  vegetarian: '🌱', vegan: '🌿', 'gluten-free': '🌾', special: '⭐',
}

export default function DailyMenuSection({ menu, locale }: Props) {
  const [active, setActive] = useState(false)

  // Check time window every 30 seconds
  useEffect(() => {
    const check = () => setActive(isWithinTimeWindow(menu.validFrom, menu.validUntil))
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [menu.validFrom, menu.validUntil])

  const chefNote = t(menu.chefNote, locale)

  return (
    <div className={s.wrapper}>
      {/* ── Header ── */}
      <div className={s.header}>
        <div className={s.headerIcon}>🍽</div>
        <div>
          <div className={s.title}>{ui_t('lunchTitle', locale)}</div>
          <div className={s.hours}>
            {ui_t('lunchHours', locale, { from: menu.validFrom, until: menu.validUntil })}
          </div>
        </div>
        <div className={`${s.pill} ${active ? s.pillActive : s.pillInactive}`}>
          {active ? ui_t('lunchActive', locale) : ui_t('lunchInactive', locale)}
        </div>
      </div>

      {/* Inactive state */}
      {!active && (
        <div className={s.inactive}>
          <span className={s.inactiveIcon}>⏰</span>
          <p>{ui_t('lunchInactive', locale)}</p>
          <p className={s.inactiveHours}>
            {ui_t('lunchHours', locale, { from: menu.validFrom, until: menu.validUntil })}
          </p>
        </div>
      )}

      {/* Chef's note */}
      {active && chefNote && (
        <div className={s.chefNote}>
          <span className={s.chefNoteIcon}>👨‍🍳</span> {chefNote}
        </div>
      )}

      {/* Sections */}
      {active && menu.sections.map((section, si) => (
        <div key={si} className={s.section}>
          <div className={s.sectionHeading}>{t(section.heading, locale)}</div>
          <div className={s.dishes}>
            {section.dishes.map((dish, di) => (
              <div key={di} className={s.dish}>
                {/* Photo */}
                {dish.image && (
                  <div className={s.dishPhoto}>
                    <Image src={dish.image} alt={t(dish.name, locale)} fill sizes="80px" className={s.dishImg} />
                  </div>
                )}

                <div className={s.dishInfo}>
                  <div className={s.dishName}>{t(dish.name, locale)}</div>
                  {dish.description && (
                    <div className={s.dishDesc}>{t(dish.description, locale)}</div>
                  )}
                  {dish.tags && dish.tags.length > 0 && (
                    <div className={s.dishTags}>
                      {dish.tags.map((tag) => (
                        <span key={tag} className={s.dishTag}>{TAG_ICONS[tag] ?? tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {dish.price && (
                  <div className={s.dishPrice}>{dish.price} €</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
