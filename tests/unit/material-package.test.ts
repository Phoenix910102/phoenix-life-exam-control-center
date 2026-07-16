import { beforeEach, describe, expect, it, vi } from "vitest";
import sampleJson from "../../materials/generated/example-gradient-descent.phoenix-material.json";
import { db } from "@/lib/db/client";
import {
  assertImportAllowed,
  getMaterialImportStatus,
  materialPackageToDefinition,
  parseMaterialPackage,
} from "@/lib/materials/packageImporter";
import {
  getMaterialBundle,
  importPhoenixMaterialPackage,
  openMaterialCampaign,
  updateMaterialChapterProgress,
} from "@/lib/db/repository";
import { loadRemoteMaterialCatalog } from "@/lib/materials/githubRemote";
import type { MaterialPackage } from "@/types/materialPackage";
import { legacyStudyMaterialToRecords } from "@/lib/materials/legacyMigration";

function samplePackage(): MaterialPackage {
  const parsed = parseMaterialPackage(structuredClone(sampleJson));
  if (!parsed.success) throw new Error(parsed.errors.map((error) => error.message).join("; "));
  return parsed.package;
}

describe("Phoenix material package", () => {
  beforeEach(async () => {
    await db.materialProgress.clear();
    await db.materialDefinitions.clear();
    await db.achievements.clear();
    await db.achievementProgress.clear();
    await db.domainEvents.clear();
    await db.careState.clear();
  });

  it("accepts a valid package", () => {
    const parsed = parseMaterialPackage(sampleJson);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.package.presentation?.battlefield3d).toMatchObject({
        enabled: true,
        layout: "radial",
        quality: "auto",
      });
    }
  });

  it("gives packages without presentation metadata the immersive campaign defaults", () => {
    const input = structuredClone(sampleJson) as Record<string, unknown>;
    delete input.presentation;
    const parsed = parseMaterialPackage(input);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const definition = materialPackageToDefinition(parsed.package, "default.phoenix-material.json");
    expect(definition.presentation).toMatchObject({
      layout: "immersive-academy",
      theme: "criminal-rose",
      renderOrder: "authored",
    });
    expect(definition.presentation?.modules).toEqual(expect.arrayContaining([
      "battlefield",
      "reader",
      "duel",
      "diagnostic",
      "quiz",
      "floating-console",
    ]));
  });

  it("rejects unsupported 3D battlefield configuration values", () => {
    const invalid = structuredClone(sampleJson);
    invalid.presentation.battlefield3d.layout = "spiral" as "radial";
    const parsed = parseMaterialPackage(invalid);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.errors.some((error) => error.path.includes("battlefield3d.layout"))).toBe(true);
  });

  it("rejects schema errors with a field path", () => {
    const invalid = { ...structuredClone(sampleJson), schema: "phoenix.material.v0" };
    const parsed = parseMaterialPackage(invalid);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.errors[0].path).toBe("schema");
  });

  it("rejects duplicate chapter keys", () => {
    const invalid = structuredClone(sampleJson);
    invalid.chapters.push(structuredClone(invalid.chapters[0]));
    const parsed = parseMaterialPackage(invalid);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.errors.some((error) => error.message.includes("重複"))).toBe(true);
  });

  it("accepts presentation metadata and rejects duplicate block keys", () => {
    const valid = structuredClone(sampleJson);
    const [firstBlock, secondBlock] = valid.chapters[0].blocks as Array<Record<string, unknown>>;
    firstBlock.key = "shared-block";
    secondBlock.key = "shared-block";
    const parsed = parseMaterialPackage(valid);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.errors.some((error) => error.message.includes("block.key") && error.message.includes("重複"))).toBe(true);
  });

  it("does not import the same slug and version twice", async () => {
    const material = samplePackage();
    await importPhoenixMaterialPackage(material, "sample.phoenix-material.json");
    await expect(importPhoenixMaterialPackage(material, "sample.phoenix-material.json")).rejects.toThrow("不會重複匯入");
    expect(await db.materialDefinitions.count()).toBe(1);
  });

  it("records campaign openings and restores the existing active chapter", async () => {
    const material = samplePackage();
    await importPhoenixMaterialPackage(material, "sample.phoenix-material.json");
    const opened = await openMaterialCampaign(material.slug);

    expect(opened?.progress.activeChapterKey).toBe(material.chapters[0].key);
    expect(opened?.progress.lastOpenedAt).toBeTruthy();
    expect(opened?.eventReceipts[0].event).toMatchObject({
      type: "material.opened",
      materialSlug: material.slug,
    });
    expect(await db.domainEvents.where("type").equals("material.opened").count()).toBe(1);
  });

  it("preserves matching chapter progress and starts new chapters at zero", async () => {
    const material = samplePackage();
    await importPhoenixMaterialPackage(material, "sample.phoenix-material.json");
    await updateMaterialChapterProgress(material.slug, material.chapters[0].key, 60);

    const update: MaterialPackage = {
      ...material,
      version: "1.2.0",
      chapters: [
        ...material.chapters,
        {
          ...structuredClone(material.chapters[0]),
          key: "gradient-descent-advanced",
          title: "進階更新策略",
        },
      ],
    };
    await importPhoenixMaterialPackage(update, "sample-v1.2.phoenix-material.json");
    const bundle = await getMaterialBundle(material.slug);
    expect(bundle?.progress.chapterProgress[material.chapters[0].key]).toBe(60);
    expect(bundle?.progress.chapterProgress["gradient-descent-advanced"]).toBe(0);
  });

  it("blocks older versions unless downgrade is explicitly allowed", () => {
    const material = samplePackage();
    const status = getMaterialImportStatus(material, { slug: material.slug, version: "2.0.0" });
    expect(status).toBe("downgrade");
    expect(() => assertImportAllowed(status)).toThrow("較舊版本");
    expect(() => assertImportAllowed(status, true)).not.toThrow();
  });

  it("validates quiz answer indexes", () => {
    const invalid = structuredClone(sampleJson);
    const quiz = invalid.chapters[0].blocks.find((block) => block.type === "quiz");
    if (!quiz || quiz.type !== "quiz") throw new Error("sample quiz missing");
    quiz.questions![0].answer = 99;
    const parsed = parseMaterialPackage(invalid);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.errors.some((error) => error.path.endsWith("answer"))).toBe(true);
  });

  it("does not write invalid GitHub material responses to Dexie", async () => {
    const directory = [{
      name: "broken.phoenix-material.json",
      path: "materials/generated/broken.phoenix-material.json",
      sha: "abc",
      size: 20,
      type: "file",
    }];
    const invalidFile = {
      ...directory[0],
      encoding: "base64",
      content: Buffer.from(JSON.stringify({ schema: "wrong" })).toString("base64"),
    };
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify(directory), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(invalidFile), { status: 200 }));

    const result = await loadRemoteMaterialCatalog(
      { repo: "Phoenix/example", branch: "codex-progress", path: "materials/generated", token: "test" },
      fetcher,
    );
    expect(result.items).toHaveLength(0);
    expect(result.invalidItems).toHaveLength(1);
    expect(await db.materialDefinitions.count()).toBe(0);
  });

  it("converts legacy content while preserving its chapter progress", () => {
    const now = new Date().toISOString();
    const converted = legacyStudyMaterialToRecords({
      id: "old-book",
      title: "舊教材",
      format: "text",
      sourceFileName: "old.txt",
      mimeType: "text/plain",
      sourceContent: "legacy",
      contentEncoding: "text",
      chapters: [
        { id: "c1", title: "第一章", order: 0, progress: 70, completed: false },
        { id: "c2", title: "第二章", order: 1, progress: 100, completed: true },
      ],
      activeChapterId: "c1",
      progressPercent: 85,
      isActive: true,
      tags: [],
      createdAt: now,
      updatedAt: now,
    });
    expect(converted.definition.kind).toBe("legacy");
    expect(converted.progress.chapterProgress["legacy-c1"]).toBe(70);
    expect(converted.progress.completedChapterKeys).toContain("legacy-c2");
  });
});
