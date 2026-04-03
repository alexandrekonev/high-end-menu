import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'dailyMenu',
  title: 'Daily Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date (YYYY-MM-DD)',
      type: 'string',
      description: 'Format: YYYY-MM-DD',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid From (HH:MM)',
      type: 'string',
      description: 'e.g. "12:00"',
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until (HH:MM)',
      type: 'string',
      description: 'e.g. "15:00"',
    }),
    defineField({
      name: 'chefNote',
      title: "Chef's Note",
      type: 'object',
      fields: [
        {
          name: 'bg',
          title: 'Bulgarian',
          type: 'string',
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'menuSection',
          title: 'Menu Section',
          fields: [
            {
              name: 'heading',
              title: 'Heading',
              type: 'object',
              fields: [
                {
                  name: 'bg',
                  title: 'Bulgarian',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'en',
                  title: 'English',
                  type: 'string',
                },
              ],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'dishes',
              title: 'Dishes',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'dish',
                  title: 'Dish',
                  fields: [
                    {
                      name: 'name',
                      title: 'Name',
                      type: 'object',
                      fields: [
                        {
                          name: 'bg',
                          title: 'Bulgarian',
                          type: 'string',
                          validation: (Rule) => Rule.required(),
                        },
                        {
                          name: 'en',
                          title: 'English',
                          type: 'string',
                        },
                      ],
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'object',
                      fields: [
                        {
                          name: 'bg',
                          title: 'Bulgarian',
                          type: 'string',
                        },
                        {
                          name: 'en',
                          title: 'English',
                          type: 'string',
                        },
                      ],
                    },
                    {
                      name: 'price',
                      title: 'Price',
                      type: 'string',
                    },
                    {
                      name: 'tags',
                      title: 'Tags',
                      type: 'array',
                      of: [{ type: 'string' }],
                    },
                    {
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: {
                        hotspot: true,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
})
