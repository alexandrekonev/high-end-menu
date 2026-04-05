import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import {
  orderableDocumentListDeskItem,
  OrderableDocumentList,
} from '@sanity/orderable-document-list'

const API_VERSION = '2024-01-01'

export default defineConfig({
  name: 'high-end-menu',
  title: 'The High-End Bar — Menu',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S, context) => {
        const client = context.getClient({ apiVersion: API_VERSION })

        return S.list()
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

            // ── Categories — drag to reorder ──
            orderableDocumentListDeskItem({
              type: 'category',
              title: 'Categories',
              S,
              context,
            }),

            S.divider(),

            // ── Menu Items by Category — drag to reorder within category ──
            S.listItem()
              .title('Menu Items by Category')
              .id('menuItemsByCategory')
              .child(
                S.documentTypeList('category')
                  .title('Select Category')
                  .child((categoryId: string) =>
                    // Use OrderableDocumentList component directly with S.component()
                    // so the filtered list gets drag handles
                    (S.component()
                      .id(`orderable-menuItem-${categoryId}`)
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .component(OrderableDocumentList as any)
                      .options({
                        type: 'menuItem',
                        filter: '_type == $type && category._ref == $categoryId',
                        params: { type: 'menuItem', categoryId },
                        client,
                      })
                      .title('Menu Items') as any)
                  )
              ),

            // ── All Menu Items (flat, orderable) ──
            orderableDocumentListDeskItem({
              type: 'menuItem',
              title: 'All Menu Items',
              id: 'allMenuItems',
              S,
              context,
            }),

            S.divider(),

            // ── Daily Menu (Lunch) ──
            S.listItem()
              .title('Daily Menu (Lunch)')
              .id('dailyMenu')
              .child(
                S.documentTypeList('dailyMenu')
                  .title('Daily Menu')
              ),
          ])
      },
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
