import { z } from "zod";
import {
  materialPackageSchema,
  PHOENIX_MATERIAL_SCHEMA,
  type MaterialPackage,
} from "@/types/materialPackage";
import {
  materialDefinitionSchema,
  materialProgressSchema,
  type MaterialDefinition,
  type MaterialProgress,
} from "@/types/materialRecord";
import { normalizeMaterialPresentation } from "@/lib/materials/presentation";

export type MaterialImportStatus = "new" | "same-version" | "upgrade" | "downgrade";

export type MaterialValidationIssue = {
  path: string;
  message: string;
};

export type MaterialPackageParseResult =
  | { success: true; package: MaterialPackage }
  | { success: false; errors: MaterialValidationIssue[] };

function readFileText(file: File) {
  if (typeof file.text === "function") return file.text();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("檔案讀取失敗"));
    reader.readAsText(file);
  });
}

function describePath(path: PropertyKey[], raw: unknown) {
  const normalized = path.map(String);
  if (normalized[0] !== "chapters") return normalized.join(".") || "root";

  const chapterIndex = Number(normalized[1]);
  const record = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : undefined;
  const chapters = Array.isArray(record?.chapters) ? record.chapters : [];
  const chapter = chapters[chapterIndex];
  const chapterRecord = chapter && typeof chapter === "object" ? (chapter as Record<string, unknown>) : undefined;
  const chapterLabel = String(chapterRecord?.key ?? chapterRecord?.title ?? `第 ${chapterIndex + 1} 章`);

  if (normalized[2] !== "blocks") {
    return `章節「${chapterLabel}」.${normalized.slice(2).join(".") || "chapter"}`;
  }

  const blockIndex = Number(normalized[3]);
  const blocks = Array.isArray(chapterRecord?.blocks) ? chapterRecord.blocks : [];
  const block = blocks[blockIndex];
  const blockRecord = block && typeof block === "object" ? (block as Record<string, unknown>) : undefined;
  const blockLabel = String(blockRecord?.type ?? `block ${blockIndex + 1}`);
  const tail = normalized.slice(4).join(".");
  return `章節「${chapterLabel}」的第 ${blockIndex + 1} 個 ${blockLabel} block${tail ? `.${tail}` : ""}`;
}

function validationIssues(error: z.ZodError, raw: unknown): MaterialValidationIssue[] {
  return error.issues.map((issue) => ({
    path: describePath(issue.path, raw),
    message: issue.message,
  }));
}

export function parseMaterialPackage(input: string | unknown): MaterialPackageParseResult {
  let raw: unknown = input;
  if (typeof input === "string") {
    try {
      raw = JSON.parse(input);
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            path: "root",
            message: error instanceof Error ? `JSON 解析失敗：${error.message}` : "JSON 解析失敗",
          },
        ],
      };
    }
  }

  const parsed = materialPackageSchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: validationIssues(parsed.error, raw) };
  return { success: true, package: parsed.data };
}

export async function readMaterialPackageFile(file: File): Promise<MaterialPackageParseResult> {
  if (!isPhoenixMaterialFile(file.name)) {
    return {
      success: false,
      errors: [{ path: "file.name", message: "正式教材包副檔名必須是 .phoenix-material.json" }],
    };
  }
  return parseMaterialPackage(await readFileText(file));
}

export function isPhoenixMaterialFile(fileName: string) {
  return fileName.toLowerCase().endsWith(".phoenix-material.json");
}

type ParsedSemver = {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
};

function parseSemver(value: string): ParsedSemver {
  const [withoutBuild] = value.split("+");
  const separator = withoutBuild.indexOf("-");
  const core = separator === -1 ? withoutBuild : withoutBuild.slice(0, separator);
  const prerelease = separator === -1 ? "" : withoutBuild.slice(separator + 1);
  const [major, minor, patch] = core.split(".").map(Number);
  return { major, minor, patch, prerelease: prerelease ? prerelease.split(".") : [] };
}

export function compareSemver(left: string, right: string) {
  const a = parseSemver(left);
  const b = parseSemver(right);
  for (const key of ["major", "minor", "patch"] as const) {
    if (a[key] !== b[key]) return a[key] > b[key] ? 1 : -1;
  }
  if (a.prerelease.length === 0 && b.prerelease.length > 0) return 1;
  if (b.prerelease.length === 0 && a.prerelease.length > 0) return -1;
  for (let index = 0; index < Math.max(a.prerelease.length, b.prerelease.length); index += 1) {
    const av = a.prerelease[index];
    const bv = b.prerelease[index];
    if (av === undefined) return -1;
    if (bv === undefined) return 1;
    if (av === bv) continue;
    const an = /^\d+$/.test(av) ? Number(av) : null;
    const bn = /^\d+$/.test(bv) ? Number(bv) : null;
    if (an !== null && bn !== null) return an > bn ? 1 : -1;
    if (an !== null) return -1;
    if (bn !== null) return 1;
    return av > bv ? 1 : -1;
  }
  return 0;
}

