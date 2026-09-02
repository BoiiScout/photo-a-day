import { createClient } from "@/lib/supabase/server";
import { getPhotosForMonth } from "@/lib/actions/photos";
import { CalendarView } from "@/components/calendar/calendar-view";
import { TodayBanner } from "@/components/calendar/today-banner";
import { toDateKey } from "@/lib/utils/date";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();
  const photos = await getPhotosForMonth(now.getFullYear(), now.getMonth());
  const todayKey = toDateKey(now);
  const hasTodayPhoto = Boolean(photos[todayKey]);

  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-4 pt-6">
        <div>
          <h1 className="text-lg font-bold">Photo a Day</h1>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </header>

      <TodayBanner hasTodayPhoto={hasTodayPhoto} />

      <CalendarView initialMonth={now} initialPhotos={photos} />
    </main>
  );
}
