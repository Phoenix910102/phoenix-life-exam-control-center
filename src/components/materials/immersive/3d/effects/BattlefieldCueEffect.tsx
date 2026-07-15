"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import type { BattlefieldAnimationCue } from "../events/animationCues";
import type { BattlefieldTheme } from "../themes/battlefieldThemes";

type Props = {
  cue: BattlefieldAnimationCue;
  position: [number, number, number];
  reducedMotion: boolean;
  allowCinematics: boolean;
  theme: BattlefieldTheme;
  onComplete: () => void;
};

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

export function BattlefieldCueEffect({
  cue,
  position,
  reducedMotion,
  allowCinematics,
  theme,
  onComplete,
}: Props) {
  const elapsed = useRef(0);
  const completed = useRef(false);
  const pulseRef = useRef<Mesh>(null);
  const pulseMaterialRef = useRef<MeshBasicMaterial>(null);
  const projectileRef = useRef<Mesh>(null);
  const flagRef = useRef<Group>(null);
  const shieldRef = useRef<Mesh>(null);
  const achievementRef = useRef<Group>(null);
  const duration = reducedMotion ? 140 : cue.cinematic && !allowCinematics ? 520 : cue.durationMs;

  useFrame((_, delta) => {
    elapsed.current += delta * 1000;
    const rawProgress = Math.min(1, elapsed.current / duration);
    const progress = smoothStep(rawProgress);
    const pulse = Math.sin(Math.PI * rawProgress);

    if (pulseRef.current) pulseRef.current.scale.setScalar(0.65 + progress * (1.8 + cue.intensity));
    if (pulseMaterialRef.current) pulseMaterialRef.current.opacity = pulse * (reducedMotion ? 0.35 : 0.78);

    if (projectileRef.current) {
      const direction = cue.type === "enemy-reinforcement" ? -1 : 1;
      projectileRef.current.position.x = direction * (-1.45 + progress * 2.9);
      projectileRef.current.position.y = 0.72 + Math.sin(progress * Math.PI) * 0.48;
      projectileRef.current.scale.setScalar(0.75 + pulse * 0.55);
    }

    if (flagRef.current) flagRef.current.position.y = -0.85 + progress * 1.3;
    if (shieldRef.current) {
      shieldRef.current.scale.setScalar(0.35 + progress * 1.35);
      shieldRef.current.rotation.y += delta * 0.55;
    }

    if (achievementRef.current) {
      achievementRef.current.position.y = 0.8 + progress * 1.45;
      achievementRef.current.rotation.y += delta * 1.25;
      achievementRef.current.scale.setScalar(0.5 + pulse * 0.45);
    }

    if (rawProgress >= 1 && !completed.current) {
      completed.current = true;
      onComplete();
    }
  });

  const allied = cue.type === "allied-advance";
  const hostile = cue.type === "enemy-reinforcement";
  const supply = cue.type === "supply-replenished" || cue.type === "rest-mode";
  const pulseColor = hostile ? theme.enemy : supply ? theme.supply : theme.active;

  return (
    <group position={position}>
      <mesh ref={pulseRef} position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.68, 0.82, 40]} />
        <meshBasicMaterial color={pulseColor} depthWrite={false} ref={pulseMaterialRef} transparent />
      </mesh>

      {(allied || hostile) && (
        <mesh ref={projectileRef} position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.1 + cue.intensity * 0.035, 14, 14]} />
          <meshBasicMaterial color={hostile ? theme.enemy : theme.active} toneMapped={false} />
          <pointLight color={hostile ? theme.enemy : theme.active} distance={3.2} intensity={12} />
        </mesh>
      )}

      {cue.type === "secure-zone" && (
        <>
          <group ref={flagRef} position={[0, -0.85, 0]}>
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.025, 0.035, 1.3, 8]} />
              <meshStandardMaterial color={theme.active} metalness={0.7} roughness={0.25} />
            </mesh>
            <mesh position={[0.28, 1.06, 0]}>
              <boxGeometry args={[0.56, 0.32, 0.035]} />
              <meshStandardMaterial color={theme.allied} emissive={theme.allied} emissiveIntensity={0.48} />
            </mesh>
          </group>
          <mesh ref={shieldRef} position={[0, 0.55, 0]}>
            <sphereGeometry args={[1.05, 24, 12]} />
            <meshBasicMaterial color={theme.active} opacity={0.18} transparent wireframe />
          </mesh>
        </>
      )}

      {cue.type === "achievement" && (
        <group ref={achievementRef} position={[0, 0.8, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.055, 12, 40]} />
            <meshStandardMaterial color={theme.active} emissive={theme.active} emissiveIntensity={0.65} metalness={0.75} roughness={0.2} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <octahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color={theme.allied} emissive={theme.allied} emissiveIntensity={0.55} metalness={0.6} roughness={0.28} />
          </mesh>
        </group>
      )}

      {cue.type === "supply-replenished" && (
        <group position={[0, 0.42, 0]}>
          {[-0.32, 0, 0.32].map((x, index) => (
            <mesh key={x} position={[x, index === 1 ? 0.12 : 0, 0]}>
              <boxGeometry args={[0.24, 0.24, 0.24]} />
              <meshStandardMaterial color={theme.supply} emissive={theme.supply} emissiveIntensity={0.42} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
