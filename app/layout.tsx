import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";

export const metadata: Metadata = {
  title: "Photo a Day",
  description: "Одне фото на день. Твій візуальний щоденник.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d0d10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="dark">
      <body className="min-h-screen antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col pb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
