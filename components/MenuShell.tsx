'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { t, ui_t, isWithinTimeWindow, type Locale } from '@/lib/i18n'
import ItemCard from './ItemCard'
import ItemRow from './ItemRow'
import DailyMenuSection from './DailyMenuSection'
import s from './MenuShell.module.css'

// ── Types ─────────────────────────────────────────────────────────
interface LocalizedStr { bg?: string | null; en?: string | null }

interface Category {
  _id: string; name: LocalizedStr; slug: string; icon?: string
  group?: string; displayStyle: 'cards' | 'list' | 'compact'
}

export interface MenuItemData {
  _id: string; name: LocalizedStr; description?: LocalizedStr
  price: string; volume?: string; tags?: string[]; isFeatured?: boolean
  allergens?: string[]; subCategory?: string; _createdAt: string
  image?: string; imageHotspot?: { x: number; y: number }
  categorySlug: string; categoryIcon?: string
}

interface DailyMenuData {
  _id: string; date: string; validFrom: string; validUntil: string
  chefNote?: LocalizedStr
  sections: {
    heading: LocalizedStr
    dishes: {
      name: LocalizedStr; description?: LocalizedStr
      price?: string; tags?: string[]; image?: string
    }[]
  }[]
}

interface Settings {
  happyHourActive?: boolean; happyHourFrom?: string; happyHourUntil?: string
  happyHourText?: LocalizedStr; address?: string; footerNote?: LocalizedStr
}

interface Props {
  locale: Locale
  categories: Category[]
  items: MenuItemData[]
  settings: Settings | null
  dailyMenu: DailyMenuData | null
}

// ── Groups ────────────────────────────────────────────────────────
const GROUP_LABELS: Record<string, { bg: string; en: string; icon: string }> = {
  hot:     { bg: 'Топли напитки',          en: 'Hot Beverages',         icon: '☕' },
  cold:    { bg: 'Студени безалкохолни',   en: 'Cold Non-Alcoholic',    icon: '🧊' },
  alcohol: { bg: 'Алкохолни напитки',      en: 'Alcoholic Beverages',   icon: '🍷' },
  food:    { bg: 'Храна',                  en: 'Food',                  icon: '🍽' },
}

