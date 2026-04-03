import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'dailyMenu',
  title: 'Daily Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
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
      title: 'Valid From',
      type: 'string',
      options: {
        list: [
          '10:00','10:30','11:00','11:30',
          '12:00','12:30','13:00','13:30',
          '14:00','14:30','15:00','15:30',
        ],
      },
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until',
      type: 'string',
      options: {
        list: [
          '12:00','12:30','13:00','13:30',
          '14:00','14:30','15:00','15:30',
          '16:00','16:30','17:00',
        ],
      },
    }),
    defineField({
      name: 'chefNote',
      title: "Chef's Note",
      description: 'Short message from the chef — supports bold and italic',
      type: 'object',
      fields: [
        {
          name: 'bg',
          title: 'Bulgarian',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              lists: [],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                ],
                annotations: [],
              },
            },
          ],
        },
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              lists: [],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                ],
                annotations: [],
              },
            },
          ],
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
