import { defineField, defineType } from 'sanity'

const timeOptions = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00',
]

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // ── Happy Hour ──
    defineField({
      name: 'happyHourActive',
      title: 'Happy Hour Active',
      type: 'boolean',
      initialValue: false,
      description: 'Show Happy Hour banner during the selected hours',
    }),
    defineField({
      name: 'happyHourFrom',
      title: 'Happy Hour — Start',
      type: 'string',
      options: { list: timeOptions },
    }),
    defineField({
      name: 'happyHourUntil',
      title: 'Happy Hour — End',
      type: 'string',
      options: { list: timeOptions },
    }),
    defineField({
      name: 'happyHourText',
      title: 'Happy Hour — Banner Text',
      type: 'object',
      description: 'Text shown in the Happy Hour banner (optional)',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),

    // ── Lunch / Daily Menu ──
    defineField({
      name: 'lunchMenuActive',
      title: 'Lunch Menu Active',
      type: 'boolean',
      initialValue: false,
      description: 'Show the daily lunch menu section on the page',
    }),
    defineField({
      name: 'lunchMenuTitle',
      title: 'Lunch Menu — Section Title',
      type: 'object',
      description: 'Custom title for the lunch menu section (default: "Обедно меню")',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string', placeholder: 'Обедно меню' },
        { name: 'en', title: 'English', type: 'string', placeholder: 'Lunch Menu' },
      ],
    }),

    // ── Price display ──
    defineField({
      name: 'showPriceEur',
      title: 'Show prices in EUR (€)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showPriceBgn',
      title: 'Show prices in BGN (лв.) — auto-converted',
      type: 'boolean',
      initialValue: true,
      description: 'BGN is calculated automatically: 1 EUR = 1.95583 лв.',
    }),

    // ── Footer ──
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer Note',
      type: 'object',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
  ],
})
