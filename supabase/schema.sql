-- ============================================================
-- Photo a Day — схема бази даних
-- Виконайте у Supabase SQL Editor (Dashboard -> SQL Editor)
-- ============================================================

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

-- Один користувач — одне фото на дату
create unique index if not exists photos_user_date_unique
  on public.photos (user_id, date);

-- Прискорює вибірку фото користувача за діапазоном дат (календар, спогади)
create index if not exists photos_user_date_idx
  on public.photos (user_id, date desc);

comment on table public.photos is 'Одне фото на день на користувача';
