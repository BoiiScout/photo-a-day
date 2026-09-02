/**
 * Спільні типи проєкту Photo a Day
 */

// Рядок таблиці `photos` у Supabase
export interface Photo {
  id: string;
  user_id: string;
  /** формат YYYY-MM-DD */
  date: string;
  image_url: string;
  created_at: string;
}

// Тип для вставки нового фото (без згенерованих полів)
export type PhotoInsert = Omit<Photo, "id" | "created_at">;

// Map "YYYY-MM-DD" -> Photo, для швидкого пошуку у календарі
export type PhotosByDate = Record<string, Photo>;

// Типізація схеми бази даних Supabase (використовується у supabase-js generic)
export interface Database {
  public: {
    Tables: {
      photos: {
        Row: Photo;
        Insert: PhotoInsert;
        Update: Partial<PhotoInsert>;
      };
    };
  };
}
