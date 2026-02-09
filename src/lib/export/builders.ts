import { db } from "@/lib/db/client";
import type { ExportData } from "@/types/exportData";
import { defaultSettings } from "@/types/settings";
import { taipeiStamp, toTaipeiDateKey } from "@/lib/utils/date";

export async function buildSnapshot() {
  const today = toTaipeiDateKey();
  const allLogs = await db.dailyLogs.orderBy("date").reverse().toArray();
  const dailyLogs = allLogs.slice(0, 3);

  const tasks = await db.tasks.toArray();
  const todayTasks = tasks.filter((t) => !t.dueTime || t.dueTime.startsWith(today));
  const examAttempts = await db.examAttempts.orderBy("dateTimeStart").reverse().limit(1).toArray();
  const gameToday = await db.dailyLogs.get(today);

  const data = {
    meta: {
      timezone: "Asia/Taipei" as const,
      appVersion: "0.1.0",
      createdAt: new Date().toISOString(),
    },
    dailyLogs,
    todayTaskSummary: {
      total: todayTasks.length,
      done: todayTasks.filter((t) => t.done).length,
    },
    latestExam: examAttempts[0] ?? null,
    todayGameSummary: gameToday?.gameSummary ?? null,
  };

  return {
    filename: `phoenix-snapshot-${taipeiStamp()}.json`,
    data,
  };
}

export async function buildFullBackup(): Promise<{ filename: string; data: ExportData }> {
  const settings = (await db.settings.get("singleton")) ?? defaultSettings;
  const data: ExportData = {
    meta: {
      timezone: "Asia/Taipei",
      appVersion: "0.1.0",
      createdAt: new Date().toISOString(),
    },
    dailyLogs: await db.dailyLogs.toArray(),
    tasks: await db.tasks.toArray(),
    questionBankMeta: {
      bankVersion: "mvp-v1",
      lastImportAt: (await db.questions.orderBy("questionId").last()) ? new Date().toISOString() : undefined,
    },
    examAttempts: await db.examAttempts.toArray(),
    wrongIndex: await db.wrongIndex.toArray(),
    gameSessions: await db.gameSessions.toArray(),
    achievements: await db.achievements.toArray(),
    settings,
  };

  return {
    filename: `phoenix-backup-${taipeiStamp()}.json`,
    data,
  };
}
