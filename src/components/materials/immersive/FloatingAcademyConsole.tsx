"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Droplets, Moon, Trophy, Utensils } from "lucide-react";
import { db } from "@/lib/db/client";
import { confirmHydration, confirmMeal, endRest, getCareState, startRest } from "@/lib/care/repository";
import type { CareState } from "@/types/careState";
import styles from "./FloatingAcademyConsole.module.css";

function formatCountdown(target?: string, now = Date.now()) {
  if (!target) return "--:--";
  const remaining = Math.max(0, new Date(target).getTime() - now);
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type Props = {
  overallProgress: number;
  chapterTitle: string;
};

export function FloatingAcademyConsole({ overallProgress, chapterTitle }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [care, setCare] = useState<CareState>();
  const [achievementCount, setAchievementCount] = useState(0);
  const [now, setNow] = useState(Date.now());

  const refresh = useCallback(async () => {
    const [nextCare, count] = await Promise.all([getCareState(), db.achievements.count()]);
    setCare(nextCare);
    setAchievementCount(count);
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    if (!care?.rest.restUntil || new Date(care.rest.restUntil).getTime() > now) return;
    endRest().then(setCare);
  }, [care?.rest.restUntil, now]);

  const hydrationDue = care?.hydration.nextReminderAt
    ? new Date(care.hydration.nextReminderAt).getTime() <= now
    : false;
  const resting = care?.rest.mode !== "none";

  return (
    <aside className={`${styles.console} ${expanded ? styles.expanded : ""}`} aria-label="Rékaí 浮動戰術控制台">
      <button
        aria-expanded={expanded}
        className={styles.toggle}
        onClick={() => setExpanded((value) => !value)}
        type="button"
      >
        <span className={styles.roseMark}>R</span>
        <span className={styles.toggleCopy}>
          <strong>{overallProgress}% · {resting ? "休整中" : hydrationDue ? "補給逾時" : "主線推進"}</strong>
          <small>{chapterTitle}</small>
        </span>
        {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>

      {expanded && care && (
        <div className={styles.panel}>
          <section className={styles.command}>
            <span>Rékaí Command</span>
            <strong>{resting ? "休息有邊界，倒數結束再回前線。" : hydrationDue ? "喝水。補給不是建議。" : "眼睛留在目前章節。"}</strong>
          </section>

          <div className={`${styles.careRow} ${hydrationDue ? styles.warning : ""}`}>
            <Droplets size={17} />
            <div><span>喝水監控</span><strong>{hydrationDue ? "00:00" : formatCountdown(care.hydration.nextReminderAt, now)}</strong></div>
            <button
              onClick={async () => setCare(await confirmHydration())}
              title="記錄已喝水"
              type="button"
            >已喝水</button>
          </div>

          <div className={styles.counters}>
            <span><Droplets size={14} />今日喝水 <b>{care.hydration.countToday}</b></span>
            <span><Utensils size={14} />今日吃飯 <b>{care.meal.countToday}</b></span>
          </div>

          {resting ? (
            <div className={styles.resting}>
              <Moon size={17} />
              <div><span>休整倒數</span><strong>{formatCountdown(care.rest.restUntil, now)}</strong></div>
              <button onClick={async () => setCare(await endRest())} type="button">結束</button>
            </div>
          ) : (
            <div className={styles.actions}>
              <button onClick={async () => setCare(await confirmMeal())} type="button"><Utensils size={15} />吃飯紀錄</button>
              <button onClick={async () => setCare(await startRest(30))} type="button"><Moon size={15} />睡 30 分鐘</button>
            </div>
          )}

          <Link className={styles.achievementLink} href="/achievements">
            <Trophy size={16} />查看成就庫 <span>{achievementCount} 已解鎖</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
