import { describe, expect, it } from "vitest";
import sampleJson from "../../materials/generated/example-gradient-descent.phoenix-material.json";
import { deriveBattlefield } from "@/lib/battlefield/deriveBattlefield";
import { parseMaterialPackage, materialPackageToDefinition } from "@/lib/materials/packageImporter";
import type { MaterialProgress } from "@/types/materialRecord";

function definition() {
  const parsed = parseMaterialPackage(sampleJson);
  if (!parsed.success) throw new Error("sample package is invalid");
  return materialPackageToDefinition(parsed.package, "sample.phoenix-material.json");
}

function progress(value: number, attempts: MaterialProgress["quizAttempts"] = []): MaterialProgress {
  return {
    materialSlug: "gradient-descent-uphill-downhill",
    activeChapterKey: "gradient-descent-core",
    chapterProgress: { "gradient-descent-core": value },
    completedChapterKeys: value >= 100 ? ["gradient-descent-core"] : [],
    quizAttempts: attempts,
    orphanedProgress: {},
    overallProgress: value,
    isActive: true,
  };
}

describe("learning battlefield", () => {
  it("maps untouched chapters to fog and completed clean chapters to secured", () => {
    expect(deriveBattlefield(definition(), progress(0)).zones[0].status).toBe("fog");
    const secured = deriveBattlefield(definition(), progress(100));
    expect(secured.zones[0].status).toBe("secured");
    expect(secured.securedCount).toBe(1);
  });

  it("raises a critical front after repeated incorrect quiz attempts", () => {
    const attemptedAt = new Date().toISOString();
    const attempts: MaterialProgress["quizAttempts"] = [0, 1].map((questionIndex) => ({
      chapterKey: "gradient-descent-core",
      blockIndex: 9,
      questionIndex,
      selectedIndex: 0,
      correct: false,
      attemptedAt,
    }));
    const battlefield = deriveBattlefield(definition(), progress(60, attempts));
    expect(battlefield.zones[0]).toMatchObject({ status: "critical", wrongCount: 2 });
    expect(battlefield.criticalCount).toBe(1);
    expect(battlefield.zones[0].enemyStrength).toBeGreaterThan(battlefield.zones[0].defense);
  });

  it("removes resolved mistakes from current enemy pressure", () => {
    const attempts: MaterialProgress["quizAttempts"] = [
      {
        chapterKey: "gradient-descent-core",
        blockIndex: 9,
        questionIndex: 0,
        selectedIndex: 0,
        correct: false,
        attemptedAt: "2026-07-16T01:00:00.000Z",
      },
      {
        chapterKey: "gradient-descent-core",
        blockIndex: 9,
        questionIndex: 0,
        selectedIndex: 1,
        correct: true,
        attemptedAt: "2026-07-16T01:05:00.000Z",
      },
    ];

    const battlefield = deriveBattlefield(definition(), progress(100, attempts));
    expect(battlefield.zones[0]).toMatchObject({ status: "secured", wrongCount: 0, correctRate: 100 });
  });
});
