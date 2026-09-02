import imageCompression from "browser-image-compression";

/**
 * Стискає зображення на клієнті перед завантаженням у Supabase Storage:
 * - конвертує у WebP
 * - максимальна ширина/висота: 1200px
 * - якість ~70-80% (керується через maxSizeMB + useWebWorker в browser-image-compression)
 */
export async function compressToWebP(file: File): Promise<File> {
  const options = {
    maxWidthOrHeight: 1200,
    // приблизний бюджет розміру, що при роздільній здатності 1200px
    // на практиці дає якість близьку до 70-80% для WebP
    maxSizeMB: 0.6,
    useWebWorker: true,
    fileType: "image/webp" as const,
    initialQuality: 0.78,
  };

  try {
    const compressed = await imageCompression(file, options);
    // Перейменовуємо файл, щоб розширення відповідало новому типу
    const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    return new File([compressed], newName, { type: "image/webp" });
  } catch (err) {
    console.error("Помилка стиснення зображення:", err);
    throw new Error("Не вдалося обробити зображення. Спробуйте інший файл.");
  }
}
