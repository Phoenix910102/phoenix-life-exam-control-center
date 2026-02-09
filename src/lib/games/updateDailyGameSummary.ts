import { listGameSessions, upsertDailyLog } from "@/lib/db/repository";
import { computeIndices } from "./computeIndices";

export async function refreshTodayGameSummary(today: string) {
  const sessions = await listGameSessions(today);
  const indices = computeIndices(sessions);
  const totalGameMinutes = Math.round(
    sessions.reduce((sum, s) => sum + (s.durationSec || 0), 0) / 60,
  );

  await upsertDailyLog(today, {
    gameSummary: {
      ...indices,
      totalGameMinutes,
    },
  });
}
