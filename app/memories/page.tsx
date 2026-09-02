import Image from "next/image";
import { Sparkles, ImageOff } from "lucide-react";
import { getPhotosByDates } from "@/lib/actions/photos";
import { dateKeyMonthAgo, dateKeyYearAgo, formatHumanDate } from "@/lib/utils/date";

export default async function MemoriesPage() {
  const yearAgoKey = dateKeyYearAgo();
  const monthAgoKey = dateKeyMonthAgo();

  const photos = await getPhotosByDates([yearAgoKey, monthAgoKey]);

  const memories = [
    { key: monthAgoKey, label: "Місяць тому", photo: photos[monthAgoKey] },
    { key: yearAgoKey, label: "Рік тому", photo: photos[yearAgoKey] },
  ];

  return (
    <main className="flex flex-1 flex-col gap-5 px-4 pt-6">
      <header className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold">Спогади</h1>
      </header>

      {memories.map(({ key, label, photo }) => (
        <section key={key} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-foreground">{label}</h2>
            <span className="text-xs text-muted-foreground">{formatHumanDate(key)}</span>
          </div>

          {photo ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border">
              <Image
                src={photo.image_url}
                alt={label}
                fill
                sizes="480px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[3/1.4] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground">
              <ImageOff className="h-6 w-6" />
              <p className="text-xs">На цю дату фото немає</p>
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
