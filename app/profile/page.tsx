import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 pt-6">
      <header className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold">Профіль</h1>
      </header>

      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-xl font-semibold text-primary">
          {user?.email?.[0]?.toUpperCase() ?? "?"}
        </div>
        <p className="text-sm text-foreground">{user?.email}</p>
      </div>

      <SignOutButton />
    </main>
  );
}
