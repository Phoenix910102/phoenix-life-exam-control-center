import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "sonner";
import { AppShell } from "@/components/ui/app-shell";

export const metadata: Metadata = {
  title: "Phoenix Life & Exam Control Center",
  description: "Local-first Life + Exam dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <AppShell>{children}</AppShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
