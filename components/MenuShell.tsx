'use client'

import { useState, useEffect, useRef } from 'react'
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
  const navRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

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

  // Group items by category slug
  const itemsByCategory: { [key: string]: MenuItemData[] } = {}
  items.forEach((item) => {
    if (!itemsByCategory[item.categorySlug]) {
      itemsByCategory[item.categorySlug] = []
    }
    itemsByCategory[item.categorySlug].push(item)
  })

  // Group items by subcategory within a category
  const itemsBySubCategory = (categorySlug: string) => {
    const categoryItems = itemsByCategory[categorySlug] || []
    const grouped: { [key: string]: MenuItemData[] } = {}
    categoryItems.forEach((item) => {
      const subCat = item.subCategory || '__none__'
      if (!grouped[subCat]) grouped[subCat] = []
      grouped[subCat].push(item)
    })
    return grouped
  }

  // Scroll to section when nav button clicked
  const scrollToSection = (slug: string) => {
    setActiveSlug(slug)
    const el = document.getElementById(`section-${slug}`)
    if (el) {
      const navHeight = navRef.current?.offsetHeight || 48
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16
      window.scrollTo({ top, behavior: 'smooth' })
    }
    // Scroll active nav button into view
    const btn = document.getElementById(`nav-${slug}`)
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  // Highlight active nav button on scroll (IntersectionObserver)
  useEffect(() => {
    if (categories.length === 0) return
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute('data-slug')
            if (slug) setActiveSlug(slug)
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    categories.forEach((cat) => {
      const el = document.getElementById(`section-${cat.slug}`)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [categories])

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        {/* Top bar with language toggle */}
        <div className={styles.topBar}>
          <div className={styles.topBarInner}>
            <a
              href={locale === 'bg' ? '/menu' : '/menu'}
              className={`${styles.langBtn} ${locale === 'bg' ? styles.langActive : ''}`}
            >БГ</a>
            <span className={styles.langSep}>|</span>
            <a
              href={locale === 'bg' ? '/menu/en' : '/menu'}
              className={`${styles.langBtn} ${locale === 'en' ? styles.langActive : ''}`}
            >EN</a>
          </div>
        </div>
        {/* Hero section: emblem on top, text logo below */}
        <div className={styles.hero}>
          <img
            src="https://www.high-end.bg/images/static/logo-sign-light.svg"
            alt=""
            className={styles.heroEmblem}
          />
          <img
            src="https://www.high-end.bg/images/static/logo-vertical-text.svg"
            alt="The High-End Bar"
            className={styles.heroLogo}
          />
        </div>
      </header>

      {/* Happy Hour Banner */}
      {happyHourActive && (
        <div className={styles.happyHourBanner}>
          <span>🍹</span>
          <span>{t(settings?.happyHourText, locale) || ui_t('happyHour', locale)}</span>
        </div>
      )}

      {/* Sticky Category Navigation */}
      <nav className={styles.categoryNav} ref={navRef}>
        <div className={styles.categoryScroller}>
          {categories.map((cat) => (
            <button
              key={cat._id}
              id={`nav-${cat.slug}`}
              onClick={() => scrollToSection(cat.slug)}
              className={`${styles.categoryButton} ${activeSlug === cat.slug ? styles.active : ''}`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              <span>{t(cat.name, locale)}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Daily Lunch Menu */}
        {lunchMenuActive && (
          <section className={styles.lunchSection}>
            <DailyMenuSection menu={dailyMenu as any} locale={locale} />
          </section>
        )}

        {/* All Category Sections */}
        {categories.map((cat) => {
          const catItems = itemsByCategory[cat.slug] || []
          const subGroups = itemsBySubCategory(cat.slug)

          return (
            <section
              key={cat._id}
              id={`section-${cat.slug}`}
              data-slug={cat.slug}
              className={styles.section}
            >
              <h2 className={styles.sectionTitle}>
                {cat.icon && <span className={styles.sectionIcon}>{cat.icon}</span>}
                {t(cat.name, locale)}
              </h2>
              <div className={styles.divider} />

              {catItems.length === 0 ? (
                <p className={styles.empty}>—</p>
              ) : cat.displayStyle === 'cards' ? (
                <div className={styles.cardsGrid}>
                  {catItems.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      locale={locale}
                      showPriceBgn={settings?.showPriceBgn !== false}
                      showPriceEur={settings?.showPriceEur !== false}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.listContainer}>
                  {Object.entries(subGroups).map(([subCat, subItems]) => (
                    <div key={subCat} className={styles.subCategoryGroup}>
                      {subCat !== '__none__' && (
                        <h3 className={styles.subCategoryTitle}>{subCat}</h3>
                      )}
                      <div className={styles.itemsList}>
                        {subItems.map((item) => (
                          <ItemRow
                            key={item._id}
                            item={item}
                            locale={locale}
                            compact={cat.displayStyle === 'compact'}
                            showPriceBgn={settings?.showPriceBgn !== false}
                            showPriceEur={settings?.showPriceEur !== false}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <img
            src="https://www.high-end.bg/images/static/logo-sign-light.svg"
            alt="The High-End Bar"
            className={styles.footerLogo}
          />
          <div className={styles.footerInfo}>
            {settings?.address && <p className={styles.address}>{settings.address}</p>}
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
