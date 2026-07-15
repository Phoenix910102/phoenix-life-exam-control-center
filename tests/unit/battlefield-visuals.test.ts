import { describe, expect, it } from "vitest";
import sampleJson from "../../materials/generated/example-gradient-descent.phoenix-material.json";
import { deriveBattlefieldVisuals } from "@/lib/battlefield/deriveBattlefieldVisuals";
import { generateZoneLayout } from "@/lib/battlefield/layoutSeed";
import { materialPackageToDefinition, parseMaterialPackage } from "@/lib/materials/packageImporter";
import type { MaterialProgress } from "@/types/materialRecord";

function definition() {
  const parsed = parseMaterialPackage(sampleJson);
  if (!parsed.success) throw new Error("sample package is invalid");
  return materialPackageToDefinition(parsed.package, "sample.phoenix-material.json");
}

function progress(value: number): MaterialProgress {
  return {
    materialSlug: sampleJson.slug,
    activeChapterKey: sampleJson.chapters[0].key,
    chapterProgress: { [sampleJson.chapters[0].key]: value },
    completedChapterKeys: value >= 100 ? [sampleJson.chapters[0].key] : [],
    quizAttempts: [],
    orphanedProgress: {},
    overallProgress: value,
    isActive: true,
  };
}

describe("3D battlefield visual derivation", () => {
  it("uses a deterministic non-overlapping layout for the same seed", () => {
    const first = generateZoneLayout(9, "curved-front", "criminal-law-v1");
    const second = generateZoneLayout(9, "curved-front", "criminal-law-v1");
    expect(first).toEqual(second);

    for (let left = 0; left < first.length; left += 1) {
      for (let right = left + 1; right < first.length; right += 1) {
        const dx = first[left].position[0] - first[right].position[0];
        const dz = first[left].position[2] - first[right].position[2];
        expect(Math.hypot(dx, dz)).toBeGreaterThan(2.8);
      }
    }
  });

  it("maps secured learning state to bases, units, and a stable visual seed", () => {
    const first = deriveBattlefieldVisuals(definition(), progress(100));
    const second = deriveBattlefieldVisuals(definition(), progress(100));
    expect(first).toEqual(second);
    expect(first.seed).toBe("gradient-descent-neural-front-v1");
    expect(first.zones[0]).toMatchObject({
      biome: "neural-grid",
      status: "secured",
      baseLevel: 3,
      enemyUnits: 0,
    });
    expect(first.zones[0].alliedUnits).toBeGreaterThan(10);
    expect(first.zones[0].securedIntensity).toBeGreaterThan(0);
  });
});
