"use client";

import { Box, Gauge, Map, ShieldCheck, SkipForward, Swords, TriangleAlert } from "lucide-react";
import type { BattlefieldAnimationCue } from "@/components/materials/immersive/3d/events/animationCues";
import type { BattlefieldVisualState, BattlefieldVisualZone } from "@/lib/battlefield/deriveBattlefieldVisuals";
import type { BattlefieldDisplayPreference } from "@/components/materials/immersive/3d/types";
import styles from "@/components/materials/immersive/3d/Battlefield3D.module.css";

const preferenceOptions: Array<{
  id: BattlefieldDisplayPreference;
  label: string;
  icon: typeof Box;
}> = [
  { id: "auto", label: "自動", icon: Gauge },
  { id: "high", label: "3D 高品質", icon: Box },
  { id: "low", label: "3D 省電", icon: Box },
  { id: "2d", label: "2D 戰術圖", icon: Map },
];

type Props = {
  battlefield: BattlefieldVisualState;
  focusedZone?: BattlefieldVisualZone;
  performanceReduced: boolean;
  preference: BattlefieldDisplayPreference;
  onPreferenceChange: (value: BattlefieldDisplayPreference) => void;
  activeCue?: BattlefieldAnimationCue;
  queuedCueCount: number;
  onSkipAnimation: () => void;
};

export function BattlefieldHUD({
  battlefield,
  focusedZone,
  performanceReduced,
  preference,
  onPreferenceChange,
  activeCue,
  queuedCueCount,
  onSkipAnimation,
}: Props) {
  return (
    <>
      <div className={styles.hudTop}>
        <div className={styles.metrics} aria-label="3D 戰場統計">
          <span><ShieldCheck size={15} />固守 <b>{battlefield.securedCount}</b></span>
          <span><Swords size={15} />交戰 <b>{battlefield.frontlineCount}</b></span>
          <span><TriangleAlert size={15} />高危 <b>{battlefield.criticalCount}</b></span>
        </div>
        <div className={styles.preference} aria-label="戰場顯示方式" role="group">
          {preferenceOptions.map(({ id, label, icon: Icon }) => (
            <button
              aria-pressed={preference === id}
              className={preference === id ? styles.preferenceActive : ""}
              key={id}
              onClick={() => onPreferenceChange(id)}
              title={label}
              type="button"
            >
              <Icon aria-hidden="true" size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlBadge}>
        <strong>{battlefield.control}%</strong>
        <span>全域控制率</span>
      </div>

      {activeCue && (
        <div className={styles.animationStatus} data-testid="battlefield-animation-status" role="status">
          <div>
            <span>戰場事件{queuedCueCount > 0 ? ` · 待命 ${queuedCueCount}` : ""}</span>
            <strong>{activeCue.announcement}</strong>
          </div>
          <button onClick={onSkipAnimation} title="跳過目前動畫" type="button">
            <SkipForward aria-hidden="true" size={16} />
            <span className="sr-only">跳過目前動畫</span>
          </button>
        </div>
      )}

      {focusedZone && (
        <div className={styles.zoneIntel} aria-live="polite">
          <span>{focusedZone.status === "secured" ? "據點固守" : focusedZone.status === "critical" ? "高危失守" : focusedZone.status === "fog" ? "迷霧未開" : "前線交戰"}</span>
          <strong>{focusedZone.title}</strong>
          <p>{focusedZone.summary}</p>
          <dl>
            <div><dt>進度</dt><dd>{focusedZone.progress}%</dd></div>
            <div><dt>防線</dt><dd>{focusedZone.defense}</dd></div>
            <div><dt>敵壓</dt><dd>{focusedZone.enemyStrength}</dd></div>
          </dl>
        </div>
      )}

      {performanceReduced && <p className={styles.performanceNotice}>已自動降低 3D 畫質以維持操作流暢。</p>}
    </>
  );
}
