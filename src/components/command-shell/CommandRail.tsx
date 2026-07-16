"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, HeartPulse, Home, Menu, Pill, Settings, Trophy, X } from "lucide-react";
import styles from "./command-shell.module.css";

const navigation = [
  ["/command-center", "中控台", Home],
  ["/materials", "教材戰役", BookOpen],
  ["/life", "生活紀錄", HeartPulse],
  ["/meds", "用藥協議", Pill],
  ["/achievements", "成就館", Trophy],
  ["/settings", "設定", Settings],
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/materials" && pathname.startsWith("/campaigns/")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CommandRail() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  return (
    <>
      <nav className={styles.rail} aria-label="Phoenix 全域導航">
        {navigation.map(([href, label, Icon]) => {
          const active = isActivePath(pathname, href);
          return (
            <Link aria-current={active ? "page" : undefined} data-active={active} href={href} key={href} title={label}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        aria-controls="command-mobile-navigation"
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? "關閉全域導航" : "開啟全域導航"}
        className={styles.mobileMenuButton}
        onClick={() => setMobileOpen((current) => !current)}
        type="button"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen ? (
        <div className={styles.mobileScrim} onClick={() => setMobileOpen(false)}>
          <nav
            aria-label="Phoenix 行動版全域導航"
            className={styles.mobileSheet}
            id="command-mobile-navigation"
            onClick={(event) => event.stopPropagation()}
          >
            <p>PHOENIX SYSTEMS</p>
            {navigation.map(([href, label, Icon]) => {
              const active = isActivePath(pathname, href);
              return (
                <Link aria-current={active ? "page" : undefined} data-active={active} href={href} key={href}>
                  <Icon size={18} /><span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}
