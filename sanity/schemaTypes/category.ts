import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Категория / Category',
  type: 'document',
  icon: () => '📂',
  fields: [
    defineField({
      name: 'name',
      title: 'Название',
      type: 'object',
      fields: [
        { name: 'bg', title: '🇧🇬 Български', type: 'string', validation: (R) => R.required() },
        { name: 'en', title: '🇬🇧 English', type: 'string' },
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name.bg', maxLength: 48 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Икона (emoji)',
      type: 'string',
      description: 'Един emoji — напр. ☕ 🍷 🥃 🍸',
      validation: (R) => R.max(4),
    }),
    defineField({
      name: 'group',
      title: 'Група (за визуално разделяне)',
      type: 'string',
      options: {
        list: [
          { title: '☕ Топли напитки', value: 'hot' },
          { title: '🧊 Студени безалкохолни', value: 'cold' },
          { title: '🍷 Алкохолни напитки', value: 'alcohol' },
          { title: '🍽 Храна', value: 'food' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'displayStyle',
      title: 'Стил на показване',
      type: 'string',
      options: {
        list: [
          { title: '🃏 Карти (с/без снимка)', value: 'cards' },
          { title: '📋 Списък с снимка', value: 'list' },
          { title: '📄 Компактен списък', value: 'compact' },
        ],
        layout: 'radio',
      },
      initialValue: 'cards',
    }),
    defineField({
      name: 'order',
      title: 'Наредба (по-малкото — напред)',
      type: 'number',
      initialValue: 10,
    }),
    defineField({
      name: 'isActive',
      title: 'Активна / Видима',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { bg: 'name.bg', icon: 'icon', active: 'isActive' },
    prepare({ bg, icon, active }) {
      return { title: `${icon ?? '📂'} ${bg}`, subtitle: active ? 'активна' : '🚫 скрита' }
    },
  },
  orderings: [{ title: 'Наредба', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})