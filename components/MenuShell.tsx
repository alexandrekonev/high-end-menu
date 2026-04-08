'use client'

import { useState, useEffect, useRef } from 'react'
import { Locale, t, ui_t, isWithinTimeWindow } from '@/lib/i18n'
import ItemCard from './ItemCard'
import ItemRow from './ItemRow'
import DailyMenuSection from './DailyMenuSection'
import styles from './MenuShell.module.css'

// Fallback logo URLs (used when no logo is uploaded in Sanity)
const FALLBACK_EMBLEM = 'https://www.high-end.bg/images/static/logo-sign-light.svg'
const FALLBACK_LOGO   = 'https://www.high-end.bg/images/static/logo-vertical-text.svg'
const FALLBACK_COLOR  = '#845D41'
const FALLBACK_NAME   = 'Restaurant'

export interface MenuItemData {
  _id: string
  name: { bg?: string | null; en?: string | null }
  description?: { bg?: string | null; en?: string | null } | null
  price: string
  volume?: string | null
  tags?: string[] | null
  customTags?: string[] | null
  isFeatured?: boolean | null
  isNew?: boolean | null
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
  const isScrollingRef = useRef(false)

  // ── Derived settings with fallbacks ─────────────────────────────────────
  const venueName    = settings?.venueName     || FALLBACK_NAME
  const emblemUrl    = settings?.logoEmblemUrl || FALLBACK_EMBLEM
  const logoFullUrl  = settings?.logoFullUrl   || FALLBACK_LOGO
  const accentColor  = settings?.accentColor   || FALLBACK_COLOR

  // ── Happy Hour ───────────────────────────────────────────────────────────
  const happyHourActive =
    settings?.happyHourActive && (
      !settings?.happyHourFrom || !settings?.happyHourUntil ||
      isWithinTimeWindow(settings.happyHourFrom, settings.happyHourUntil)
    )

  // ── Lunch Menu ───────────────────────────────────────────────────────────
  const lunchMenuActive =
    settings?.lunchMenuActive &&
    dailyMenu && (
      !dailyMenu?.validFrom || !dailyMenu?.validUntil ||
      isWithinTimeWindow(dailyMenu.validFrom, dailyMenu.validUntil)
    )

  const lunchTitle = t(settings?.lunchMenuTitle, locale) ||
    (locale === 'bg' ? 'Обедно меню' : 'Lunch Menu')

  // ── Group items by category slug ─────────────────────────────────────────
  const itemsByCategory: { [key: string]: MenuItemData[] } = {}
  items.forEach((item) => {
    if (!itemsByCategory[item.categorySlug]) {
      itemsByCategory[item.categorySlug] = []
    }
    itemsByCategory[item.categorySlug].push(item)
  })

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

  // ── Scroll helpers ───────────────────────────────────────────────────────
  const scrollToSection = (slug: string) => {
    setActiveSlug(slug)
    const btn = document.getElementById(`nav-${slug}`)
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    isScrollingRef.current = true
    setTimeout(() => { isScrollingRef.current = false }, 1000)
    setTimeout(() => {
      const el = document.getElementById(`section-${slug}`)
      if (!el) return
      const navHeight = navRef.current?.offsetHeight || 50
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8
      window.scrollTo({ top, behavior: 'smooth' })
    }, 10)
  }

  // ── Active nav highlight on scroll ──────────────────────────────────────
  useEffect(() => {
    if (categories.length === 0) return
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
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
    /* Inject dynamic accent colour as a CSS custom property on the root element.
       All child styles that use var(--copper) will pick it up automatically.   */
    <div
      className={styles.container}
      style={{ '--copper': accentColor } as React.CSSProperties}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.hero}>
          <img
            src={emblemUrl}
            alt=""
            className={styles.heroEmblem}
          />
          <img
            src={logoFullUrl}
            alt={venueName}
            className={styles.heroLogo}
          />
          {/* Language toggle */}
          <div className={styles.langToggle}>
            <a
              href="/menu"
              className={`${styles.langBtn} ${locale === 'bg' ? styles.langActive : ''}`}
            >БГ</a>
            <span className={styles.langSep}>|</span>
            <a
              href="/menu/en"
              className={`${styles.langBtn} ${locale === 'en' ? styles.langActive : ''}`}
            >EN</a>
          </div>
        </div>
      </header>

      {/* Happy Hour Overlay */}
      {happyHourActive && (
        <div className={styles.happyHourOverlay}>
          <div className={styles.happyHourInner}>
            <span className={styles.happyHourLabel}>
              {locale === 'bg' ? 'Happy Hour' : 'Happy Hour'}
            </span>
            <div className={styles.happyHourRule} />
            <span className={styles.happyHourText}>
              {t(settings?.happyHourText, locale) || ui_t('happyHour', locale)}
            </span>
          </div>
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
            <h2 className={styles.lunchSectionTitle}>{lunchTitle}</h2>
            <div className={styles.divider} />
            <DailyMenuSection
              menu={dailyMenu as any}
              locale={locale}
              hideTitle
              showPriceEur={settings?.showPriceEur !== false}
              showPriceBgn={settings?.showPriceBgn !== false}
            />
          </section>
        )}

        {/* Category Sections */}
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
            src={emblemUrl}
            alt={venueName}
            className={styles.footerLogo}
          />
          <div className={styles.footerInfo}>
            {settings?.address && <p className={styles.address}>{settings.address}</p>}
            {settings?.footerNote && (
              <p className={styles.note}>{t(settings.footerNote, locale)}</p>
            )}
            <p className={styles.copyright}>
              © {new Date().getFullYear()} {venueName}. {ui_t('copyright', locale)}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
