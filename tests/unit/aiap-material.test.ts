import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import aiapJson from "../../materials/generated/aiap-intermediate-complete-guide.phoenix-material.json";
import { mergeMaterialProgress, parseMaterialPackage } from "@/lib/materials/packageImporter";
import type { MaterialDefinition, MaterialProgress } from "@/types/materialRecord";

describe("AIAP native Phoenix curriculum v2", () => {
  it("preserves the audited curriculum without duplicating glossary cards", () => {
    const parsed = parseMaterialPackage(aiapJson);
    expect(parsed.success, parsed.success ? "" : JSON.stringify(parsed.errors, null, 2)).toBe(true);
    if (!parsed.success) return;

    const material = parsed.package;
    const blocks = material.chapters.flatMap((chapter) => chapter.blocks);
    const terms = material.collections?.glossary?.terms ?? [];
    const categories = material.collections?.glossary?.categories ?? [];
    const questions = material.collections?.questions ?? [];
    const banks = material.collections?.questionBanks ?? [];

    expect(material.slug).toBe("aiap-intermediate-complete-guide");
    expect(material.version).toBe("2.0.0");
    expect(material.chapters).toHaveLength(15);
    expect(terms).toHaveLength(305);
    expect(categories).toHaveLength(17);
    expect(terms.filter((term) => term.level === "core")).toHaveLength(95);
    expect(terms.filter((term) => term.level === "frequent")).toHaveLength(67);
    expect(terms.filter((term) => term.level === "index")).toHaveLength(143);
    expect(questions).toHaveLength(340);
    expect(questions.filter((question) => question.imageAsset)).toHaveLength(10);
    expect(banks.filter((bank) => bank.kind === "boss")).toHaveLength(12);
    expect(banks.filter((bank) => bank.kind === "final")).toHaveLength(1);
    expect(material.collections?.sourceLibrary).toHaveLength(37);
    expect(blocks.filter((block) => block.type === "term-card")).toHaveLength(0);
    expect(blocks.filter((block) => block.type === "term-reference").length).toBeGreaterThan(0);
    expect(new Set(terms.map((term) => term.key)).size).toBe(305);
    expect(new Set(questions.map((question) => question.key)).size).toBe(340);

    for (const question of questions.filter((item) => item.imageAsset)) {
      expect(fs.existsSync(path.join(process.cwd(), "public", question.imageAsset!.replace(/^\//, "")))).toBe(true);
    }
  });

  it("maps legacy quiz attempts to stable question keys while retaining progress", () => {
    const parsed = parseMaterialPackage(aiapJson);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const prompt = parsed.package.collections!.questions![240].prompt;
    const existingDefinition = {
      slug: parsed.package.slug,
      chapters: [{ key: "ch-01", blocks: [{ type: "quiz", title: "old", questions: [{ question: prompt, options: ["A", "B"], answer: 0, explanation: "old", tags: [] }] }] }],
    } as unknown as MaterialDefinition;
    const existing = {
      materialSlug: parsed.package.slug,
      activeChapterKey: "ch-01",
      chapterProgress: { "ch-01": 70 },
      completedChapterKeys: [],
      quizAttempts: [{ chapterKey: "ch-01", blockIndex: 0, questionIndex: 0, selectedIndex: 0, correct: true, attemptedAt: "2026-07-16T00:00:00.000Z" }],
      orphanedProgress: {},
      overallProgress: 5,
      isActive: true,
      totalActiveSeconds: 900,
      lastOpenedAt: "2026-07-16T00:00:00.000Z",
    } satisfies MaterialProgress;
    const migrated = mergeMaterialProgress(parsed.package, existing, existingDefinition);
    expect(migrated.chapterProgress["ch-01"]).toBe(70);
    expect(migrated.activeChapterKey).toBe("ch-01");
    expect(migrated.totalActiveSeconds).toBe(900);
    expect(migrated.quizAttempts[0].questionKey).toBe("s1-q001");
  });
});
