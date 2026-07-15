"use client";

import { Line } from "@react-three/drei";
import type { BattlefieldVisualState } from "@/lib/battlefield/deriveBattlefieldVisuals";
import { ZoneTerrain } from "@/components/materials/immersive/3d/terrain/ZoneTerrain";
import type { BattlefieldTheme } from "@/components/materials/immersive/3d/themes/battlefieldThemes";
import type { BattlefieldRuntimeQuality } from "@/components/materials/immersive/3d/types";

type Props = {
  battlefield: BattlefieldVisualState;
  activeZoneKey?: string;
  quality: BattlefieldRuntimeQuality;
  theme: BattlefieldTheme;
  onSelect: (chapterKey: string) => void;
  onHover: (chapterKey?: string) => void;
};

export function BattlefieldTerrain({ battlefield, activeZoneKey, quality, theme, onSelect, onHover }: Props) {
  const frontlinePoints = battlefield.zones.map((zone) => [
    zone.worldPosition[0],
    0.22,
    zone.worldPosition[2],
  ] as [number, number, number]);

  return (
    <group>
      <mesh receiveShadow position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[battlefield.mapBounds.width + 6, battlefield.mapBounds.depth + 6]} />
        <meshStandardMaterial color={theme.terrain} metalness={0.08} roughness={0.94} />
      </mesh>
      <gridHelper
        args={[Math.max(battlefield.mapBounds.width, battlefield.mapBounds.depth) + 6, 28, theme.grid, theme.grid]}
        position={[0, -0.16, 0]}
      />
      {frontlinePoints.length > 1 && (
        <Line color={theme.enemy} dashed dashScale={2.2} lineWidth={1.2} opacity={0.55} points={frontlinePoints} transparent />
      )}
      {battlefield.zones.map((zone) => (
        <ZoneTerrain
          active={zone.chapterKey === activeZoneKey}
          key={zone.chapterKey}
          onHover={onHover}
          onSelect={onSelect}
          quality={quality}
          theme={theme}
          zone={zone}
        />
      ))}
    </group>
  );
}
