import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { ReorderPublishAction } from './sanity/actions/reorderPublishAction'

export default defineConfig({
  name: 'high-end-menu',
  title: 'The High-End Bar — Menu',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S, context) =>
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

            // ── Categories — drag to reorder ──
            orderableDocumentListDeskItem({
              type: 'category',
              title: 'Categories',
              S,
              context,
            }),

            S.divider(),

            // ── Menu Items by Category — shown in numeric `order` field order ──
            // (set position number in each item; auto-shifts siblings on publish)
            S.listItem()
              .title('Menu Items by Category')
              .id('menuItemsByCategory')
              .child(
                S.documentTypeList('category')
                  .title('Select Category')
                  .child((categoryId: string) =>
                    S.documentList()
                      .title('Menu Items')
                      .schemaType('menuItem')
                      .filter('_type == "menuItem" && category._ref == $categoryId')
                      .params({ categoryId })
                      .defaultOrdering([{ field: 'order', direction: 'asc' }])
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
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },

  document: {
    // For menuItem documents, replace the default Publish action with one that
    // auto-shifts sibling items when the `order` (position) field changes.
    actions: (prev, ctx) => {
      if (ctx.schemaType === 'menuItem') {
        return prev.map((Action) =>
          (Action as unknown as { action?: string }).action === 'publish'
            ? ReorderPublishAction
            : Action
        )
      }
      return prev
    },
  },
})
