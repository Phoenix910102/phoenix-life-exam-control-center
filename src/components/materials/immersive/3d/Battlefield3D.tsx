"use client";

import dynamic from "next/dynamic";
import { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useState } from "react";
import { LearningBattlefield } from "@/components/materials/immersive/LearningBattlefield";
import { BattlefieldHUD } from "@/components/materials/immersive/3d/hud/BattlefieldHUD";
import { eventReceiptsToCues } from "@/components/materials/immersive/3d/events/eventToCue";
import { useBattlefield3DStore } from "@/components/materials/immersive/3d/store/useBattlefield3DStore";
import type {
  BattlefieldDisplayPreference,
  BattlefieldRuntimeQuality,
} from "@/components/materials/immersive/3d/types";
import { deriveBattlefieldVisuals } from "@/lib/battlefield/deriveBattlefieldVisuals";
import type { MaterialDefinition, MaterialProgress } from "@/types/materialRecord";
import type { DomainEventReceipt } from "@/types/domainEvent";
import styles from "@/components/materials/immersive/3d/Battlefield3D.module.css";

const BattlefieldCanvas = dynamic(
  () => import("@/components/materials/immersive/3d/BattlefieldCanvas").then((module) => module.BattlefieldCanvas),
  {
    ssr: false,
    loading: () => <div className={styles.loader}>正在建立戰場地形...</div>,
  },
);

type Props = {
  definition: MaterialDefinition;
  progress: MaterialProgress;
  onChapterSelect: (chapterKey: string) => void | Promise<void>;
  eventReceipts?: DomainEventReceipt[];
  onEventReceiptsConsumed?: (eventIds: string[]) => void;
};

type Capability = {
  webgl2: boolean;
  reducedMotion: boolean;
  saveData: boolean;
};

type BoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  resetKey: string;
};

type BoundaryState = { failed: boolean };

class BattlefieldErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D battlefield failed; using the 2D tactical map.", error, info);
  }

  componentDidUpdate(previous: BoundaryProps) {
    if (previous.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function detectCapability(): Capability {
  const canvas = document.createElement("canvas");
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return {
    webgl2: Boolean(canvas.getContext("webgl2")),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: connection?.saveData === true,
  };
}

function initialPreference(definition: MaterialDefinition): BattlefieldDisplayPreference {
  const configured = definition.presentation?.battlefield3d?.quality;
  if (configured === "high" || configured === "low") return configured;
  return "auto";
}

function runtimeQuality(preference: BattlefieldDisplayPreference): BattlefieldRuntimeQuality {
  if (preference === "high") return "high";
  if (preference === "low") return "low";
  return "medium";
}

export function Battlefield3D({
  definition,
  progress,
  onChapterSelect,
  eventReceipts = [],
  onEventReceiptsConsumed,
}: Props) {
  const config = definition.presentation?.battlefield3d;
  const battlefield = useMemo(() => deriveBattlefieldVisuals(definition, progress), [definition, progress]);
  const [preference, setPreference] = useState<BattlefieldDisplayPreference>(() => initialPreference(definition));
  const [capability, setCapability] = useState<Capability>();
  const [hoveredKey, setHoveredKey] = useState<string>();
  const [performanceReduced, setPerformanceReduced] = useState(false);
  const activeCue = useBattlefield3DStore((state) => state.activeCue);
  const queuedCueCount = useBattlefield3DStore((state) => state.queue.length);
  const enqueue = useBattlefield3DStore((state) => state.enqueue);
  const completeActive = useBattlefield3DStore((state) => state.completeActive);
  const clearQueue = useBattlefield3DStore((state) => state.clear);
  const focusedKey = activeCue?.zoneKey ?? hoveredKey ?? progress.activeChapterKey ?? battlefield.activeFrontKey;
  const focusedZone = battlefield.zones.find((zone) => zone.chapterKey === focusedKey);

  useEffect(() => {
    setCapability(detectCapability());
  }, []);

  useEffect(() => {
    clearQueue();
  }, [clearQueue, definition.slug]);

  useEffect(() => {
    if (eventReceipts.length === 0) return;
    enqueue(eventReceiptsToCues(eventReceipts));
    onEventReceiptsConsumed?.(eventReceipts.map((receipt) => receipt.event.id));
  }, [enqueue, eventReceipts, onEventReceiptsConsumed]);

  const forcedFallback = capability?.webgl2 === false;
  const automaticFallback = preference === "auto" && Boolean(capability?.reducedMotion || capability?.saveData);
  const show3D = capability?.webgl2 === true && preference !== "2d" && !automaticFallback;

  useEffect(() => {
    if (capability && !show3D) clearQueue();
  }, [capability, clearQueue, show3D]);

  if (!config?.enabled) {
    return <LearningBattlefield definition={definition} progress={progress} onChapterSelect={onChapterSelect} />;
  }

  const fallbackReason = forcedFallback
    ? "這台裝置目前無法啟動 WebGL2，已切換為 2D 戰術圖。"
    : automaticFallback
      ? "已依低動態或省流量設定切換為 2D 戰術圖。"
      : preference === "2d"
        ? "目前使用 2D 戰術圖。"
        : undefined;

  const fallback = (
    <div className={styles.fallbackSurface}>
      {fallbackReason && <p className={styles.fallbackReason}>{fallbackReason}</p>}
      <LearningBattlefield definition={definition} progress={progress} onChapterSelect={onChapterSelect} />
    </div>
  );

  return (
    <section className={styles.shell} data-testid="battlefield-3d" data-view={show3D ? "3d" : "2d"}>
      <BattlefieldHUD
        battlefield={battlefield}
        focusedZone={focusedZone}
        onPreferenceChange={(value) => {
          setPreference(value);
          setPerformanceReduced(false);
        }}
        performanceReduced={performanceReduced}
        preference={preference}
        activeCue={activeCue}
        queuedCueCount={queuedCueCount}
        onSkipAnimation={() => activeCue && completeActive(activeCue.id)}
      />

      <div className={styles.viewport}>
        {!capability ? (
          <div className={styles.loader}>正在檢查 3D 顯示能力...</div>
        ) : show3D ? (
          <BattlefieldErrorBoundary fallback={fallback} resetKey={`${preference}:${definition.slug}:${definition.version}`}>
            <BattlefieldCanvas
              activeZoneKey={focusedKey}
              allowCinematics={config.allowCinematics}
              battlefield={battlefield}
              cameraPreset={config.cameraPreset}
              onHover={setHoveredKey}
              onPerformanceDecline={() => setPerformanceReduced(true)}
              onSelect={(chapterKey) => {
                setHoveredKey(chapterKey);
                void onChapterSelect(chapterKey);
              }}
              quality={runtimeQuality(preference)}
              reducedMotion={capability.reducedMotion}
              themeName={definition.presentation?.theme}
            />
          </BattlefieldErrorBoundary>
        ) : fallback}
      </div>

      <nav aria-label="3D 學習戰場章節" className={styles.zoneNavigation}>
        {battlefield.zones.map((zone, index) => (
          <button
            aria-current={zone.chapterKey === focusedKey ? "location" : undefined}
            className={zone.chapterKey === focusedKey ? styles.zoneNavigationActive : ""}
            key={zone.chapterKey}
            onClick={() => {
              setHoveredKey(zone.chapterKey);
              void onChapterSelect(zone.chapterKey);
            }}
            onFocus={() => setHoveredKey(zone.chapterKey)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{zone.title}</strong>
            <small>{zone.progress}%</small>
          </button>
        ))}
      </nav>
    </section>
  );
}
