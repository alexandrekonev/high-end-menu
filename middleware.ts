import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root → /menu (BG by default)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/menu', request.url))
  }
}

export const config = {
  mat