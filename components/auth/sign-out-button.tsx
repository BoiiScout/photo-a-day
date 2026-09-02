"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  }

  return (
    <Button variant="destructive" onClick={handleSignOut} disabled={loading} className="gap-2">
      {loading ? <Spinner className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
      Вийти
    </Button>
  );
}
