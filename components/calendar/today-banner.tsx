import { CheckCircle2, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Невеликий інформаційний банер: показує статус фото за сьогодні.
 * Саме додавання відбувається через клік на клітинку "сьогодні" у календарі,
 * банер лише інформує — щоб не дублювати логіку завантаження у двох місцях.
 */
export function TodayBanner({ hasTodayPhoto }: { hasTodayPhoto: boolean }) {
  return (
    <div
      className={cn(
        "mx-4 mt-4 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
        hasTodayPhoto
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-secondary/50 text-muted-foreground"
      )}
    >
      {hasTodayPhoto ? (
        <>
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Фото за сьогодні вже додано
        </>
      ) : (
        <>
          <ImagePlus className="h-4 w-4 shrink-0" />
          Торкніться сьогоднішнього дня в календарі, щоб додати фото
        </>
      )}
    </div>
  );
}
