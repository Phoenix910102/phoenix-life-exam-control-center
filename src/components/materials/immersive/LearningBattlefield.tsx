"use client";

import { useMemo } from "react";
import { EyeOff, PackageOpen, ShieldCheck, Swords, TriangleAlert } from "lucide-react";
import { deriveBattlefield, type BattlefieldZoneStatus } from "@/lib/battlefield/deriveBattlefield";
import type { MaterialDefinition, MaterialProgress } from "@/types/materialRecord";
import styles from "./LearningBattlefield.module.css";

const statusCopy: Record<BattlefieldZoneStatus, { label: string; detail: string; icon: typeof Swords }> = {
  fog: { label: "迷霧未開", detail: "尚未建立可用情報", icon: EyeOff },
  frontline: { label: "前線交戰", detail: "主線正在向前推進", icon: Swords },
  critical: { label: "高危失守", detail: "錯題已形成反攻壓力", icon: TriangleAlert },
  secured: { label: "據點固守", detail: "章節完成且沒有未清錯誤", icon: ShieldCheck },
};

type Props = {
  definition: MaterialDefinition;
  progress: MaterialProgress;
  onChapterSelect: (chapterKey: string) => void | Promise<void>;
};

export function LearningBattlefield({ definition, progress, onChapterSelect }: Props) {
  const battlefield = useMemo(() => deriveBattlefield(definition, progress), [definition, progress]);
  const activeFront = battlefield.zones.find((zone) => zone.chapterKey === battlefield.activeFrontKey);

  return (
    <section className={styles.battlefield} aria-label="學習戰場總覽">
      <div className={styles.commandStrip}>
        <div>
          <p className={styles.kicker}>Battlefield Intelligence</p>
          <h4>知識前線總覽</h4>
          <p>區域狀態由章節進度、測驗正確率與錯題壓力即時計算。</p>
        </div>
        <div className={styles.controlGauge}>
          <strong>{battlefield.control}%</strong>
          <span>全域控制率</span>
        </div>
      </div>

      <div className={styles.metrics}>
        <div><ShieldCheck size={17} /><span>已固守</span><strong>{battlefield.securedCount}</strong></div>
        <div><Swords size={17} /><span>交戰中</span><strong>{battlefield.frontlineCount}</strong></div>
        <div><TriangleAlert size={17} /><span>高危區</span><strong>{battlefield.criticalCount}</strong></div>
        <div><EyeOff size={17} /><span>迷霧區</span><strong>{battlefield.fogCount}</strong></div>
      </div>

      <div className={styles.map}>
        <svg aria-hidden="true" className={styles.frontline} preserveAspectRatio="none" viewBox="0 0 1000 520">
          <path d="M38 438 C165 380 190 184 326 224 C455 264 483 92 619 126 C748 158 806 310 962 66" />
          <path className={styles.frontlineGlow} d="M38 438 C165 380 190 184 326 224 C455 264 483 92 619 126 C748 158 806 310 962 66" />
        </svg>
        <div className={styles.zoneGrid}>
          {battlefield.zones.map((zone, index) => {
            const status = statusCopy[zone.status];
            const StatusIcon = status.icon;
            const isActive = zone.chapterKey === battlefield.activeFrontKey;
            return (
              <button
                className={`${styles.zone} ${isActive ? styles.activeZone : ""}`}
                data-status={zone.status}
                key={zone.chapterKey}
                onClick={() => onChapterSelect(zone.chapterKey)}
                style={{ "--zone-order": index } as React.CSSProperties}
                type="button"
              >
                <span className={styles.zoneHeader}>
                  <span className={styles.statusIcon}><StatusIcon size={16} /></span>
                  <span>{status.label}</span>
                  <b>{zone.progress}%</b>
                </span>
                <strong className={styles.zoneTitle}>{zone.title}</strong>
                <span className={styles.zoneSummary}>{zone.summary}</span>
                <span className={styles.zoneBars}>
                  <span><i>防線</i><em><b style={{ width: `${zone.defense}%` }} /></em><small>{zone.defense}</small></span>
                  <span><i>敵壓</i><em><b style={{ width: `${zone.enemyStrength}%` }} /></em><small>{zone.enemyStrength}</small></span>
                </span>
                <span className={styles.zoneFooter}>
                  <span>{zone.correctRate === null ? "尚無戰報" : `正確率 ${zone.correctRate}%`}</span>
                  <span><PackageOpen size={13} />補給 {zone.supplyCount}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.orderBar}>
        <span>當前命令</span>
        <strong>{activeFront ? `推進「${activeFront.title}」` : "全部據點已固守"}</strong>
        <p>{activeFront ? statusCopy[activeFront.status].detail : "可以進入綜合測驗或間隔複習。"}</p>
      </div>
    </section>
  );
}
