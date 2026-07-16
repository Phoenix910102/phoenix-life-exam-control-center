"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { BookOpen, ClipboardList, Gamepad2, HeartPulse, LayoutDashboard, Music2, Pill, Settings, Terminal, Trophy } from "lucide-react";

const links = [
  ["/dashboard", "總覽", LayoutDashboard],
  ["/life", "生活紀錄", HeartPulse],
  ["/meds", "用藥", Pill],
  ["/tasks", "任務", ClipboardList],
  ["/materials", "教材", BookOpen],
  ["/exams", "考試", Trophy],
  ["/games", "小遊戲", Gamepad2],
  ["/guzheng", "古箏聽音", Music2],
  ["/achievements", "成就", Trophy],
  ["/settings", "設定", Settings],
  ["/console", "控制台", Terminal],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (
    pathname.startsWith("/command-center")
    || pathname.startsWith("/materials")
    || pathname.startsWith("/campaigns")
    || pathname.startsWith("/arsenal")
  ) {
    return children;
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="mb-6 rounded-xl border border-border bg-white/90 p-4 shadow-sm backdrop-blur">
        <h1 className="text-xl font-semibold">Phoenix 生活與考試控制台</h1>
        <nav className="mt-3 flex flex-wrap gap-2">
          {links.map(([href, label, Icon]) => (
            <Link
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm",
                pathname.startsWith(href) ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
              )}
              key={href}
              href={{ pathname: href }}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
