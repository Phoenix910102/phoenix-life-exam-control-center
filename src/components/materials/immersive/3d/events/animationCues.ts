export type BattlefieldAnimationCueType =
  | "focus-zone"
  | "allied-advance"
  | "enemy-reinforcement"
  | "secure-zone"
  | "achievement"
  | "supply-replenished"
  | "rest-mode";

export type BattlefieldAnimationCue = {
  id: string;
  type: BattlefieldAnimationCueType;
  zoneKey?: string;
  priority: number;
  durationMs: number;
  intensity: number;
  cinematic: boolean;
  announcement: string;
};