export default function MenuShell({ locale, categories, items, settings, dailyMenu }: Props) {
  // Initialise to the first real slug so the first category is active on load
  const [activeSlug, setActiveSlug] = useState<string>(
    () => (dailyMenu ? 'daily' : (categories[0]?.slug ?? ''))
  )
  const stickyRef = useRef<HTMLDivElement>(null)  // wraps header + nav together
  const stickyH   = useRef(0)

  // Happy Hour live check (re-evaluates every minute)
  const [showHappy, setShowHappy] = useState(false)
  useEffect(() => {
    const check = () => {
      if (!settings?.happyHourActive) { setShowHappy(false); return }
      setShowHappy(isWithinTimeWindow(
        settings.happyHourFrom || '17:00',
        settings.happyHourUntil || '18:00',
      ))
    }
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [settings])

  // Measure sticky header height (used for scroll offset)
  useEffect(() => {
    const sticky = stickyRef.current
    if (!sticky) return
    const measure = () => { stickyH.current = sticky.offsetHeight + 4 }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Scroll active nav button into view horizontally
  useEffect(() => {
    const btn = stickyRef.current?.querySelector(`[data-slug="${activeSlug}"]`) as HTMLElement
    btn?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeSlug])

  const scrollTo = (slug: string) => {
    setActiveSlug(slug)                          // винаги първо — независимо от DOM
    const el = document.getElementById(slug)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - (stickyH.current || 120)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  // Group items by category
  const byCategory = (slug: string) => items.filter((i) => i.categorySlug === slug)

  // Sub-category grouping
  const bySubCat = (its: MenuItemData[]) => {
    const map = new Map<string, MenuItemData[]>()
    its.forEach((i) => {
      const k = i.subCategory || '__'
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(i)
    })
    return map
  }

  // Group categories by their group field
  const grouped = categories.reduce<Record<string, Category[]>>((acc, c) => {
    const g = c.group || 'other'
    if (!acc[g]) acc[g] = []
    acc[g].push(c)
    return acc
  }, {})

  const allGroups = ['hot', 'cold', 'alcohol', 'food', 'other']
  const hasDailyMenu = !!dailyMenu

  return (
    <>
      {/* ── STICKY WRAPPER (header + nav) ── */}
      <div ref={stickyRef} className={s.stickyTop}>
        <header className={s.header}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://www.high-end.bg/images/static/logo-sign-light.svg"
            alt="" className={s.logo} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://www.high-end.bg/images/static/logo-vertical-text.svg"
            alt="The High-End Bar" className={s.logoText} />

          {/* Language toggle */}
          <Link href={locale === 'bg' ? '/menu/en' : '/menu'} className={s.langBtn}>
            {locale === 'bg' ? '🇬🇧 EN' : '🇧🇬 BG'}
          </Link>
        </header>

        {/* ── HAPPY HOUR BANNER ── */}
        {showHappy && (
          <div className={s.happyBanner}>
            <span className={s.happyIcon}>🍹</span>
            {' '}{ui_t('happyHour', locale)}
            {settings?.happyHourText && ` — ${t(settings.happyHourText, locale)}`}
          </div>
        )}

        {/* ── CATEGORY NAV ── */}
        <nav className={s.nav}>
          <div className={s.navInner}>
            {/* Daily menu tab — shown first if available */}
            {hasDailyMenu && (
              <button
                data-slug="daily"
                className={`${s.navBtn} ${activeSlug === 'daily' ? s.navBtnActive : ''}`}
                onClick={() => scrollTo('daily')}
              >
                🍽 {ui_t('lunchMenu', locale)}
              </button>
            )}

            {/* Category buttons */}
            {categories.map((cat) => (
              <button
                key={cat._id}
                data-slug={cat.slug}
                className={`${s.navBtn} ${activeSlug === cat.slug ? s.navBtnActive : ''}`}
                onClick={() => scrollTo(cat.slug)}
              >
                {cat.icon} {t(cat.name, locale)}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main>
        {/* Daily Menu */}
        {hasDailyMenu && (
          <section id="daily" className={s.section}>
            <DailyMenuSection menu={dailyMenu} locale={locale} />
          </section>
        )}

        {/* Menu sections — grouped by hot/cold/alcohol/food */}
        {allGroups.map((group) => {
          const groupCats = grouped[group]
          if (!groupCats?.length) return null
          const groupMeta = GROUP_LABELS[group]

          return (
            <div key={group} className={s.group}>
              {/* Group heading */}
              {groupMeta && (
                <div className={s.groupHeading}>
                  <span>{locale === 'bg' ? groupMeta.bg : groupMeta.en}</span>
                </div>
              )}

              {groupCats.map((cat) => {
                const catItems = byCategory(cat.slug)
                if (!catItems.length) return null
                const subMap = bySubCat(catItems)

                return (
                  <section key={cat._id} id={cat.slug} className={s.catSection}>
                    {/* Category heading */}
                    <div className={s.catHeading}>
                      <div className={s.catLine} />
                      <span className={s.catTitle}>
                        {cat.icon && <span className={s.catIcon}>{cat.icon}</span>}
                        {t(cat.name, locale)}
                      </span>
                      <div className={s.catLine} />
                    </div>

                    {/* Items */}
                    {cat.displayStyle === 'cards' && (
                      <div className={s.cardsGrid}>
                        {catItems.map((item) => (
                          <ItemCard key={item._id} item={item} locale={locale}
                            fallbackIcon={cat.icon} />
                        ))}
                      </div>
                    )}

                    {(cat.displayStyle === 'list' || cat.displayStyle === 'compact') &&
                      Array.from(subMap.entries()).map(([sub, subItems]) => (
                        <div key={sub}>
                          {sub !== '__' && <div className={s.subHeading}>{sub}</div>}
                          {subItems.map((item) => (
                            <ItemRow key={item._id} item={item} locale={locale}
                              compact={cat.displayStyle === 'compact'} />
                          ))}
                        </div>
                      ))}
                  </section>
                )
              })}
            </div>
          )
        })}
      </main>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://www.high-end.bg/images/static/logo-sign-light.svg"
          alt="" className={s.footerLogo} />
        <div className={s.footerName}>The High&#8209;End Bar</div>
        <div className={s.footerAdd