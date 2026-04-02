import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { categoriesQuery, menuItemsQuery, settingsQuery, todayMenuQuery } from '@/sanity/lib/queries'
import MenuShell from '@/components/MenuShell'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Signature cocktails, premium spirits, wines & food — The High-End Bar, Sofia',
  alternates: { canonical: '/menu/en', languages: { 'bg': '/menu' } },
}

export default async function MenuEN() {
  const today = new Date().toISOString().split('T')[0]

  const [categories, items, settings, dailyMenu] = await Promise.all([
    client.fetch(categoriesQuery),
    client.fetch(menuItemsQuery),
    client.fetch(settingsQuery),
    client.fetch(todayMenuQuery, { today }),
  ])

  return (
    <MenuShell
      locale="en"
      categories={categories}
      items={items}
      settings={settings}
      dailyMenu={dailyMenu}
    />
  )
}
