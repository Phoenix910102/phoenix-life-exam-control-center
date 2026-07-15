"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Color, InstancedMesh, Object3D } from "three";
import type { BattlefieldVisualZone } from "@/lib/battlefield/deriveBattlefieldVisuals";
import type { BattlefieldTheme } from "@/components/materials/immersive/3d/themes/battlefieldThemes";
import type { BattlefieldRuntimeQuality } from "@/components/materials/immersive/3d/types";

function deterministicOffset(seed: string, index: number, axis: number) {
  let value = 0;
  const text = `${seed}:${index}:${axis}`;
  for (let cursor = 0; cursor < text.length; cursor += 1) value = (value * 31 + text.charCodeAt(cursor)) >>> 0;
  return (value % 1000) / 1000;
}

function InstancedUnits({
  count,
  color,
  side,
  seed,
  heavy = false,
}: {
  count: number;
  color: string;
  side: "allied" | "enemy";
  seed: string;
  heavy?: boolean;
}) {
  const meshRef = useRef<InstancedMesh>(null);
  const helper = useMemo(() => new Object3D(), []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    for (let index = 0; index < count; index += 1) {
      const lane = side === "allied" ? -0.62 : 0.62;
      const x = lane + (deterministicOffset(seed, index, 0) - 0.5) * 0.76;
      const z = (deterministicOffset(seed, index, 1) - 0.5) * 1.55;
      const scale = (heavy ? 0.15 : 0.08) + deterministicOffset(seed, index, 2) * 0.035;
      helper.position.set(x, heavy ? 0.34 : 0.27, z);
      helper.rotation.set(0, deterministicOffset(seed, index, 3) * Math.PI * 2, 0);
      helper.scale.setScalar(scale);
      helper.updateMatrix();
      meshRef.current.setMatrixAt(index, helper.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, heavy, helper, seed, side]);

  if (count === 0) return null;
  return (
    <instancedMesh castShadow ref={meshRef} args={[undefined, undefined, count]}>
      {heavy ? <boxGeometry args={[1, 0.62, 1.45]} /> : <coneGeometry args={[0.42, 1.25, 5]} />}
      <meshStandardMaterial color={color} emissive={new Color(color)} emissiveIntensity={heavy ? 0.35 : 0.18} roughness={0.62} />
    </instancedMesh>
  );
}

type Props = {
  zone: BattlefieldVisualZone;
  theme: BattlefieldTheme;
  active: boolean;
  quality: BattlefieldRuntimeQuality;
  onSelect: (chapterKey: string) => void;
  onHover: (chapterKey?: string) => void;
};

export function ZoneTerrain({ zone, theme, active, quality, onSelect, onHover }: Props) {
  const unitScale = quality === "low" ? 0.4 : quality === "medium" ? 0.7 : 1;
  const alliedCount = Math.round(zone.alliedUnits * unitScale);
  const enemyCount = Math.round(zone.enemyUnits * unitScale);
  const heavyCount = quality === "low" ? Math.min(1, zone.heavyEnemyUnits) : zone.heavyEnemyUnits;
  const fogged = zone.status === "fog";

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(zone.chapterKey);
  };

  return (
    <group position={zone.worldPosition} rotation={zone.worldRotation} scale={zone.worldScale}>
      <mesh
        castShadow
        receiveShadow
        onClick={select}
        onPointerOut={() => onHover(undefined)}
        onPointerOver={(event) => { event.stopPropagation(); onHover(zone.chapterKey); }}
      >
        <cylinderGeometry args={[1.75, 1.88, 0.28, 8]} />
        <meshStandardMaterial
          color={theme.zone[zone.status]}
          emissive={active ? theme.active : theme.zone[zone.status]}
          emissiveIntensity={active ? 0.38 : zone.alertLevel * 0.22}
          metalness={zone.biome === "cipher-metal" ? 0.48 : 0.18}
          opacity={fogged ? 0.48 : 1}
          roughness={0.72}
          transparent={fogged}
        />
      </mesh>

      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.52, 1.67, 8]} />
        <meshBasicMaterial color={active ? theme.active : theme.neutral} opacity={active ? 0.95 : 0.28} transparent />
      </mesh>

      {zone.baseLevel > 0 && (
        <group position={[0, 0.27, 0]}>
          <mesh castShadow position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.34 + zone.baseLevel * 0.05, 0.45, 0.42 + zone.baseLevel * 0.1, 6]} />
            <meshStandardMaterial color={theme.allied} metalness={0.56} roughness={0.42} />
          </mesh>
          <mesh castShadow position={[0, 0.58 + zone.baseLevel * 0.06, 0]}>
            <coneGeometry args={[0.3, 0.42, 6]} />
            <meshStandardMaterial color={theme.active} emissive={theme.allied} emissiveIntensity={0.22 + zone.securedIntensity * 0.35} />
          </mesh>
        </group>
      )}

      {Array.from({ length: zone.defenseTowerCount }, (_, index) => {
        const angle = (index / Math.max(1, zone.defenseTowerCount)) * Math.PI * 2 + 0.55;
        return (
          <mesh castShadow key={`tower-${index}`} position={[Math.cos(angle) * 1.12, 0.43, Math.sin(angle) * 1.12]}>
            <cylinderGeometry args={[0.1, 0.14, 0.62, 5]} />
            <meshStandardMaterial color={theme.allied} emissive={theme.allied} emissiveIntensity={0.16} />
          </mesh>
        );
      })}

      {Array.from({ length: zone.supplyOutpostCount }, (_, index) => (
        <mesh castShadow key={`supply-${index}`} position={[-1.22 + index * 0.34, 0.31, 1.05]}>
          <boxGeometry args={[0.24, 0.32, 0.24]} />
          <meshStandardMaterial color={theme.supply} emissive={theme.supply} emissiveIntensity={0.3} />
        </mesh>
      ))}

      <InstancedUnits count={alliedCount} color={theme.allied} seed={`${zone.chapterKey}:allied`} side="allied" />
      <InstancedUnits count={enemyCount} color={theme.enemy} seed={`${zone.chapterKey}:enemy`} side="enemy" />
      <InstancedUnits count={heavyCount} color={theme.enemy} heavy seed={`${zone.chapterKey}:heavy`} side="enemy" />
    </group>
  );
}
