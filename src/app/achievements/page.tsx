"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  Crown,
  Droplets,
  Gamepad2,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";
import { getAchievementDashboard } from "@/lib/achievements/rules";
import type { AchievementDefinition } from "@/lib/achievements/definitions";
import type { Achievement, AchievementProgress } from "@/types/achievement";
import styles from "./achievements.module.css";

type DashboardItem = {
  definition: AchievementDefinition;
  unlocked?: Achievement;
  progress: AchievementProgress;
};

const iconMap = {
  spark: Sparkles,
  sword: Swords,
  shield: ShieldCheck,
  crown: Crown,
  rose: Trophy,
  water: Droplets,
  task: ScrollText,
  exam: BookOpenCheck,
  game: Gamepad2,
};

const categoryLabels: Record<AchievementDefinition["category"], string> = {
  conquest: "征服",
  stability: "固守",
  recovery: "逆轉",
  style: "終局",
  care: "補給",
  foundation: "基礎",
};

export default function AchievementsPage() {
  const [items, setItems] = useState<DashboardItem[]>([]);

  useEffect(() => {
    getAchievementDashboard().then(setItems);
  }, []);

  const unlockedCount = items.filter((item) => item.unlocked).length;
  const completion = items.length === 0 ? 0 : Math.round((unlockedCount / items.length) * 100);
  const groups = useMemo(() => {
    const next = new Map<AchievementDefinition["category"], DashboardItem[]>();
    for (const item of items) {
      const group = next.get(item.definition.category) ?? [];
      group.push(item);
      next.set(item.definition.category, group);
    }
    return Array.from(next.entries());
  }, [items]);

  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <div>
          <p>Phoenix Campaign Archive</p>
          <h2>戰役成就庫</h2>
          <span>成就由教材進度、測驗戰報與照護紀律自動判定，不靠手動勾選。</span>
        </div>
        <div className={styles.totalSeal}>
          <Trophy size={22} />
          <strong>{unlockedCount}<small> / {items.length}</small></strong>
          <span>已解鎖</span>
        </div>
      </header>

      <section className={styles.progressBand} aria-label="成就總進度">
        <div><span>成就完成率</span><strong>{completion}%</strong></div>
        <div className={styles.progressTrack}><i style={{ width: `${completion}%` }} /></div>
        <p>休息不會中斷戰役；穩定守住才算真正掌握。</p>
      </section>

      {groups.map(([category, categoryItems]) => (
        <section className={styles.category} key={category}>
          <div className={styles.categoryHeading}>
            <span>{categoryLabels[category]}</span>
            <p>{categoryItems.filter((item) => item.unlocked).length} / {categoryItems.length} 解鎖</p>
          </div>
          <div className={styles.medalGrid}>
            {categoryItems.map(({ definition, progress, unlocked }) => {
              const Icon = iconMap[definition.icon];
              const percent = Math.min(100, Math.round((progress.current / progress.target) * 100));
              return (
                <article
                  className={`${styles.medal} ${unlocked ? styles.unlocked : styles.locked}`}
                  data-tier={definition.tier}
                  key={definition.id}
                >
                  <div className={styles.medalIcon}><Icon size={25} /></div>
                  <div className={styles.medalCopy}>
                    <span>{definition.tier}</span>
                    <h3>{definition.title}</h3>
                    <p>{definition.description}</p>
                    <div className={styles.medalProgress}>
                      <i><b style={{ width: `${percent}%` }} /></i>
                      <small>{Math.min(progress.current, progress.target)} / {progress.target} {definition.unit}</small>
                    </div>
                    <em>{unlocked ? `解鎖於 ${new Date(unlocked.unlockedAt).toLocaleDateString("zh-TW")}` : "尚未解鎖"}</em>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
