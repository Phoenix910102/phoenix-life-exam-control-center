import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db/client";
import { buildFullBackup, buildSnapshot } from "@/lib/export/builders";

describe("export builders", () => {
  beforeEach(async () => {
    await db.tasks.clear();
    await db.dailyLogs.clear();
    await db.examAttempts.clear();
    await db.gameSessions.clear();
    await db.wrongIndex.clear();
    await db.questions.clear();
    await db.achievements.clear();
    await db.settings.clear();
    await db.tasks.add({
      id: "t1",
      title: "task",
      category: "study",
      dueTime: null,
      importance: "normal",
      escalationProfile: "none",
      intensity: "standard",
      done: true,
      doneAt: new Date().toISOString(),
    });
  });

  it("builds snapshot", async () => {
    const x = await buildSnapshot();
    expect(x.filename).toMatch(/^phoenix-snapshot-/);
    expect((x.data as any).todayTaskSummary.total).toBe(1);
  });

  it("builds full backup", async () => {
    const x = await buildFullBackup();
    expect(x.filename).toMatch(/^phoenix-backup-/);
    expect(x.data.tasks.length).toBe(1);
    expect(x.data.meta.timezone).toBe("Asia/Taipei");
  });
});
