# Photo a Day 📸

MVP веб-додатку "одне фото на день" — Next.js 14 (App Router) + TypeScript + Tailwind + Supabase.

## Стек

- **Next.js 14** (App Router, Server Components + Server Actions)
- **TypeScript**
- **Tailwind CSS** + компоненти у стилі **shadcn/ui**
- **Supabase**: Auth (email/password + Google), Postgres, Storage
- **date-fns** для роботи з датами (локаль `uk`)
- **browser-image-compression** для стиснення фото до WebP на клієнті перед завантаженням

## Структура проєкту

```
app/
  layout.tsx              # кореневий layout + нижня навігація
  page.tsx                # / — календар (Server Component)
  auth/
    page.tsx              # форма входу/реєстрації
    callback/route.ts     # обмін OAuth/email коду на сесію
  memories/page.tsx        # /memories — рік/місяць тому
  profile/page.tsx         # /profile — email + вихід
components/
  calendar/                # Calendar, DayCell, DayDialog, TodayBanner
  auth/                     # AuthForm, SignOutButton
  ui/                       # Button, Dialog, Spinner (shadcn-стиль)
  bottom-nav.tsx
lib/
  supabase/client.ts        # Supabase клієнт для браузера
  supabase/server.ts        # Supabase клієнт для сервера
  supabase/middleware.ts     # оновлення сесії у middleware
  actions/photos.ts          # Server Actions: upload, отримання фото
  utils/date.ts               # хелпери дат (uk локаль)
  utils/image.ts               # стиснення зображення -> WebP
  types.ts                     # типи Photo, Database тощо
middleware.ts                  # захист приватних маршрутів
supabase/
  schema.sql                   # таблиця photos + індекси
  policies.sql                  # RLS політики (таблиця + storage)
```

## Налаштування Supabase

1. Створіть проєкт на [supabase.com](https://supabase.com) (безкоштовний план).
2. У **SQL Editor** виконайте по черзі:
   - `supabase/schema.sql`
   - `supabase/policies.sql`
3. У **Storage** створіть bucket з назвою `photos`, позначте його **Public**.
4. У **Authentication -> Providers**:
   - Увімкніть **Email** (за замовчуванням увімкнено).
   - Увімкніть **Google**: додайте Client ID / Secret з Google Cloud Console.
     Redirect URL, який потрібно додати в Google Console:
     `https://<ваш-проєкт>.supabase.co/auth/v1/callback`
5. У **Authentication -> URL Configuration** додайте:
   - Site URL: `http://localhost:3000` (для розробки)
   - Redirect URLs: `http://localhost:3000/auth/callback`

## Локальний запуск

```bash
npm install
cp .env.local.example .env.local
# заповніть NEXT_PUBLIC_SUPABASE_URL та NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Додаток буде доступний на `http://localhost:3000`.

## Деплой

Найпростіший безкоштовний варіант — [Vercel](https://vercel.com):
1. Запуште репозиторій на GitHub.
2. Імпортуйте проєкт у Vercel.
3. Додайте ті самі змінні середовища (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Після деплою додайте продакшн-домен у Supabase Redirect URLs.

## Можливі наступні кроки (поза MVP)

- Офлайн-режим / PWA (кешування останніх фото)
- Стрік (кількість днів поспіль з фото)
- Експорт усіх фото в архів
- Публічний/приватний профіль для шерингу
