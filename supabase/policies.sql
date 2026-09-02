-- ============================================================
-- Photo a Day — Row Level Security (RLS)
-- Виконайте після schema.sql у Supabase SQL Editor
-- ============================================================

-- 1. Увімкнути RLS на таблиці photos
alter table public.photos enable row level security;

-- Користувач бачить лише свої фото
create policy "photos_select_own"
  on public.photos for select
  using (auth.uid() = user_id);

-- Користувач може додавати фото лише від свого імені
create policy "photos_insert_own"
  on public.photos for insert
  with check (auth.uid() = user_id);

-- Користувач може оновлювати лише власні записи (наприклад, у майбутньому)
create policy "photos_update_own"
  on public.photos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Користувач може видаляти лише власні фото
create policy "photos_delete_own"
  on public.photos for delete
  using (auth.uid() = user_id);


-- ============================================================
-- 2. Storage bucket "photos"
-- Спочатку створіть bucket через Dashboard -> Storage -> New bucket
-- Назва: photos, Public bucket: увімкнено (для простого доступу до image_url)
-- Або розкоментуйте створення bucket нижче (потребує прав service_role):
-- ============================================================

-- insert into storage.buckets (id, name, public)
-- values ('photos', 'photos', true)
-- on conflict (id) do nothing;

-- Файли зберігаються за шляхом: {user_id}/{date}.webp
-- Це дозволяє легко обмежити доступ на рівні папки користувача.

-- Кожен може читати публічні фото (bucket public = true), але
-- завантажувати/видаляти може лише власник папки {user_id}/...
create policy "photos_storage_insert_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "photos_storage_select_own_folder"
  on storage.objects for select
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "photos_storage_delete_own_folder"
  on storage.objects for delete
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Якщо bucket публічний і потрібно, щоб будь-хто міг переглядати фото
-- за прямим посиланням (наприклад, для <Image> без автентифікованого запиту),
-- публічний read вже забезпечується прапорцем public=true на bucket —
-- додаткова select-політика для anon не потрібна.
