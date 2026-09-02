import { format, subYears, subMonths, isToday, isSameMonth } from "date-fns";
import { uk } from "date-fns/locale";

/** Формат ключа дати, який використовується у БД та як ключ в об'єктах: YYYY-MM-DD */
export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Дата рівно рік тому від сьогодні, у форматі YYYY-MM-DD */
export function dateKeyYearAgo(from: Date = new Date()): string {
  return toDateKey(subYears(from, 1));
}

/** Дата рівно місяць тому від сьогодні, у форматі YYYY-MM-DD */
export function dateKeyMonthAgo(from: Date = new Date()): string {
  return toDateKey(subMonths(from, 1));
}

/** Людяне відображення дати українською, напр. "3 вересня 2026" */
export function formatHumanDate(dateKey: string): string {
  const date = new Date(dateKey + "T00:00:00");
  return format(date, "d MMMM yyyy", { locale: uk });
}

/** Назва місяця + рік українською, напр. "Вересень 2026" */
export function formatMonthYear(date: Date): string {
  const s = format(date, "LLLL yyyy", { locale: uk });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export { isToday, isSameMonth };

export const WEEKDAY_LABELS_UK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
