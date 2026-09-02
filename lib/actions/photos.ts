"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Photo, PhotosByDate } from "@/lib/types";

const BUCKET = "photos";

/**
 * Завантажує вже стиснений WebP-файл у Supabase Storage та створює запис у таблиці `photos`.
 * Через унікальний індекс (user_id, date) повторна спроба на ту саму дату поверне помилку.
 */
export async function uploadDayPhoto(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Потрібна авторизація." };
  }

  const file = formData.get("file") as File | null;
  const dateKey = formData.get("date") as string | null;

  if (!file || !dateKey) {
    return { error: "Файл або дата відсутні." };
  }

  const path = `${user.id}/${dateKey}.webp`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: "image/webp",
      upsert: false, // не даємо перезаписати фото цього дня
    });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes("already exists")) {
      return { error: "Фото на цей день вже додано." };
    }
    return { error: "Не вдалося завантажити фото. Спробуйте ще раз." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error: insertError } = await supabase.from("photos").insert({
    user_id: user.id,
    date: dateKey,
    image_url: publicUrl,
  });

  if (insertError) {
    // Прибираємо файл, якщо запис у БД не вдався (наприклад, дубль дати)
    await supabase.storage.from(BUCKET).remove([path]);
    if (insertError.message.toLowerCase().includes("duplicate")) {
      return { error: "Фото на цей день вже додано." };
    }
    return { error: "Не вдалося зберегти фото. Спробуйте ще раз." };
  }

  revalidatePath("/");
  revalidatePath("/memories");
  return { success: true };
}

/** Отримує всі фото користувача за конкретний місяць, у вигляді мапи по даті */
export async function getPhotosForMonth(year: number, month: number): Promise<PhotosByDate> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = new Date(year, month + 1, 0).getDate();
  const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(endDate).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end);

  if (error || !data) return {};

  return data.reduce<PhotosByDate>((acc, photo) => {
    acc[photo.date] = photo as Photo;
    return acc;
  }, {});
}

/** Отримує фото користувача за конкретними датами (для сторінки Спогадів) */
export async function getPhotosByDates(dateKeys: string[]): Promise<PhotosByDate> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("user_id", user.id)
    .in("date", dateKeys);

  if (error || !data) return {};

  return data.reduce<PhotosByDate>((acc, photo) => {
    acc[photo.date] = photo as Photo;
    return acc;
  }, {});
}
