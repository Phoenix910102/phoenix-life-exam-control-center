import { beforeEach, describe, expect, it } from "vitest";
import sampleJson from "../../materials/generated/example-gradient-descent.phoenix-material.json";
import { confirmHydration, confirmMeal, getCareState } from "@/lib/care/repository";
import { db } from "@/lib/db/client";
import { importPhoenixMaterialPackage, updateMaterialChapterProgress } from "@/lib/db/repository";
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
    await updateMaterialChapterProgress(parsed.package.slug, parsed.package.chapters[0].key, 100);
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
});
