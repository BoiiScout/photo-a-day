"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayCell } from "@/components/calendar/day-cell";
import { DayDialog } from "@/components/calendar/day-dialog";
import { getPhotosForMonth } from "@/lib/actions/photos";
import { formatMonthYear, toDateKey, WEEKDAY_LABELS_UK } from "@/lib/utils/date";
import type { Photo, PhotosByDate } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";

interface CalendarViewProps {
  initialMonth: Date;
  initialPhotos: PhotosByDate;
}

export function CalendarView({ initialMonth, initialPhotos }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [photos, setPhotos] = useState<PhotosByDate>(initialPhotos);
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // При зміні місяця підвантажуємо фото за новий період
  useEffect(() => {
    startTransition(async () => {
      const data = await getPhotosForMonth(
        currentMonth.getFullYear(),
        currentMonth.getMonth()
      );
      setPhotos(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  function handlePhotoAdded(photo: Photo) {
    setPhotos((prev) => ({ ...prev, [photo.date]: photo }));
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      {/* Перемикач місяців */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          aria-label="Попередній місяць"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">{formatMonthYear(currentMonth)}</h2>
          {isPending && <Spinner className="h-3.5 w-3.5 text-muted-foreground" />}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          aria-label="Наступний місяць"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Дні тижня */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS_UK.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      {/* Сітка днів */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const key = toDateKey(day);
          return (
            <DayCell
              key={key}
              date={day}
              currentMonth={currentMonth}
              photo={photos[key]}
              onClick={() => setSelectedDate(key)}
            />
          );
        })}
      </div>

      <DayDialog
        dateKey={selectedDate}
        photo={selectedDate ? photos[selectedDate] : undefined}
        open={selectedDate !== null}
        onOpenChange={(open) => !open && setSelectedDate(null)}
        onPhotoAdded={handlePhotoAdded}
      />
    </div>
  );
}
