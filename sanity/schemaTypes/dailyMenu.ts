import { defineType, defineField } from 'sanity'

export const dailyMenu = defineType({
  name: 'dailyMenu',
  title: 'Обедно меню / Daily Menu',
  type: 'document',
  icon: () => '🍽',
  fields: [
    defineField({
      name: 'date',
      title: 'Дата',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
      validation: (R) => R.required(),
    }),

    // Time window
    defineField({
      name: 'validFrom',
      title: 'Показва се от (час)',
      type: 'string',
      description: 'напр. 12:00',
      initialValue: '12:00',
      validation: (R) =>
        R.required().regex(/^\d{2}:\d{2}$/, { name: 'HH:MM формат', invert: false }),
    }),
    defineField({
      name: 'validUntil',
      title: 'Показва се до (час)',
      type: 'string',
      description: 'напр. 14:30',
      initialValue: '14:30',
      validation: (R) =>
        R.required().regex(/^\d{2}:\d{2}$/, { name: 'HH:MM формат', invert: false }),
    }),

    defineField({
      name: 'isActive',
      title: 'Активно',
      type: 'boolean',
      initialValue: true,
      description: 'Изключи за да скриеш менюто независимо от часовия прозорец',
    }),

    // Chef's note
    defineField({
      name: 'chefNote',
      title: 'Бележка от кухнята (опционална)',
      type: 'object',
      fields: [
        { name: 'bg', title: '🇧🇬 Български', type: 'text', rows: 2 },
        { name: 'en', title: '🇬🇧 English', type: 'text', rows: 2 },
      ],
    }),

    // Sections
    defineField({
      name: 'sections',
      title: 'Раздели',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Заглавие на раздела',
              type: 'object',
              fields: [
                { name: 'bg', title: '🇧🇬 Български', type: 'string', validation: (R) => R.required() },
                { name: 'en', title: '🇬🇧 English', type: 'string' },
              ],
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'dishes',
              title: 'Ястия',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'dish',
                  fields: [
                    defineField({
                      name: 'name',
                      title: 'Название',
                      type: 'object',
                      fields: [
                        { name: 'bg', title: '🇧🇬', type: 'string', validation: (R) => R.required() },
                        { name: 'en', title: '🇬🇧', type: 'string' },
                      ],
                    }),
                    defineField({
                      name: 'description',
                      title: 'Описание',
                      type: 'object',
                      fields: [
                        { name: 'bg', title: '🇧🇬', type: 'text', rows: 1 },
                        { name: 'en', title: '🇬🇧', type: 'text', rows: 1 },
                      ],
                    }),
                    defineField({ name: 'price', title: 'Цена (€)', type: 'string' }),
                    defineField({
                      name: 'image', title: 'Снимка', type: 'image',
                      options: { hotspot: true },
                    }),
                    defineField({
                      name: 'tags',
                      title: 'Тагове',
                      type: 'array',
                      of: [{ type: 'string' }],
                      options: {
                        list: [
                          { title: '🌱 Вегетарианско', value: 'vegetarian' },
                          { title: '🌿 Веган', value: 'vegan' },
                          { title: '🌾 Без глутен', value: 'gluten-free' },
                          { title: '⭐ Специалитет', value: 'special' },
                        ],
                        layout: 'grid',
                      },
                    }),
                  ],
                  preview: {
                    select: { bg: 'name.bg', price: 'price', media: 'image' },
                    prepare({ bg, price, media }) {
                      return { title: bg, subtitle: price ? `${price} €` : '', media }
                    },
                  },
                },
              ],
              validation: (R) => R.min(1),
            }),
          ],
          preview: {
            select: { bg: 'heading.bg' },
            prepare({ bg }) { return { title: `📋 ${bg}` } },
          },
        },
      ],
      validation: (R) => R.min(1),
    }),
  ],

  preview: {
    select: { date: 'date', active: 'isActive' },
    prepare({ date, active }) {
      const d = date
        ? new Date(date + 'T12:00:00').toLocaleDateString('bg-BG', {
            weekday: 'long', day: 'numeric', month: 'long',
          })
        : 'Без дата'
      return { title: `${active ? '✅' : '⏸'} ${d}`