import { beforeEach, describe, expect, it } from "vitest";
import sampleJson from "../../materials/generated/example-gradient-descent.phoenix-material.json";
import { confirmHydration, confirmMeal, getCareState } from "@/lib/care/repository";
import { db } from "@/lib/db/client";
import { importPhoenixMaterialPackage, updateMaterialChapterProgress } from "@/lib/db/repository";
import { runAchievementChecks } from "@/lib/achievements/rules";
import { parseMaterialPackage } from "@/lib/materials/packageImporter";

describe("achievement and care engine", () => {
  beforeEach(async () => {
    await Promise.all([
      db.materialDefinitions.clear(),
      db.materialProgress.clear(),
      db.achievements.clear(),
      db.achievementProgress.clear(),
      db.domainEvents.clear(),
      db.careState.clear(),
      db.tasks.clear(),
      db.examAttempts.clear(),
      db.gameSessions.clear(),
    ]);
  });

  it("unlocks progression achievements from chapter events", async () => {
    const parsed = parseMaterialPackage(sampleJson);
    if (!parsed.success) throw new Error("sample package is invalid");
    await importPhoenixMaterialPackage(parsed.package, "sample.phoenix-material.json");
    const result = await updateMaterialChapterProgress(parsed.package.slug, parsed.package.chapters[0].key, 100);
    expect(result?.eventReceipts.map((receipt) => receipt.event.type)).toEqual([
      "chapter.progress.changed",
      "chapter.completed",
    ]);
    expect(await db.achievements.get("first_material_step")).toBeDefined();
    expect(await db.achievements.get("chapter_conqueror")).toBeDefined();
    expect(await db.achievements.get("material_mastered")).toBeDefined();
    expect(await db.domainEvents.where("type").equals("chapter.completed").count()).toBe(1);
  });

  it("tracks care independently and unlocks supply discipline", async () => {
    const now = new Date("2026-07-16T02:00:00.000Z");
    await getCareState(now);
    await confirmHydration(now);
    await confirmHydration(new Date(now.getTime() + 60_000));
    const care = await confirmMeal(new Date(now.getTime() + 120_000));
    expect(care.hydration.countToday).toBe(2);
    expect(care.meal.countToday).toBe(1);
    expect(await db.achievements.get("supply_discipline")).toBeDefined();
  });

  it("does not treat matching chapter keys across materials as a recovery", async () => {
    const baseAttempt = {
      chapterKey: "introduction",
      blockIndex: 0,
      questionIndex: 0,
      selectedIndex: 0,
    };
    await db.materialProgress.bulkPut([
      {
        materialSlug: "material-a",
        chapterProgress: { introduction: 20 },
        completedChapterKeys: [],
        quizAttempts: [{ ...baseAttempt, correct: false, attemptedAt: "2026-07-16T01:00:00.000Z" }],
        orphanedProgress: {},
        overallProgress: 20,
        isActive: false,
      },
      {
        materialSlug: "material-b",
        chapterProgress: { introduction: 20 },
        completedChapterKeys: [],
        quizAttempts: [{ ...baseAttempt, correct: true, attemptedAt: "2026-07-16T01:05:00.000Z" }],
        orphanedProgress: {},
        overallProgress: 20,
        isActive: false,
      },
    ]);

    await runAchievementChecks();
    expect((await db.achievementProgress.get("rose_recovery"))?.current).toBe(0);
  });
});
