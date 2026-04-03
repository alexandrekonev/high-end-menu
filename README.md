# The High-End Bar — Digital Menu

A complete, production-ready Next.js 14 + Sanity v3 digital QR menu system for high-end establishments. Built with TypeScript, featuring bilingual support (Bulgarian/English), multiple display modes, happy hour tracking, and daily specials.

## Quick Overview

**Status:** Production Ready  
**Total Files:** 33  
**Lines of Code:** 3,053  
**Languages:** TypeScript, React, CSS  
**Deployment:** Vercel Ready  

## Technology Stack

- **Frontend:** Next.js 14.2.5, React 18, TypeScript 5.4.5
- **Styling:** CSS Modules with design tokens
- **CMS:** Sanity v3 (headless CMS)
- **Deployment:** Vercel (recommended)
- **Database:** Sanity hosted

## Features

### Core
- Bilingual menu (Bulgarian + English)
- Three display modes (cards, list, compact)
- Sticky header with logo and language toggle
- Category navigation with emoji icons
- Responsive design (mobile, tablet, desktop)

### Dynamic
- Happy Hour banner (time-based)
- Daily lunch menu with time windows
- "New" badges for items < 14 days old
- Item tags (vegetarian, vegan, gluten-free, spicy, premium, featured)
- Allergen warnings
- Sub-category grouping

### Technical
- Server-side rendering
- Incremental Static Regeneration (ISR)
- Image optimization with Sanity CDN
- CSS modules for style scoping
- Strict TypeScript
- Zero external dependencies beyond package.json

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── menu/               # Menu pages (BG + EN)
│   ├── lunch/              # Lunch menu
│   ├── studio/             # Sanity Studio
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── MenuShell.tsx       # Main container
│   ├── ItemCard.tsx        # Card display
│   ├── ItemRow.tsx         # List display
│   └── DailyMenuSection.tsx
├── lib/                    # Utilities
│   └── i18n.ts             # i18n + translations
├── sanity/                 # CMS configuration
│   ├── lib/                # Sanity client & queries
│   └── schemaTypes/        # Document schemas
├── middleware.ts           # Route middleware
├── next.config.mjs         # Next.js config
├── sanity.config.ts        # Sanity config
└── tsconfig.json           # TypeScript config
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=wq48qcpb
NEXT_PUBLIC_SANITY_DATASET=production
REVALIDATE_SECRET=your-secret-key-here
```

### 3. Start Development
```bash
npm run dev
```

Visit:
- Menu: http://localhost:3000/menu
- Studio: http://localhost:3000/studio

### 4. Build & Deploy
```bash
npm run build
npm start
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirects to `/menu` |
| `/menu` | Bulgarian menu (default) |
| `/menu/en` | English menu |
| `/lunch` | Today's lunch menu |
| `/studio` | Sanity CMS Studio |
| `/api/revalidate` | ISR revalidation endpoint |

## Sanity Integration

**Project:** wq48qcpb  
**Dataset:** production  

**Document Types:**
1. **category** - Menu categories with display styles
2. **menuItem** - Individual menu items (11 fields)
3. **siteSettings** - Global settings (singleton)
4. **dailyMenu** - Daily specials with sections

All schemas are defined and ready to sync with Sanity.

## Customization

### Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --copper: #845D41;
  --dark: #132028;
  /* ... */
}
```

### Fonts
Update Google Fonts link in `app/layout.tsx`

### Logo
Update image URL in `components/MenuShell.tsx`

### Translations
Add languages to `lib/i18n.ts` UI_STRINGS object

## Deployment

### Recommended: Vercel
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Auto-deploy on git push

### Manual ISR
```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "x-revalidate-secret: your-secret-key" \
  -d '{}' \
  -H "Content-Type: application/json"
```

## Performance

- Server-side rendered menu pages
- 60-second ISR revalidation
- Sanity CDN for image delivery
- CSS modules for optimized styling
- Memoized data grouping
- Touch-friendly responsive design

## Accessibility

- Semantic HTML
- ARIA-compliant structure
- Screen reader optimized
- Keyboard navigation support
- High color contrast (WCAG AA+)
- Touch targets >= 44px

## TypeScript

- Strict mode enabled
- All types properly declared
- No implicit `any`
- Exported interfaces for data structures

## Documentation

- **QUICKSTART.md** - Fast start guide
- **PROJECT_STRUCTURE.md** - Complete reference
- **COMPLETION_REPORT.txt** - Build verification
- **BUILD_SUMMARY.md** - Overview (in parent directory)

## Support

For issues or questions:
1. Check documentation files
2. Review Sanity CMS docs
3. Consult Next.js documentation

## License

Proprietary - The High-End Bar

---

**Version:** 1.0.0  
**Created:** 2026-04-03  
**Status:** Production Ready
