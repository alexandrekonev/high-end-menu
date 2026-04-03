import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import type { StructureBuilder } from 'sanity/structure'

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
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('menuItem').title('Menu Items'),
            S.documentTypeListItem('dailyMenu').title('Daily Menu'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
