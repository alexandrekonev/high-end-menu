import { defineType, defineField } from 'sanity'

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Артикул / Menu Item',
  type: 'document',
  icon: () => '🍽',
  fields: [
    // ── Names ──────────────────────────────────────
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

    // ── Description ────────────────────────────────
    defineField({
      name: 'description',
      title: 'Описание / съставки',
      type: 'object',
      fields: [
        { name: 'bg', title: '🇧🇬 Български', type: 'text', rows: 2 },
        { name: 'en', title: '🇬🇧 English', type: 'text', rows: 2 },
      ],
    }),

    // ── Price ──────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Цена (€)',
      type: 'string',
      description: 'напр. "8" или "12 / 55" (чаша/бутилка)',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'volume',
      title: 'Обем / порция',
      type: 'string',
      description: 'напр. "50ml", "250ml", "150ml / бутилка"',
    }),

    // ── Category ───────────────────────────────────
    defineField({
      name: 'category',
      title: 'Категория',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (R) => R.required(),
    }),

    // ── Image ──────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Снимка (опционална)',
      type: 'image',
      options: { hotspot: true },
    }),

    // ── Tags ───────────────────────────────────────
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
          { title: '🌶 Пикантно', value: 'spicy' },
          { title: '⭐ Premium', value: 'premium' },
        ],
        layout: 'grid',
      },
    }),

    // ── Availability & Features ────────────────────
    defineField({
      name: 'isAvailable',
      title: '✅ Наличен',
      type: 'boolean',
      initialValue: true,
      description: 'Изключи без изтриване — напр. временно изчерпан',
    }),
    defineField({
      name: 'isFeatured',
      title: '⚡ Препоръчано от нас',
      type: 'boolean',
      initialValue: false,
    }),

    // ── Allergens ──────────────────────────────────
    defineField({
      name: 'allergens',
      title: 'Алергени',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Глутен', value: 'gluten' },
          { title: 'Яйца', value: 'eggs' },
          { title: 'Мляко', value: 'milk' },
          { title: 'Ядки', value: 'nuts' },
          { title: 'Фъстъци', value: 'peanuts' },
          { title: 'Соя', value: 'soy' },
          { title: 'Серен диоксид', value: 'sulphites' },
          { title: 'Риба', value: 'fish' },
          { title: 'Морски дарове', value: 'shellfish' },
          { title: 'Сусам', value: 'sesame' },
          { title: 'Целина', value: 'celery' },
          { title: 'Синап', value: 'mustard' },
        ],
        layout: 'grid',
      },
    }),

    // ── Sub-category heading ───────────────────────
    defineField({
      name: 'subCategory',
      title: 'Подкатегория (подзаглавие)',
      type: 'string',
      description: 'напр. "Червени вина", "Шотландски малц", "Авторски коктейли"',
    }),

    defineField({
      name: 'order',
      title: 'Наредба',
      type: 'number',
      initialValue: 10,
    }),
  ],

  preview: {
    select: {
      bg: 'name.bg',
      price: 'price',
      media: 'image',
      available: 'isAvailable',
      cat: 'category.name.bg',
      featured: 'isFeatured',
    },
    prepare({ bg, price, media, available, cat, featured }) {
      const flags = [
        !available ? '🚫' : '',
        featured ? '⚡' : '',
      ].filter(Boolean).join(' ')
      return {
        title: `${flags} ${bg}`.trim(),
        subtitle: `${cat ? cat + ' · ' : ''}${price ?? ''} €`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Категория → Наредба',