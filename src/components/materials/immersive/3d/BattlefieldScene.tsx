"use client";

import type { BattlefieldVisualState } from "@/lib/battlefield/deriveBattlefieldVisuals";
import { CameraRig } from "@/components/materials/immersive/3d/camera/CameraRig";
import { BattlefieldTerrain } from "@/components/materials/immersive/3d/terrain/BattlefieldTerrain";
import { BattlefieldEventOrchestrator } from "@/components/materials/immersive/3d/events/BattlefieldEventOrchestrator";
import type { BattlefieldTheme } from "@/components/materials/immersive/3d/themes/battlefieldThemes";
import type { BattlefieldRuntimeQuality } from "@/components/materials/immersive/3d/types";

type Props = {
  battlefield: BattlefieldVisualState;
  activeZoneKey?: string;
  allowCinematics: boolean;
  cameraPreset: "war-room" | "isometric" | "cinematic-low" | "top-down";
  quality: BattlefieldRuntimeQuality;
  reducedMotion: boolean;
  theme: BattlefieldTheme;
  onSelect: (chapterKey: string) => void;
  onHover: (chapterKey?: string) => void;
};

export function BattlefieldScene({
  battlefield,
  activeZoneKey,
  allowCinematics,
  cameraPreset,
  quality,
  reducedMotion,
  theme,
  onSelect,
  onHover,
}: Props) {
  return (
    <>
      <ambientLight color={theme.neutral} intensity={quality === "low" ? 0.8 : 0.62} />
      <directionalLight
        castShadow={quality !== "low"}
        color={theme.active}
        intensity={2.1}
        position={[7, 12, 5]}
        shadow-mapSize-height={quality === "high" ? 2048 : 1024}
        shadow-mapSize-width={quality === "high" ? 2048 : 1024}
      />
      <pointLight color={theme.enemy} intensity={quality === "high" ? 22 : 11} position={[-6, 3.5, -4]} distance={13} />
      <BattlefieldTerrain
        activeZoneKey={activeZoneKey}
        battlefield={battlefield}
        onHover={onHover}
        onSelect={onSelect}
        quality={quality}
        theme={theme}
      />
      <BattlefieldEventOrchestrator
        activeZoneKey={activeZoneKey}
        allowCinematics={allowCinematics}
        battlefield={battlefield}
        reducedMotion={reducedMotion}
        theme={theme}
      />
      <CameraRig activeZoneKey={activeZoneKey} battlefield={battlefield} preset={cameraPreset} />
    </>
  );
}
