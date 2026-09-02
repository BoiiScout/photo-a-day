"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { compressToWebP } from "@/lib/utils/image";
import { uploadDayPhoto } from "@/lib/actions/photos";
import { formatHumanDate } from "@/lib/utils/date";
import type { Photo } from "@/lib/types";

interface DayDialogProps {
  dateKey: string | null;
  photo?: Photo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoAdded: (photo: Photo) => void;
}

export function DayDialog({
  dateKey,
  photo,
  open,
  onOpenChange,
  onPhotoAdded,
}: DayDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!dateKey) return null;

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !dateKey) return;

    setError(null);
    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const compressed = await compressToWebP(file);

      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("date", dateKey);

      const result = await uploadDayPhoto(formData);

      if (result?.error) {
        setError(result.error);
        setPreviewUrl(null);
      } else {
        // Оптимістично оновлюємо календар. Реальний image_url підтягнеться
        // при наступному відкритті/перезавантаженні, тут показуємо локальний preview.
        onPhotoAdded({
          id: crypto.randomUUID(),
          user_id: "",
          date: dateKey,
          image_url: previewUrl ?? "",
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося обробити фото.");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const hasPhoto = Boolean(photo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formatHumanDate(dateKey)}</DialogTitle>
        </DialogHeader>

        {hasPhoto ? (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <Image
              src={photo!.image_url}
              alt={`Фото за ${dateKey}`}
              fill
              sizes="480px"
              className="object-cover"
            />
          </div>
        ) : previewUrl ? (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <Image
              src={previewUrl}
              alt="Попередній перегляд"
              fill
              sizes="480px"
              className="object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Spinner className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border py-10">
            <Camera className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              На цей день ще немає фото
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2"
            >
              {uploading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Додати фото
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelected}
              className="hidden"
            />
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
