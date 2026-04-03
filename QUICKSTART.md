# Quick Start Guide

## Installation

```bash
cd /sessions/sweet-bold-lovelace/fresh/high-end-menu
npm install
```

## Environment Setup

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=wq48qcpb
NEXT_PUBLIC_SANITY_DATASET=production
REVALIDATE_SECRET=your-secret-key-here
```

## Development

```bash
npm run dev
```

Open your browser:
- Menu (BG): http://localhost:3000/menu
- Menu (EN): http://localhost:3000/menu/en
- Lunch: http://localhost:3000/lunch
- Studio: http://localhost:3000/studio

## Build & Deploy

```bash
npm run build
npm start
```

## Project Structure at a Glance

```
├── app/              # Next.js App Router pages & API
├── components/       # React components (MenuShell, ItemCard, ItemRow, DailyMenuSection)
├── lib/              # Utilities (i18n, translations)
├── sanity/           # Sanity CMS schemas & queries
└── sanity.config.ts  # Sanity configuration
```

## Key Features

- **Bilingual:** Bulgarian (bg) + English (en)
- **Display Modes:** Cards (2-col), List (grouped), Compact
- **Dynamic:** Happy Hour banner, Lunch menu, "New" badges
- **Dark Luxury Theme:** Copper accents on dark background
- **Responsive:** Mobile, tablet, desktop optimized

## Routes

| Path | Purpose |
|------|---------|
| / | Redirect to /menu |
| /menu | Bulgarian menu (server-rendered) |
| /menu/en | English menu |
| /lunch | Today's lunch menu (if active) |
| /studio | Sanity CMS Studio |
| /api/revalidate | ISR manual revalidation |

## Sanity Schemas

The app expects these document types in Sanity:

1. **category** - Menu categories with display styles
2. **menuItem** - Individual menu items with prices, tags, allergens
3. **siteSettings** - Singleton for happy hour, address, footer note
4. **dailyMenu** - Daily specials with sections and dishes

All schemas are defined in `sanity/schemaTypes/`.

## Customization

### Change Logo
In `components/MenuShell.tsx`, update the image URL:
```tsx
<img src="YOUR_LOGO_URL" alt="Your Bar" />
```

### Change Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --copper: #your-color;
  /* ... */
}
```

### Change Fonts
Edit the Google Fonts link in `app/layout.tsx`:
```tsx
<link href="https://fonts.googleapis.com/css2?family=..." />
```

### Add More Languages
1. Add locale to `Locale` type in `lib/i18n.ts`
2. Add translations to `UI_STRINGS` object
3. Create new route `/menu/[locale]/page.tsx`

## Deployment on Vercel

1. Push to GitHub
2. Import in Vercel dashboard
3. Add environment variables
4. Deploy (automatic on git push)

## Performance Notes

- Pages revalidate every 60 seconds (ISR)
- Images optimized via Sanity CDN
- Category grouping is memoized
- CSS modules prevent style conflicts

## Troubleshooting

**"Cannot find module" errors:**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

**Styles not loading:**
- Ensure CSS modules are imported as `styles`
- Check that file names end with `.module.css`

**Images not showing:**
- Verify image URLs are accessible
- Check `next.config.mjs` remote patterns
- Images must be from `cdn.sanity.io` or `www.high-end.bg`

## TypeScript

This project uses strict TypeScript. All types are explicitly defined:
- `MenuItemData` - Menu item structure
- `CategoryData` - Category structure
- `Locale` - 'bg' | 'en'

No implicit `any` types are used.

## Production Checklist

Before deploying to production:

- [ ] Update `.env.local` with real values
- [ ] Add Sanity data (categories, items, settings)
- [ ] Test both BG and EN menus
- [ ] Test happy hour banner logic
- [ ] Test lunch menu time windows
- [ ] Verify responsive on mobile
- [ ] Check all images load
- [ ] Test language toggle
- [ ] Verify footer information

## Support Files

- `PROJECT_STRUCTURE.md` - Complete project documentation
- `COMPLETION_REPORT.txt` - Build verification report
- `.env.example` - Environment template
- `package.json` - Dependencies list

## Next.js Resources

- [Next.js Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

## Sanity Resources

- [Sanity Docs](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js Integration](https://www.sanity.io/docs/js-client)

---

**Ready to go!** Run `npm install && npm run dev` to start building your menu.
