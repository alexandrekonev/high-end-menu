import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The High-End Bar — Digital Menu',
  description: 'Discover our premium selection of cocktails and drinks',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: 'https://www.high-end.bg/images/static/logo-sign-light.svg',
    shortcut: 'https://www.high-end.bg/images/static/logo-sign-light.svg',
    apple: 'https://www.high-end.bg/images/static/logo-sign-light.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Cormorant+SC:wght@400;600;700&family=Open+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
