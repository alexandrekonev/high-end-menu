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

    // ── Identity ──────────────────────────────────────────────────────────────
    defineField({
      name: 'venueName',
      title: 'Venue Name',
      type: 'string',
      description: 'Used in browser tab title, footer copyright and image alt text',
      initialValue: 'My Restaurant',
    }),
    defineField({
      name: 'logoEmblem',
      title: 'Logo — Emblem / Sign',
      type: 'image',
      description: 'Small emblem displayed in the hero area and the footer',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoFull',
      title: 'Logo — Full (text version)',
      type: 'image',
      description: 'Full logotype with text, shown below the emblem in the hero',
      options: { hotspot: true },
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color (hex)',
      type: 'string',
      description: 'Primary accent colour used throughout the menu. Example: #845D41',
      initialValue: '#845D41',
      validation: (Rule) =>
        Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
          name: 'hex colour',
          invert: false,
        }).warning('Should be a valid hex color, e.g. #845D41'),
    }),

    // ── Happy Hour ────────────────────────────────────────────────────────────
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

    // ── Lunch / Daily Menu ────────────────────────────────────────────────────
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

    // ── Price display ─────────────────────────────────────────────────────────
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

    // ── Contact & Social ──────────────────────────────────────────────────────
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Shown as a floating call button. Example: 0886678787',
    }),
    defineField({
      name: 'reservationEmail',
      title: 'Reservation Email',
      type: 'string',
      description: 'Email address where reservation requests are sent',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
    }),
    defineField({
      name: 'googleReviewUrl',
      title: 'Google Maps / Review URL',
      type: 'url',
    }),

    // ── Working Hours ─────────────────────────────────────────────────────────
    defineField({
      name: 'workingHours',
      title: 'Working Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'day',
              title: 'Day',
              type: 'string',
              options: {
                list: [
                  { title: 'Monday / Понеделник',    value: 'monday' },
                  { title: 'Tuesday / Вторник',      value: 'tuesday' },
                  { title: 'Wednesday / Сряда',      value: 'wednesday' },
                  { title: 'Thursday / Четвъртък',   value: 'thursday' },
                  { title: 'Friday / Петък',         value: 'friday' },
                  { title: 'Saturday / Събота',      value: 'saturday' },
                  { title: 'Sunday / Неделя',        value: 'sunday' },
                ],
              },
            },
            { name: 'hours',   title: 'Hours',           type: 'string', description: 'e.g. 08:00 — 20:00' },
            { name: 'concept', title: 'Concept (opt.)',   type: 'string', description: 'e.g. Breakfast, Cocktail Hour' },
          ],
          preview: {
            select: { title: 'day', subtitle: 'hours' },
          },
        },
      ],
    }),

    // ── Footer ────────────────────────────────────────────────────────────────
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
