import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Настройки на сайта',
  type: 'document',
  icon: () => '⚙️',
  // Singleton — only one document of this type
  __experimental_actions: ['update', 'publish'],
  fields: [
    // Happy Hour
    defineField({
      name: 'happyHourActive',
      title: '🍹 Happy Hour — Активен',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'happyHourFrom',
      title: 'Happy Hour — от',
      type: 'string',
      initialValue: '17:00',
      description: 'Формат HH:MM',
      hidden: ({ document }) => !document?.happyHourActive,
    }),
    defineField({
      name: 'happyHourUntil',
      title: 'Happy Hour — до',
      type: 'string',
      initialValue: '18:00',
      hidden: ({ document }) => !document?.happyHourActive,
    }),
    defineField({
      name: 'happyHourText',
      title: 'Текст на Happy Hour банера',
      type: 'object',
      fields: [
        { name: 'bg', title: '🇧🇬 Български', type: 'string', initialValue: 'Happy Hour — всичко от менюто с отстъпка!' },
        { name: 'en', title: '🇬🇧 English', type: 'string', initialValue: 'Happy Hour — discount on everything!' },
      ],
      hidden: ({ document }) => !document?.happyHourActive,
    }),

    // Address / Info
    defineField({
      name: 'address',
      title: 'Адрес',
      type: 'string',
      initialValue: 'Realtons Place, бул. „Черни връх" 51Г, срещу Paradise Center, Sofia',
    }),
    defineField({
      name: 'footerNote',
      title: 'Бележка в Footer',
      type: 'object',
      fields: [
        { name: 'bg', title: '🇧🇬', type: 'string', initialValue: 'Цените са с включен ДДС' },
        { name: 'en', title: '🇬🇧', type: 'string', initialValue: 'All prices include VAT' },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})
