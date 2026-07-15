import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db/client";
import { buildFullBackup, buildSnapshot } from "@/lib/export/builders";
import { restoreFullBackup } from "@/lib/export/restore";
import { importPhoenixMaterialPackage } from "@/lib/db/repository";
import { parseMaterialPackage } from "@/lib/materials/packageImporter";
import sampleJson from "../../materials/generated/example-gradient-descent.phoenix-material.json";

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
    await db.studyMaterials.clear();
    await db.materialProgress.clear();
    await db.materialDefinitions.clear();
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
    await db.questions.add({
      questionId: "q-backup-1",
      subject: "刑法總則",
      topic: "犯罪成立三階層",
      type: "single",
      stem: "正當防衛應在哪一層判斷？",
      options: ["構成要件", "違法性", "責任", "罪數"],
      answer: "違法性",
      explanation: "正當防衛是阻卻違法事由。",
      tags: ["三階層"],
    });
  });

  it("builds snapshot", async () => {
    const x = await buildSnapshot();
    expect(x.filename).toMatch(/^phoenix-snapshot-/);
    expect((x.data as any).todayTaskSummary.total).toBe(1);
  });

  it("builds full backup", async () => {
    const parsed = parseMaterialPackage(sampleJson);
    if (!parsed.success) throw new Error("sample package is invalid");
    await importPhoenixMaterialPackage(parsed.package, "example.phoenix-material.json");
    const x = await buildFullBackup();
    expect(x.filename).toMatch(/^phoenix-backup-/);
    expect(x.data.tasks.length).toBe(1);
    expect(x.data.questions).toHaveLength(1);
    expect(x.data.meta.timezone).toBe("Asia/Taipei");
    expect(x.data.materialDefinitions).toHaveLength(1);
    expect(x.data.materialProgress).toHaveLength(1);

    await db.tasks.clear();
    await db.questions.clear();
    await db.materialDefinitions.clear();
    await db.materialProgress.clear();
    await restoreFullBackup(x.data);
    expect(await db.tasks.get("t1")).toBeDefined();
    expect(await db.questions.get("q-backup-1")).toMatchObject({ topic: "犯罪成立三階層" });
    expect(await db.materialDefinitions.count()).toBe(1);
    expect(await db.materialProgress.count()).toBe(1);
  });
});
