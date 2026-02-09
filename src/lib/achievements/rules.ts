import { db } from "@/lib/db/client";
import { newId } from "@/lib/utils/id";

const ACH = {
  FIRST_TASK: "first_task_done",
  FIRST_EXAM: "first_exam_attempt",
  FIRST_GAME: "first_game_session",
};

export async function runAchievementChecks() {
  const achievements = await db.achievements.toArray();
  const has = (id: string) => achievements.some((a) => a.id === id);

  const tasksDone = await db.tasks.filter((t) => t.done).count();
  if (tasksDone > 0 && !has(ACH.FIRST_TASK)) {
    await db.achievements.put({ id: ACH.FIRST_TASK, unlockedAt: new Date().toISOString() });
  }

  const examCount = await db.examAttempts.count();
  if (examCount > 0 && !has(ACH.FIRST_EXAM)) {
    await db.achievements.put({ id: ACH.FIRST_EXAM, unlockedAt: new Date().toISOString() });
  }

  const gameCount = await db.gameSessions.count();
  if (gameCount > 0 && !has(ACH.FIRST_GAME)) {
    await db.achievements.put({ id: ACH.FIRST_GAME, unlockedAt: new Date().toISOString() });
  }

  // Keep one dynamic unlock for the MVP list density.
  if (achievements.length === 0 && tasksDone === 0 && examCount === 0 && gameCount === 0) {
    await db.achievements.put({ id: newId("welcome"), unlockedAt: new Date().toISOString() });
  }
}
