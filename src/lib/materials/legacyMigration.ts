import { materialDefinitionSchema, materialProgressSchema } from "@/types/materialRecord";
import type { StudyMaterial } from "@/types/studyMaterial";

export function legacyStudyMaterialToRecords(material: StudyMaterial) {
  const slug = `legacy-${material.id}`;
  const chapterKeyById = new Map(material.chapters.map((chapter) => [chapter.id, `legacy-${chapter.id}`]));
  const chapters = material.chapters.map((chapter) => ({
    key: chapterKeyById.get(chapter.id) ?? `legacy-chapter-${chapter.order + 1}`,
    title: chapter.title,
    summary: "由舊版教材中心保留的閱讀單元。",
    estimatedMinutes: 1,
    objectives: ["完成本章閱讀"],
    blocks: [
      {
        type: "callout" as const,
        tone: "info" as const,
        title: "Legacy 教材",
        body: "內容會由原始檔案閱讀器顯示；進度已移轉到新版獨立進度表。",
      },
    ],
  }));
  const chapterProgress = Object.fromEntries(
    material.chapters.map((chapter) => [chapterKeyById.get(chapter.id) ?? `legacy-${chapter.id}`, chapter.progress]),
  );

  return {
    definition: materialDefinitionSchema.parse({
      kind: "legacy",
      slug,
      version: "0.0.0",
      title: material.title,
      description: material.description ?? "",
      subject: "一般教材",
      language: "zh-TW",
      tags: material.tags,
      format: material.format,
      sourceFileName: material.sourceFileName,
      mimeType: material.mimeType,
      sourceContent: material.sourceContent,
      contentEncoding: material.contentEncoding,
      chapters,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    }),
    progress: materialProgressSchema.parse({
      materialSlug: slug,
      activeChapterKey: material.activeChapterId
        ? chapterKeyById.get(material.activeChapterId)
        : chapters[0]?.key,
      chapterProgress,
      completedChapterKeys: material.chapters
        .filter((chapter) => chapter.completed)
        .map((chapter) => chapterKeyById.get(chapter.id))
        .filter((key): key is string => Boolean(key)),
      quizAttempts: [],
      orphanedProgress: {},
      lastOpenedAt: material.lastOpenedAt,
      overallProgress: material.progressPercent,
      isActive: material.isActive,
    }),
  };
}
