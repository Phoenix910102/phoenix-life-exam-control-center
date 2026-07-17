import { describe, expect, it } from "vitest";
import materialJson from "../../materials/generated/criminal-procedure-complete-phoenix.phoenix-material.json";
import { parseMaterialPackage } from "@/lib/materials/packageImporter";

describe("criminal procedure Phoenix campaign", () => {
  it("ships as a complete native bundled curriculum", () => {
    const parsed = parseMaterialPackage(materialJson);
    expect(parsed.success, parsed.success ? "" : JSON.stringify(parsed.errors, null, 2)).toBe(true);
    if (!parsed.success) return;

    const collections = parsed.package.collections;
    expect(parsed.package.slug).toBe("criminal-procedure-complete-phoenix");
    expect(parsed.package.chapters).toHaveLength(29);
    expect(collections?.glossary?.terms).toHaveLength(216);
    expect(collections?.glossary?.categories).toHaveLength(8);
    expect(collections?.questions).toHaveLength(162);
    expect(collections?.questionBanks).toHaveLength(36);
    expect(collections?.sourceLibrary).toHaveLength(21);
    expect(collections?.learningPaths).toHaveLength(4);
  });
});
