import { achievementDefinitions } from "@/lib/achievements/definitions";
import { db } from "@/lib/db/client";
import { recordDomainEvent } from "@/lib/events/domainEvents";
import type { NewDomainEvent } from "@/types/domainEvent";

function longestCorrectStreak(values: boolean[]) {
  let longest = 0;
  let current = 0;
  for (const value of values) {
    current = value ? current + 1 : 0;
    longest = Math.max(longest, current);
  }
  return longest;
}

async function collectMetrics(): Promise<Record<string, number>> {
  const [materials, care, tasksDone, examCount, gameCount] = await Promise.all([
    db.materialProgress.toArray(),
    db.careState.get("singleton"),
    db.tasks.filter((task) => task.done).count(),
    db.examAttempts.count(),
    db.gameSessions.count(),
  ]);
  const attempts = materials
    .flatMap((material) => material.quizAttempts)
    .sort((a, b) => a.attemptedAt.localeCompare(b.attemptedAt));
  const recoveredChapters = new Set<string>();
  const chapterHasWrong = new Set<string>();
  for (const attempt of attempts) {
    if (!attempt.correct) chapterHasWrong.add(attempt.chapterKey);
    else if (chapterHasWrong.has(attempt.chapterKey)) recoveredChapters.add(attempt.chapterKey);
  }

  return {
    first_material_step: materials.some((item) => item.overallProgress > 0) ? 1 : 0,
    chapter_conqueror: materials.reduce((sum, item) => sum + item.completedChapterKeys.length, 0),
    frontline_commander: materials.reduce((sum, item) => sum + item.completedChapterKeys.length, 0),
    steady_defense: Math.max(0, ...materials.map((item) => item.overallProgress)),
    zero_waver: longestCorrectStreak(attempts.map((attempt) => attempt.correct)),
    rose_recovery: recoveredChapters.size,
    material_mastered: Math.max(0, ...materials.map((item) => item.overallProgress)),
    supply_discipline: care && care.hydration.countToday >= 2 && care.meal.countToday >= 1 ? 1 : 0,
    first_task_done: tasksDone,
    first_exam_attempt: examCount,
    first_game_session: gameCount,
  };
}

export async function evaluateAchievementRules() {
  const metrics = await collectMetrics();
  const unlocked = await db.achievements.toArray();
  const unlockedIds = new Set(unlocked.map((item) => item.id));
  const now = new Date().toISOString();
  const newlyUnlocked: string[] = [];

  await db.transaction("rw", db.achievements, db.achievementProgress, db.domainEvents, async () => {
    for (const definition of achievementDefinitions) {
      const current = Math.max(0, metrics[definition.id] ?? 0);
      await db.achievementProgress.put({
        achievementId: definition.id,
        current,
        target: definition.target,
        updatedAt: now,
      });
      if (current < definition.target || unlockedIds.has(definition.id)) continue;

      await db.achievements.put({ id: definition.id, unlockedAt: now });
      unlockedIds.add(definition.id);
      newlyUnlocked.push(definition.id);
      await recordDomainEvent({
        type: "achievement.unlocked",
        payload: { achievementId: definition.id, title: definition.title },
        occurredAt: now,
      });
    }
  });

  return newlyUnlocked;
}

export async function processDomainEvent(event: NewDomainEvent) {
  await recordDomainEvent(event);
  return evaluateAchievementRules();
}

export async function runAchievementChecks() {
  return evaluateAchievementRules();
}

export async function getAchievementDashboard() {
  await evaluateAchievementRules();
  const [unlocked, progress] = await Promise.all([
    db.achievements.toArray(),
    db.achievementProgress.toArray(),
  ]);
  const unlockedById = new Map(unlocked.map((item) => [item.id, item]));
  const progressById = new Map(progress.map((item) => [item.achievementId, item]));
  return achievementDefinitions.map((definition) => ({
    definition,
    unlocked: unlockedById.get(definition.id),
    progress: progressById.get(definition.id) ?? {
      achievementId: definition.id,
      current: 0,
      target: definition.target,
      updatedAt: new Date().toISOString(),
    },
  }));
}
