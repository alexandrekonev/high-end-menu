import { client } from '@/sanity/lib/client'
import { categoriesQuery, menuItemsQuery, settingsQuery } from '@/sanity/lib/queries'
import MenuPage from '@/components/MenuPage'

// Revalidate every 60 seconds (ISR) — instant update after Sanity webhook too
export const revalidate = 60

export default async function Home() {
  const [categories, items, settings] = await Promise.all([
    client.fetch(categoriesQuery),
    client.fetch(menuItemsQuery),
    client.fetch(settingsQuery),
  ])

  return <MenuPage categories={categories} items={items} settings={settings} />
}
