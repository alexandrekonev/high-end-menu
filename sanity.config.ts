import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import { deeplTranslatePlugin } from './sanity/plugins/deeplTranslate'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'high-end-bar',
  title: 'The High-End Bar',
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('📋 Меню')
          .items([
            // 1 — Daily menu first (most used)
            S.listItem()
              .title('🍽  Обедно меню (дневно)')
              .child(
                S.documentList()
                  .title('Обедни менюта')
                  .filter('_type == "dailyMenu"')
                  .defaultOrdering([{ field: 'date', direction: 'desc' }])
              ),

            S.divider(),

            // 2 — Drinks & Food
            S.listItem()
              .title('📂  Категории')
              .child(
                S.documentList()
                  .title('Категории')
                  .filter('_type == "category"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('🍽  Всички артикули')
              .child(
                S.documentList()
                  .title('Артикули')
                  .filter('_type == "menuItem"')
                  .defaultOrdering([{ field: 'category.order', direction: 'asc' }])
              ),

            S.divider(),

            // 3 — Settings (singleton)
            S.listItem()
              .title('⚙️  Настройки')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Настройки на сайта')
              ),
          ]),
    }),

    deeplTranslatePlugin