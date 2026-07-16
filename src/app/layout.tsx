import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "@/styles/command-tokens.css";
import "@/components/campaign/theme/campaign-reading-tokens.css";
import { Toaster } from "sonner";
import { AppShell } from "@/components/ui/app-shell";

export const metadata: Metadata = {
  title: "Phoenix 生活與考試控制台",
  description: "本機優先的生活與考試儀表板",
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
