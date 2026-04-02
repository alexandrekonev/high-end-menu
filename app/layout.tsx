import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'The High-End Bar — Меню', template: '%s | The High-End Bar' },
  description: 'Авторски коктейли, премиум спиртни напитки и подбрани вина — The High-End Bar, Sofia',
  alternates: {
    languages: {
      'bg': '/menu',
      'en': '/menu/en',
    },
  },
  openGraph: {
    siteName: 'The High-End Bar',
    locale: 'bg_BG',
    alternateLocale: 'en_US',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#845D41',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cormorant+SC:wght@300;400;500&family=Open+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body