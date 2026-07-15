"use client";

import { useState } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { BattlefieldVisualState } from "@/lib/battlefield/deriveBattlefieldVisuals";
import { BattlefieldScene } from "@/components/materials/immersive/3d/BattlefieldScene";
import { getBattlefieldTheme } from "@/components/materials/immersive/3d/themes/battlefieldThemes";
import type { BattlefieldRuntimeQuality } from "@/components/materials/immersive/3d/types";
import type { MaterialDefinition } from "@/types/materialRecord";

type Props = {
  battlefield: BattlefieldVisualState;
  activeZoneKey?: string;
  allowCinematics: boolean;
  cameraPreset: "war-room" | "isometric" | "cinematic-low" | "top-down";
  quality: BattlefieldRuntimeQuality;
  reducedMotion: boolean;
  themeName?: NonNullable<MaterialDefinition["presentation"]>["theme"];
  onSelect: (chapterKey: string) => void;
  onHover: (chapterKey?: string) => void;
  onPerformanceDecline: () => void;
};

const qualityDpr: Record<BattlefieldRuntimeQuality, [number, number]> = {
  low: [1, 1],
  medium: [1, 1.35],
  high: [1, 1.75],
};

export function BattlefieldCanvas({
  battlefield,
  activeZoneKey,
  allowCinematics,
  cameraPreset,
  quality,
  reducedMotion,
  themeName,
  onSelect,
  onHover,
  onPerformanceDecline,
}: Props) {
  const [runtimeQuality, setRuntimeQuality] = useState(quality);
  const theme = getBattlefieldTheme(themeName);

  return (
    <Canvas
      camera={{ fov: 42, near: 0.1, far: 90, position: [0, 13.5, 13.5] }}
      dpr={qualityDpr[runtimeQuality]}
      frameloop="always"
      gl={{ antialias: runtimeQuality !== "low", powerPreference: "high-performance" }}
      shadows={runtimeQuality === "low" ? false : "basic"}
    >
      <color args={[theme.background]} attach="background" />
      <fog args={[theme.fog, 17, 38]} attach="fog" />
      <PerformanceMonitor
        flipflops={2}
        onDecline={() => {
          if (runtimeQuality !== "low") setRuntimeQuality("low");
          onPerformanceDecline();
        }}
      />
      <BattlefieldScene
        activeZoneKey={activeZoneKey}
        allowCinematics={allowCinematics}
        battlefield={battlefield}
        cameraPreset={cameraPreset}
        onHover={onHover}
        onSelect={onSelect}
        quality={runtimeQuality}
        reducedMotion={reducedMotion}
        theme={theme}
      />
    </Canvas>
  );
}
