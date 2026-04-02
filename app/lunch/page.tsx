import { client } from '@/sanity/lib/client'
import { todayMenuQuery, settingsQuery } from '@/sanity/lib/queries'
import LunchPage from '@/components/LunchPage'

// Revalidate frequently — staff publish throughout the morning
export const revalidate = 30

export default async function Lunch() {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const [lunchMenu, settings] = await Promise.all([
    client.fetch(todayMenuQuery, { today }),
    client.fetch(settingsQuery),
  ])

  return <LunchPage lunchMenu={lunchMenu} settings={settings} />
}