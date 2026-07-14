"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const links = [
  ["/dashboard", "總覽"],
  ["/life", "生活紀錄"],
  ["/meds", "用藥"],
  ["/tasks", "任務"],
  ["/exams", "考試"],
  ["/games", "小遊戲"],
  ["/guzheng", "古箏聽音"],
  ["/achievements", "成就"],
  ["/settings", "設定"],
  ["/console", "控制台"],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="mb-6 rounded-xl border border-border bg-white/90 p-4 shadow-sm backdrop-blur">
        <h1 className="text-xl font-semibold">Phoenix 生活與考試控制台</h1>
        <nav className="mt-3 flex flex-wrap gap-2">
          {links.map(([href, label]) => (
            <Link
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                pathname.startsWith(href) ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
              )}
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
