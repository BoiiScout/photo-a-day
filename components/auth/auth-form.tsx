"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Camera } from "lucide-react";

type Mode = "sign-in" | "sign-up";

export function AuthForm() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setInfoMessage("Перевірте пошту — ми надіслали посилання для підтвердження акаунту.");
      }
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // Браузер перенаправить користувача на Google, стан loading лишаємо активним
    } catch (err) {
      setError(mapAuthError(err));
      setGoogleLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-10">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Camera className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold">Photo a Day</h1>
        <p className="text-center text-sm text-muted-foreground">
          Одне фото на день. Твій візуальний щоденник.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-lg border border-input bg-secondary px-4 text-sm outline-none ring-ring focus:ring-2"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 rounded-lg border border-input bg-secondary px-4 text-sm outline-none ring-ring focus:ring-2"
        />

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {infoMessage && (
          <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
            {infoMessage}
          </p>
        )}

        <Button type="submit" disabled={loading} className="mt-1">
          {loading ? (
            <Spinner className="h-4 w-4" />
          ) : mode === "sign-in" ? (
            "Увійти"
          ) : (
            "Зареєструватись"
          )}
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        або
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="gap-2"
      >
        {googleLoading ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <>
            <GoogleIcon />
            Продовжити з Google
          </>
        )}
      </Button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "sign-in" ? "sign-up" : "sign-in");
          setError(null);
          setInfoMessage(null);
        }}
        className="mt-6 text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {mode === "sign-in" ? (
          <>Немає акаунту? <span className="text-primary">Зареєструватись</span></>
        ) : (
          <>Вже є акаунт? <span className="text-primary">Увійти</span></>
        )}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v3h3.88c2.27-2.09 3.54-5.17 3.54-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.93H1.3v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.31 14.32c-.24-.72-.38-1.49-.38-2.32s.14-1.6.38-2.32V6.59H1.3A11.98 11.98 0 000 12c0 1.94.46 3.77 1.3 5.41l4.01-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.59l4.01 3.09c.94-2.83 3.58-4.93 6.69-4.93z"
      />
    </svg>
  );
}

function mapAuthError(err: unknown): string {
  const message = err instanceof Error ? err.message : "Сталася невідома помилка";
  if (message.includes("Invalid login credentials")) {
    return "Невірний email або пароль.";
  }
  if (message.includes("User already registered")) {
    return "Користувач з таким email вже зареєстрований.";
  }
  return message;
}
