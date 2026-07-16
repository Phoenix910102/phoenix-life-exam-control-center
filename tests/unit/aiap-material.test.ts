import { describe, expect, it } from "vitest";
import aiapJson from "../../materials/generated/aiap-intermediate-complete-guide.phoenix-material.json";
import { parseMaterialPackage } from "@/lib/materials/packageImporter";

describe("AIAP intermediate campaign material", () => {
  it("keeps the complete textbook structure in a valid Phoenix package", () => {
    const parsed = parseMaterialPackage(aiapJson);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const blocks = parsed.package.chapters.flatMap((chapter) => chapter.blocks);
    const questions = blocks.flatMap((block) => block.type === "quiz" ? block.questions : []);

    expect(parsed.package.slug).toBe("aiap-intermediate-complete-guide");
    expect(parsed.package.chapters).toHaveLength(15);
    expect(blocks.filter((block) => block.type === "term-card")).toHaveLength(305);
    expect(questions).toHaveLength(90);
    expect(parsed.package.sources).toHaveLength(37);
    expect(parsed.package.presentation?.availableModes).toEqual(["reading", "immersive", "night"]);
  });
});
