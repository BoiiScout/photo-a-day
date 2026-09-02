import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Обробляє редірект після OAuth (Google) або підтвердження email:
 * обмінює `code` на сесію користувача та зберігає її у cookies.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Якщо щось пішло не так — повертаємо на сторінку авторизації з помилкою
  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`);
}
