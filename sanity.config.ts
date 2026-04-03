import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import type { StructureBuilder } from 'sanity/structure'
import { groq } from 'next-sanity'

export default defineConfig({
  name: 'high-end-menu',
  title: 'The High-End Bar — Menu',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title('Content')
          .items([
            // ── Site Settings (singleton) ──
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),

            S.divider(),

            // ── Categories ──
            S.documentTypeListItem('category').title('Categories'),

            S.divider(),

            // ── Menu Items grouped by Category ──
            S.listItem()
              .title('Menu Items by Category')
              .id('menuItemsByCategory')
              .child(
                S.documentTypeList('category')
                  .title('Select Category')
                  .child((categoryId: string) =>
                    S.documentList()
                      .title('Items')
                      .schemaType('menuItem')
                      .filter('_type == "menuItem" && category._ref == $categoryId')
                      .params({ categoryId })
                  )
              ),

            // ── All Menu Items flat list ──
            S.documentTypeListItem('menuItem').title('All Menu Items'),

            S.divider(),

            // ── Daily Menu (Lunch) ──
            S.listItem()
              .title('Daily Menu (Lunch)')
              .id('dailyMenu')
              .child(
                S.documentTypeList('dailyMenu')
                  .title('Daily Menu')
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
