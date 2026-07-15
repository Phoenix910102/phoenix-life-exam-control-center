"use client";

import { useEffect, useMemo, useRef, type ElementRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { BattlefieldVisualState } from "@/lib/battlefield/deriveBattlefieldVisuals";

type Props = {
  battlefield: BattlefieldVisualState;
  activeZoneKey?: string;
  preset: "war-room" | "isometric" | "cinematic-low" | "top-down";
};

const overviewPositions = {
  "war-room": new Vector3(0, 13.5, 13.5),
  isometric: new Vector3(11.5, 13, 11.5),
  "cinematic-low": new Vector3(0, 7.5, 15),
  "top-down": new Vector3(0, 20, 0.1),
};

export function CameraRig({ battlefield, activeZoneKey, preset }: Props) {
  const camera = useThree((state) => state.camera);
  const canvasSize = useThree((state) => state.size);
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const transitioning = useRef(true);
  const activeZone = battlefield.zones.find((zone) => zone.chapterKey === activeZoneKey);
  const target = useMemo(
    () => new Vector3(activeZone?.worldPosition[0] ?? 0, 0, activeZone?.worldPosition[2] ?? 0),
    [activeZone?.worldPosition],
  );
  const desiredPosition = useMemo(() => {
    const base = overviewPositions[preset].clone();
    if (!activeZone) return base;
    const focusScale = preset === "top-down" ? 0.72 : 0.66;
    const aspect = canvasSize.width / Math.max(1, canvasSize.height);
    const narrowScreenDistance = aspect < 0.8 ? 1.42 : aspect < 1.15 ? 1.18 : 1;
    return base.multiplyScalar(focusScale * narrowScreenDistance).add(target);
  }, [activeZone, canvasSize.height, canvasSize.width, preset, target]);

  useEffect(() => {
    transitioning.current = true;
  }, [desiredPosition, target]);

  useFrame((_, delta) => {
    if (!transitioning.current) return;
    const alpha = 1 - Math.exp(-delta * 4.2);
    camera.position.lerp(desiredPosition, alpha);
    controlsRef.current?.target.lerp(target, alpha);
    controlsRef.current?.update();
    if (camera.position.distanceTo(desiredPosition) < 0.025) transitioning.current = false;
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      enablePan={false}
      maxDistance={24}
      maxPolarAngle={Math.PI * 0.46}
      minDistance={7}
      minPolarAngle={Math.PI * 0.16}
      onStart={() => { transitioning.current = false; }}
      target={target}
    />
  );
}
