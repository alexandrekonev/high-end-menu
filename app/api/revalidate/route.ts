/**
 * On-demand revalidation — called by Sanity webhook on publish.
 *
 * Sanity webhook config (sanity.io/manage → API → Webhooks):
 *   URL:     https://menu.high-end.bg/api/revalidate?secret=YOUR_SECRET
 *   Trigger: publish, update, delete
 *   Filter:  _type in ["menuItem","category","dailyMenu","siteSettings"]
 */
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await req.json() as { _type?: string }
    const docType = body._type || ''

    revalidatePath('/menu')
    revalidatePath('/menu/en')

    return NextResponse.json({ revalidated: true, docType, now: Date.now() })
  } catch {
    return NextResponse.json({ message: 'Error parsing body' }, { status: 400 })
  }
}
