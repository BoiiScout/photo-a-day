"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Календар", icon: CalendarDays },
  { href: "/memories", label: "Спогади", icon: Sparkles },
  { href: "/profile", label: "Профіль", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  // На сторінці авторизації навігація не потрібна
  if (pathname?.startsWith("/auth")) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="flex items-center justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 text-xs transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "fill-primary/20")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
