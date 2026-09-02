"use client";

import Image from "next/image";
import { isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import type { Photo } from "@/lib/types";

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  photo?: Photo;
  onClick: () => void;
}

export function DayCell({ date, currentMonth, photo, onClick }: DayCellProps) {
  const inMonth = isSameMonth(date, currentMonth);
  const today = isToday(date);
  const isFuture = date > new Date();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isFuture}
      className={cn(
        "relative aspect-square overflow-hidden rounded-lg border transition-all",
        "flex items-center justify-center text-xs",
        inMonth ? "border-border" : "border-transparent opacity-30",
        today && "ring-2 ring-primary ring-offset-1 ring-offset-background",
        photo ? "bg-muted" : "bg-secondary/50 hover:bg-secondary",
        isFuture && "cursor-not-allowed opacity-20"
      )}
    >
      {photo ? (
        <Image
          src={photo.image_url}
          alt={`Фото за ${photo.date}`}
          fill
          sizes="60px"
          className="object-cover"
        />
      ) : (
        <span className={cn(inMonth ? "text-foreground/70" : "text-muted-foreground")}>
          {date.getDate()}
        </span>
      )}
      {photo && (
        <span className="absolute bottom-0.5 right-1 text-[10px] font-medium text-white drop-shadow">
          {date.getDate()}
        </span>
      )}
    </button>
  );
}
