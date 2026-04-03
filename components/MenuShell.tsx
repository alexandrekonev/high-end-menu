'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Locale, t, ui_t, isWithinTimeWindow } from '@/lib/i18n'
import ItemCard from './ItemCard'
import ItemRow from './ItemRow'
import DailyMenuSection from './DailyMenuSection'
import styles from './MenuShell.module.css'

export interface MenuItemData {
  _id: string
  name: { bg?: string | null; en?: string | null }
  description?: { bg?: string | null; en?: string | null } | null
  price: string
  volume?: string | null
  tags?: string[] | null
  isFeatured?: boolean | null
  allergens?: string[] | null
  subCategory?: string | null
  _createdAt: string
  image?: string | null
  categorySlug: string
}

export interface CategoryData {
  _id: string
  name: { bg?: string | null; en?: string | null }
  slug: string
  icon?: string | null
  displayStyle: 'cards' | 'list' | 'compact'
}

interface MenuShellProps {
  categories: CategoryData[]
  items: MenuItemData[]
  settings: any
  dailyMenu: any
  locale: Locale
}

export default function MenuShell({
  categories,
  items,
  settings,
  dailyMenu,
  locale,
}: MenuShellProps) {
  const [activeSlug, setActiveSlug] = useState<string>(
    categories.length > 0 ? categories[0].slug : ''
  )

  const happyHourActive =
    settings?.happyHourActive &&
    isWithinTimeWindow(
      settings?.happyHourFrom || '17:00',
      settings?.happyHourUntil || '18:00'
    )

  const lunchMenuActive =
    settings?.lunchMenuActive &&
    dailyMenu &&
    isWithinTimeWindow(
      dailyMenu?.validFrom || '12:00',
      dailyMenu?.validUntil || '15:00'
    )

  const itemsByCategory = useMemo(() => {
    const grouped: { [key: string]: MenuItemData[] } = {}
    items.forEach((item) => {
      if (!grouped[item.categorySlug]) {
        grouped[item.categorySlug] = []
      }
      grouped[item.categorySlug].push(item)
    })
    return grouped
  }, [items])

  const itemsBySubCategory = (categorySlug: string) => {
    const categoryItems = itemsByCategory[categorySlug] || []
    const grouped: { [key: string]: MenuItemData[] } = {}

    categoryItems.forEach((item) => {
      const subCat = item.subCategory || 'Other'
      if (!grouped[subCat]) {
        grouped[subCat] = []
      }
      grouped[subCat].push(item)
    })

    return grouped
  }

  const activeCategory = categories.find((c) => c.slug === activeSlug)

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img
            src="https://www.high-end.bg/images/static/logo-sign-light.svg"
            alt="The High-End Bar"
            className={styles.logo}
          />
          <h1 className={styles.siteName}>{ui_t('title', locale)}</h1>
        </div>

        <Link
          href={locale === 'bg' ? '/menu/en' : '/menu'}
          className={styles.langToggle}
        >
          {ui_t('language', locale)}
        </Link>
      </header>

      {/* Happy Hour Banner */}
      {happyHourActive && (
        <div className={styles.happyHourBanner}>
          <span className={styles.happyHourIcon}>🍹</span>
          <span className={styles.happyHourText}>
            {t(settings?.happyHourText, locale) || ui_t('happyHour', locale)}
          </span>
        </div>
      )}

      {/* Daily Lunch Menu Section */}
      {lunchMenuActive && (
        <section className={styles.lunchSection}>
          <DailyMenuSection menu={dailyMenu} locale={locale} />
        </section>
      )}

      {/* Category Navigation */}
      <nav className={styles.categoryNav}>
        <div className={styles.categoryScroller}>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveSlug(cat.slug)}
              className={`${styles.categoryButton} ${
                activeSlug === cat.slug ? styles.active : ''
              }`}
            >
              {cat.icon && <span className={styles.icon}>{cat.icon}</span>}
              <span>{t(cat.name, locale)}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        {activeCategory && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t(activeCategory.name, locale)}
            </h2>

            {activeCategory.displayStyle === 'cards' ? (
              // Cards Grid
              <div className={styles.cardsGrid}>
                {(itemsByCategory[activeSlug] || []).map((item) => (
                  <ItemCard key={item._id} item={item} locale={locale} />
                ))}
              </div>
            ) : (
              // List View (list or compact)
              <div className={styles.listContainer}>
                {Object.entries(itemsBySubCategory(activeSlug)).map(
                  ([subCat, subItems]) => (
                    <div key={subCat} className={styles.subCategoryGroup}>
                      {subCat !== 'Other' && (
                        <h3 className={styles.subCategoryTitle}>{subCat}</h3>
                      )}
                      <div className={styles.itemsList}>
                        {subItems.map((item) => (
                          <ItemRow
                            key={item._id}
                            item={item}
                            locale={locale}
                            compact={activeCategory.displayStyle === 'compact'}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <img
            src="https://www.high-end.bg/images/static/logo-sign-light.svg"
            alt="The High-End Bar"
            className={styles.footerLogo}
          />
          <div className={styles.footerInfo}>
            {settings?.address && (
              <p className={styles.address}>{settings.address}</p>
            )}
            {settings?.footerNote && (
              <p className={styles.note}>{t(settings.footerNote, locale)}</p>
            )}
            <p className={styles.copyright}>
              © 2024 The High-End Bar. {ui_t('copyright', locale)}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