export function getMaterialImportStatus(
  material: Pick<MaterialPackage, "slug" | "version">,
  existing?: Pick<MaterialDefinition, "slug" | "version">,
): MaterialImportStatus {
  if (!existing || existing.slug !== material.slug) return "new";
  const comparison = compareSemver(material.version, existing.version);
  if (comparison === 0) return "same-version";
  return comparison > 0 ? "upgrade" : "downgrade";
}

export function materialPackageToDefinition(
  material: MaterialPackage,
  sourceFileName: string,
  existing?: MaterialDefinition,
): MaterialDefinition {
  const now = new Date().toISOString();
  return materialDefinitionSchema.parse({
    kind: "phoenix-package",
    ...material,
    presentation: normalizeMaterialPresentation(material.presentation),
    format: "phoenix-package",
    sourceFileName,
    mimeType: "application/json",
    sourceContent: JSON.stringify(material, null, 2),
    contentEncoding: "text",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
}

function calculateOverallProgress(chapterProgress: Record<string, number>, chapterKeys: string[]) {
  if (chapterKeys.length === 0) return 0;
  return Math.round(chapterKeys.reduce((sum, key) => sum + (chapterProgress[key] ?? 0), 0) / chapterKeys.length);
}

export function createMaterialProgress(material: MaterialPackage, isActive = false): MaterialProgress {
  const chapterProgress = Object.fromEntries(material.chapters.map((chapter) => [chapter.key, 0]));
  return materialProgressSchema.parse({
    materialSlug: material.slug,
    activeChapterKey: material.chapters[0]?.key,
    chapterProgress,
    completedChapterKeys: [],
    quizAttempts: [],
    orphanedProgress: {},
    overallProgress: 0,
    isActive,
  });
}

export function mergeMaterialProgress(material: MaterialPackage, existing?: MaterialProgress, existingDefinition?: MaterialDefinition): MaterialProgress {
  if (!existing) return createMaterialProgress(material);

  const nextKeys = new Set(material.chapters.map((chapter) => chapter.key));
  const chapterProgress = Object.fromEntries(
    material.chapters.map((chapter) => [chapter.key, existing.chapterProgress[chapter.key] ?? 0]),
  );
  const orphanedProgress = { ...existing.orphanedProgress };
  for (const [key, progress] of Object.entries(existing.chapterProgress)) {
    if (!nextKeys.has(key)) orphanedProgress[key] = progress;
  }
  const completedChapterKeys = material.chapters
    .map((chapter) => chapter.key)
    .filter((key) => (chapterProgress[key] ?? 0) >= 100 || existing.completedChapterKeys.includes(key));
  const activeChapterKey = existing.activeChapterKey && nextKeys.has(existing.activeChapterKey)
    ? existing.activeChapterKey
    : material.chapters[0]?.key;

  const questionKeyByPrompt = new Map((material.collections?.questions ?? []).map((question) => [question.prompt, question.key]));
  const quizAttempts = existing.quizAttempts
    .filter((attempt) => nextKeys.has(attempt.chapterKey))
    .map((attempt) => {
      if (attempt.questionKey || !existingDefinition) return attempt;
      const chapter = existingDefinition.chapters.find((item) => item.key === attempt.chapterKey);
      const block = chapter?.blocks[attempt.blockIndex];
      const oldQuestion = block?.type === "quiz" ? block.questions[attempt.questionIndex] : undefined;
      const questionKey = oldQuestion ? questionKeyByPrompt.get(oldQuestion.question) : undefined;
      return questionKey ? { ...attempt, questionKey } : attempt;
    });
  return materialProgressSchema.parse({
    ...existing,
    materialSlug: material.slug,
    activeChapterKey,
    chapterProgress,
    completedChapterKeys,
    orphanedProgress,
    quizAttempts,
    overallProgress: calculateOverallProgress(chapterProgress, [...nextKeys]),
  });
}

export function assertImportAllowed(status: MaterialImportStatus, allowDowngrade = false) {
  if (status === "same-version") throw new Error("相同 slug 與 version 已存在，不會重複匯入");
  if (status === "downgrade" && !allowDowngrade) {
    throw new Error("這是較舊版本；必須明確確認後才能覆蓋目前教材");
  }
}

export function isPhoenixMaterialPackage(value: unknown): value is MaterialPackage {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as Record<string, unknown>).schema === PHOENIX_MATERIAL_SCHEMA,
  );
}
