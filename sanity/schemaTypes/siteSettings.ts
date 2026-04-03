import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'happyHourActive',
      title: 'Happy Hour Active',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'happyHourFrom',
      title: 'Happy Hour From (HH:MM)',
      type: 'string',
      description: 'e.g. "17:00"',
    }),
    defineField({
      name: 'happyHourUntil',
      title: 'Happy Hour Until (HH:MM)',
      type: 'string',
      description: 'e.g. "18:00"',
    }),
    defineField({
      name: 'happyHourText',
      title: 'Happy Hour Text',
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
      name: 'lunchMenuActive',
      title: 'Lunch Menu Active',
      type: 'boolean',
      initialValue: false,
    }),
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
  ],
})
