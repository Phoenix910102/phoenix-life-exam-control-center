"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const links = [
  ["/dashboard", "Dashboard"],
  ["/life", "Life"],
  ["/meds", "Meds"],
  ["/tasks", "Tasks"],
  ["/exams", "Exams"],
  ["/games", "Games"],
  ["/achievements", "Achievements"],
  ["/settings", "Settings"],
  ["/console", "Console"],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="mb-6 rounded-xl border border-border bg-white/80 p-4 backdrop-blur">
        <h1 className="text-xl font-semibold">Phoenix Life & Exam Control Center</h1>
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
