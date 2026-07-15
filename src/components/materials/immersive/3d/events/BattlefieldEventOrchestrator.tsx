"use client";

import { useEffect } from "react";
import type { BattlefieldVisualState } from "@/lib/battlefield/deriveBattlefieldVisuals";
import { BattlefieldCueEffect } from "../effects/BattlefieldCueEffect";
import { useBattlefield3DStore } from "../store/useBattlefield3DStore";
import type { BattlefieldTheme } from "../themes/battlefieldThemes";

type Props = {
  battlefield: BattlefieldVisualState;
  activeZoneKey?: string;
  reducedMotion: boolean;
  allowCinematics: boolean;
  theme: BattlefieldTheme;
};

export function BattlefieldEventOrchestrator({
  battlefield,
  activeZoneKey,
  reducedMotion,
  allowCinematics,
  theme,
}: Props) {
  const activeCue = useBattlefield3DStore((state) => state.activeCue);
  const queueLength = useBattlefield3DStore((state) => state.queue.length);
  const beginNext = useBattlefield3DStore((state) => state.beginNext);
  const completeActive = useBattlefield3DStore((state) => state.completeActive);

  useEffect(() => {
    if (!activeCue && queueLength > 0) beginNext();
  }, [activeCue, beginNext, queueLength]);

  if (!activeCue) return null;
  const zoneKey = activeCue.zoneKey ?? activeZoneKey ?? battlefield.activeFrontKey;
  const zone = battlefield.zones.find((item) => item.chapterKey === zoneKey) ?? battlefield.zones[0];
  const position: [number, number, number] = zone?.worldPosition ?? [0, 0, 0];

  return (
    <BattlefieldCueEffect
      allowCinematics={allowCinematics}
      cue={activeCue}
      key={activeCue.id}
      onComplete={() => completeActive(activeCue.id)}
      position={position}
      reducedMotion={reducedMotion}
      theme={theme}
    />
  );
}
