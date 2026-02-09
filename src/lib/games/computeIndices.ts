import type { GameSession } from "@/types/game";

export type GameIndices = {
  agitationIndex: number;
  fatigueIndex: number;
  focusIndex: number;
};

export function computeIndices(sessions: GameSession[]): GameIndices {
  let missed = 0;
  let deviation = 0;
  let interruptions = 0;
  let successCount = 0;
  let total = 0;
  let rapidRestarts = 0;

  for (const s of sessions) {
    total += 1;
    if (typeof s.metrics.missed === "number") missed += s.metrics.missed;
    if (typeof s.metrics.avgDeviationMs === "number") deviation += s.metrics.avgDeviationMs;
    if (typeof s.metrics.interruptions === "number") interruptions += s.metrics.interruptions;
    if (s.metrics.success === true) successCount += 1;
    if (s.quit) interruptions += 1;
    if (s.durationSec < 20) rapidRestarts += 1;
  }

  const avgDeviation = total > 0 ? deviation / total : 0;
  const agitationIndex = Math.min(
    100,
    Math.round(missed * 8 + avgDeviation / 20 + interruptions * 12 + rapidRestarts * 9),
  );
  const fatigueIndex = Math.min(100, Math.round(interruptions * 18 + avgDeviation / 30));
  const focusBase = successCount * 25 + Math.max(0, 50 - avgDeviation / 10) - interruptions * 8;
  const focusIndex = Math.max(0, Math.min(100, Math.round(focusBase)));

  return { agitationIndex, fatigueIndex, focusIndex };
}
