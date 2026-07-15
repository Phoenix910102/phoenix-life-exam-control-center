import type { MaterialDefinition, MaterialProgress } from "@/types/materialRecord";
import { latestAttemptsByQuestion } from "@/lib/battlefield/battlefieldRecovery";

export type BattlefieldZoneStatus = "fog" | "frontline" | "critical" | "secured";

export type BattlefieldZone = {
  chapterKey: string;
  title: string;
  summary: string;
  progress: number;
  status: BattlefieldZoneStatus;
  defense: number;
  enemyStrength: number;
  correctRate: number | null;
  attemptCount: number;
  wrongCount: number;
  supplyCount: number;
};

export type BattlefieldState = {
  control: number;
  securedCount: number;
  frontlineCount: number;
  criticalCount: number;
  fogCount: number;
  activeFrontKey?: string;
  zones: BattlefieldZone[];
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function deriveBattlefield(
  definition: MaterialDefinition,
  progress: MaterialProgress,
): BattlefieldState {
  const zones = definition.chapters.map((chapter) => {
    const chapterProgress = progress.chapterProgress[chapter.key] ?? 0;
    const attempts = progress.quizAttempts.filter((attempt) => attempt.chapterKey === chapter.key);
    const latestAttempts = latestAttemptsByQuestion(attempts);
    const wrongCount = latestAttempts.filter((attempt) => !attempt.correct).length;
    const correctCount = latestAttempts.length - wrongCount;
    const correctRate = latestAttempts.length > 0
      ? Math.round((correctCount / latestAttempts.length) * 100)
      : null;
    const supplyCount = chapter.blocks.filter(
      (block) => block.type === "memory" || block.type === "example" || block.type === "comparison",
    ).length;
    const defense = clamp(chapterProgress * 0.72 + (correctRate ?? chapterProgress) * 0.28);
    const enemyStrength = clamp((100 - chapterProgress) * 0.55 + wrongCount * 18);

    let status: BattlefieldZoneStatus = "frontline";
    if (chapterProgress === 0 && attempts.length === 0) status = "fog";
    else if (wrongCount >= 2 || (latestAttempts.length >= 2 && (correctRate ?? 100) < 50)) status = "critical";
    else if (chapterProgress >= 100 && wrongCount === 0) status = "secured";

    return {
      chapterKey: chapter.key,
      title: chapter.title,
      summary: chapter.summary,
      progress: chapterProgress,
      status,
      defense,
      enemyStrength,
      correctRate,
      attemptCount: attempts.length,
      wrongCount,
      supplyCount,
    };
  });

  const activeZone = zones.find((zone) => zone.chapterKey === progress.activeChapterKey);
  const nextFront = activeZone?.status !== "secured"
    ? activeZone
    : zones.find((zone) => zone.status === "critical") ?? zones.find((zone) => zone.status === "frontline") ?? zones.find((zone) => zone.status === "fog");

  return {
    control: progress.overallProgress,
    securedCount: zones.filter((zone) => zone.status === "secured").length,
    frontlineCount: zones.filter((zone) => zone.status === "frontline").length,
    criticalCount: zones.filter((zone) => zone.status === "critical").length,
    fogCount: zones.filter((zone) => zone.status === "fog").length,
    activeFrontKey: nextFront?.chapterKey,
    zones,
  };
}
