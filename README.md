# The High-End Bar — Digital Menu

**Next.js 14 + Sanity v3 + Vercel**
Двуезично (BG/EN) дигитално меню с QR достъп, дневно обедно меню и Happy Hour банер.

---

## Архитектура

```
menu.high-end.bg/menu      → Меню на Български (Next.js @ Vercel)
menu.high-end.bg/menu/en   → Menu in English
menu.high-end.bg/studio    → Sanity Studio (за управителя)
```

---

## 1. Стъпки за настройка

### 1.1 Sanity проект

1. Отиди на **https://www.sanity.io** → Sign Up (безплатно)
2. Създай нов проект: `New Project` → `Create from scratch`
3. Запиши **Project ID** (ще ти трябва за `.env.local`)
4. Dataset: `production` (по подразбиране)

### 1.2 Клониране и инсталация

```bash
git clone <repo-url> high-end-menu
cd high-end-menu
npm install
```

### 1.3 Environment variables

```bash
cp .env.example .env.local
```

Отвори `.env.local` и попълни:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz     # от sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skXXXXXXXX                # Viewer token (виж т. 1.4)
SANITY_REVALIDATE_SECRET=some-random-string
DEEPL_API_KEY=your-deepl-key:fx            # ":fx" за Free tier
NEXT_PUBLIC_BASE_URL=https://menu.high-end.bg
```

### 1.4 Sanity API Token

- sanity.io/manage → твоят проект → **API** → **Tokens**
- `Add API token` → Name: `Next.js` → Permissions: **Viewer**
- Копирай токена в `SANITY_API_TOKEN`

### 1.5 DeepL API (безплатен tier — 500 000 знака/месец)

- Регистрация на **https://www.deepl.com/pro-api**
- Free план: `DeepL API Free`
- API ключът завършва с `:fx`
- Попълни в `DEEPL_API_KEY`

---

## 2. Стартиране локално

```bash
npm run dev
```

- Меню: **http://localhost:3000/menu**
- Studio: **http://localhost:3000/studio**

---

## 3. Деплой на Vercel

### 3.1 Push кода в GitHub

```bash
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/ТВОЯ-USERNAME/high-end-menu.git
git push -u origin main
```

### 3.2 Свържи с Vercel

1. **https://vercel.com** → `New Project` → избери GitHub репото
2. Framework: **Next.js** (авто-открива се)
3. **Environment Variables** → добави всички от `.env.local`
4. `Deploy`

### 3.3 Custom domain

- Vercel dashboard → твоят проект → **Domains**
- Добави `menu.high-end.bg`
- В DNS на домейна добави: `CNAME menu → cname.vercel-dns.com`

---

## 4. Sanity Webhook (за автоматичен refresh)

Когато управителят публикува промяна в Studio, менюто се обновява **автоматично**.

1. sanity.io/manage → твоят проект → **API** → **Webhooks**
2. `Create webhook`:
   - **Name**: `Vercel Revalidate`
   - **URL**: `https://menu.high-end.bg/api/revalidate?secret=ТВОЯТа_СТОЙНОСТ`
     *(същата като `SANITY_REVALIDATE_SECRET` в .env.local)*
   - **Trigger on**: `publish`, `update`, `delete`
   - **Filter**: `_type in ["menuItem", "category", "dailyMenu", "siteSettings"]`
3. `Save`

---

## 5. Попълване на съдържание в Studio

### Първо — Категории

Отиди в Studio → **📂 Категории** → `Create`:

| Категория | Emoji | Група | Стил |
|-----------|-------|-------|------|
| Еспресо напитки | ☕ | hot | cards |
| Чайове | 🍵 | hot | compact |
| Горещ шоколад | 🍫 | hot | compact |
| Фрешове и смутита | 🥤 | cold | cards |
| Студено кафе | 🧊 | cold | cards |
| Газирани напитки | 🫧 | cold | compact |
| Вода | 💧 | cold | compact |
| Вина | 🍷 | alcohol | list |
| Бира | 🍺 | alcohol | list |
| Уиски | 🥃 | alcohol | list |
| Коктейли | 🍸 | alcohol | cards |
| Джин / Водка / Ром | 🫙 | alcohol | list |
| Аперитиви & Дижестиви | 🍾 | alcohol | list |
| Директорски шкаф | 💎 | alcohol | list |
| Закуски и сандвичи | 🥪 | food | cards |
| Салати | 🥗 | food | cards |
| Супи | 🍲 | food | compact |
| Тапас | 🫒 | food | cards |
| Плодове | 🍇 | food | compact |
| Десерти | 🍰 | food | cards |
| Здравословно меню | 🥦 | food | cards |

### Второ — Артикули

Studio → **🍽 Всички артикули** → `Create`:
- Попълни **Български** полета
- Натисни **"🌐 Translate BG → EN"** за автоматичен превод
- Провери и коригирай EN ако е нужно
- `Publish`

### Трето — Обедно меню

Studio → **🍽 Обедно меню** → `Create`:
- Избери дата (може предварително за цяла седмица)
- Задай часовия прозорец (напр. `12:00` — `14:30`)
- Добави раздели (Супи, Основни ястия, Десерти...)
- За всяко ястие: БГ название + превод + цена
- `Publish` — менюто се показва **само** в зададения час

---

## 6. QR код

След деплой на Vercel:

1. Отиди на **https://www.qr-code-generator.com** (или подобен)
2. Въведи URL: `https://menu.high-end.bg/menu`
3. Свали PNG/SVG и отпечатай на масите

*Или използвай старата `menu-qr.html` от проекта.*

---

## 7. Структура на проекта

```
high-end-menu/
├── app/
│   ├── menu/
│   │   ├── page.tsx           → /menu (BG)
│   │   └── en/page.tsx        → /menu/en (EN)
│   ├── studio/[[...tool]]/    → /studio (Sanity Studio)
│   ├── api/
│   │   ├── revalidate/        → Sanity webhook endpoint
│   │   └── translate/         → DeepL proxy
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── MenuShell.tsx          → главен компонент
│   ├── ItemCard.tsx           → карта (с/без снимка)
│   ├── ItemRow.tsx            → ред (list/compact)
│   └── DailyMenuSection.tsx   → обедно меню + time window
├── sanity/
│   ├── schemaTypes/           → 4 типа документи
│   ├── plugins/deeplTranslate → DeepL бутон в Studio
│   └── lib/                   → client, queries, image
├── lib/i18n.ts                → преводи BG/EN + helpers
├── middleware.ts              → / → /menu redirect
├── sanity.config.ts
└── .env.example
```

---

## 8. Полезни команди

```bash
npm run dev          # Локален dev сървър
npm run build        # Билд за продукция
npm run lint         # TypeScript + ESLint проверка
```

---

## 9. Честа употреба — управителят

| Задача | Как |
|--------|-----|
| Добавяне на ново питие | Studio → Артикули → Create |
| Изключване на изчерпан артикул | Studio → намери артикула → `isAvailable = false` |
| Маркиране "Препоръчано" | Studio → артикула → `isFeatured = true` |
| Днешно обедно меню | Studio → Обедно меню → Create → дата днес → Publish |
| Превод на EN | В артикул → бутон **"🌐 Translate BG → EN"** |
| Включване/изключване Happy Hour | Studio → Настройки |
| Промяна на адрес/footer | Studio → Настройки |
