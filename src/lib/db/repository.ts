import { db } from "./client";
import type { DailyLog } from "@/types/dailyLog";
import type { Task } from "@/types/task";
import type { Question } from "@/types/question";
import type { ExamAttempt } from "@/types/exam";
import type { GameSession } from "@/types/game";
import { defaultSettings, type AppSettings } from "@/types/settings";
import { applyAttemptToWrongIndex } from "@/lib/exams/wrongIndex";
import type { StudyMaterial, StudyMaterialChapter } from "@/types/studyMaterial";
import { calculateMaterialProgress } from "@/lib/materials/importer";
import type { MaterialPackage } from "@/types/materialPackage";
import type {
  MaterialBundle,
  MaterialDefinition,
  MaterialProgress,
  MaterialQuizAttempt,
} from "@/types/materialRecord";
import {
  assertImportAllowed,
  getMaterialImportStatus,
  materialPackageToDefinition,
  mergeMaterialProgress,
} from "@/lib/materials/packageImporter";
import { legacyStudyMaterialToRecords } from "@/lib/materials/legacyMigration";
import { processDomainEvent } from "@/lib/achievements/rules";

export async function upsertDailyLog(date: string, patch: Partial<DailyLog>) {
  const prev = await db.dailyLogs.get(date);
  const next = { ...(prev ?? { date }), ...patch, date };
  await db.dailyLogs.put(next);
  return next;
}

export async function listDailyLogs(range?: { start?: string; end?: string }) {
  if (!range?.start && !range?.end) return db.dailyLogs.toArray();
  return db.dailyLogs
    .filter((d) => (!range.start || d.date >= range.start) && (!range.end || d.date <= range.end))
    .toArray();
}

export async function addTask(task: Task) {
  await db.tasks.add(task);
  return task;
}

export async function updateTask(id: string, patch: Partial<Task>) {
  await db.tasks.update(id, patch);
  return db.tasks.get(id);
}

export async function listTasks(today?: string) {
  const tasks = await db.tasks.toArray();
  if (!today) return tasks;
  return tasks.filter((t) => !t.dueTime || t.dueTime.startsWith(today));
}

export async function upsertQuestion(question: Question) {
  await db.questions.put(question);
  return question;
}

export async function bulkUpsertQuestions(questions: Question[]) {
  await db.questions.bulkPut(questions);
  return questions.length;
}

export async function listQuestions(filter?: Partial<Pick<Question, "subject" | "topic" | "type">>) {
  const questions = await db.questions.toArray();
  if (!filter) return questions;
  return questions.filter(
    (q) =>
      (!filter.subject || q.subject === filter.subject) &&
      (!filter.topic || q.topic === filter.topic) &&
      (!filter.type || q.type === filter.type),
  );
}

export async function addExamAttempt(attempt: ExamAttempt) {
  await db.examAttempts.add(attempt);
  await updateWrongIndexFromAttempt(attempt);
  return attempt;
}

export async function listExamAttempts() {
  return db.examAttempts.orderBy("dateTimeStart").reverse().toArray();
}

export async function updateWrongIndexFromAttempt(attempt: ExamAttempt) {
  const nowIso = new Date().toISOString();
  for (const response of attempt.responses) {
    const prev = await db.wrongIndex.get(response.questionId);
    const next = applyAttemptToWrongIndex(prev, response, nowIso);
    await db.wrongIndex.put(next);
  }
}

export async function addGameSession(session: GameSession) {
  await db.gameSessions.add(session);
  return session;
}

export async function listGameSessions(today?: string) {
  const all = await db.gameSessions.toArray();
  if (!today) return all;
  return all.filter((g) => g.dateTimeStart.startsWith(today));
}

export async function upsertSettings(patch: Partial<AppSettings>) {
  const prev = await getSettings();
  const next: AppSettings = {
    ...prev,
    ...patch,
    id: "singleton",
    notifications: { ...prev.notifications, ...(patch.notifications ?? {}) },
    backups: { ...prev.backups, ...(patch.backups ?? {}) },
    models: { ...prev.models, ...(patch.models ?? {}) },
    campaign: { ...prev.campaign, ...(patch.campaign ?? {}) },
  };
  await db.settings.put(next);
  return next;
}

export async function getSettings() {
  const stored = await db.settings.get("singleton");
  if (!stored) return defaultSettings;
  return {
    ...defaultSettings,
    ...stored,
    notifications: { ...defaultSettings.notifications, ...stored.notifications },
    backups: { ...defaultSettings.backups, ...stored.backups },
    models: { ...defaultSettings.models, ...stored.models },
    campaign: { ...defaultSettings.campaign, ...stored.campaign },
  };
}

export async function listStudyMaterials() {
  return db.studyMaterials.orderBy("updatedAt").reverse().toArray();
}

export async function getStudyMaterial(id: string) {
  return db.studyMaterials.get(id);
}

export async function putStudyMaterial(material: StudyMaterial) {
  await db.studyMaterials.put(material);
  return material;
}

export async function setActiveStudyMaterial(id: string) {
  await db.transaction("rw", db.studyMaterials, async () => {
    const materials = await db.studyMaterials.toArray();
    await db.studyMaterials.bulkPut(
      materials.map((material) => ({
        ...material,
        isActive: material.id === id,
        updatedAt: material.id === id ? new Date().toISOString() : material.updatedAt,
      })),
    );
  });
  return db.studyMaterials.get(id);
}

export async function updateStudyMaterialProgress(
  materialId: string,
  chapterId: string,
  progress: number,
) {
  const material = await db.studyMaterials.get(materialId);
  if (!material) return undefined;
  const now = new Date().toISOString();
  const normalized = Math.max(0, Math.min(100, Math.round(progress)));
  const chapters: StudyMaterialChapter[] = material.chapters.map((chapter) =>
    chapter.id === chapterId
      ? { ...chapter, progress: normalized, completed: normalized === 100, lastOpenedAt: now }
      : chapter,
  );
  const next: StudyMaterial = {
    ...material,
    chapters,
    activeChapterId: chapterId,
    progressPercent: calculateMaterialProgress(chapters),
    lastOpenedAt: now,
    updatedAt: now,
  };
  await db.studyMaterials.put(next);
  return next;
}

export async function deleteStudyMaterial(id: string) {
  await db.studyMaterials.delete(id);
}

function emptyProgressForDefinition(definition: MaterialDefinition): MaterialProgress {
  const chapterProgress = Object.fromEntries(definition.chapters.map((chapter) => [chapter.key, 0]));
  return {
    materialSlug: definition.slug,
    activeChapterKey: definition.chapters[0]?.key,
    chapterProgress,
    completedChapterKeys: [],
    quizAttempts: [],
    orphanedProgress: {},
    overallProgress: 0,
    isActive: false,
  };
}

export async function listMaterialBundles(): Promise<MaterialBundle[]> {
  const definitions = await db.materialDefinitions.orderBy("updatedAt").reverse().toArray();
  const allProgress = await db.materialProgress.toArray();
  const progressBySlug = new Map(allProgress.map((progress) => [progress.materialSlug, progress]));
  return definitions.map((definition) => ({
    definition,
    progress: progressBySlug.get(definition.slug) ?? emptyProgressForDefinition(definition),
  }));
}

export async function getMaterialBundle(slug: string): Promise<MaterialBundle | undefined> {
  const definition = await db.materialDefinitions.get(slug);
  if (!definition) return undefined;
  const progress = (await db.materialProgress.get(slug)) ?? emptyProgressForDefinition(definition);
  return { definition, progress };
}

export async function openMaterialCampaign(slug: string) {
  const openedAt = new Date().toISOString();
  const next = await db.transaction("rw", db.materialDefinitions, db.materialProgress, async () => {
    const definition = await db.materialDefinitions.get(slug);
    if (!definition) return undefined;
    const current = (await db.materialProgress.get(slug)) ?? emptyProgressForDefinition(definition);
    const progress: MaterialProgress = {
      ...current,
      activeChapterKey: current.activeChapterKey ?? definition.chapters[0]?.key,
      lastOpenedAt: openedAt,
    };
    await db.materialProgress.put(progress);
    return { definition, progress };
  });
  if (!next) return undefined;
  const eventReceipt = await processDomainEvent({
    type: "material.opened",
    materialSlug: slug,
    chapterKey: next.progress.activeChapterKey,
    occurredAt: openedAt,
    payload: { version: next.definition.version },
  });
  return { ...next, eventReceipts: [eventReceipt] };
}

export async function importLegacyStudyMaterial(material: StudyMaterial) {
  const converted = legacyStudyMaterialToRecords(material);
  await db.transaction("rw", db.studyMaterials, db.materialDefinitions, db.materialProgress, async () => {
    await db.studyMaterials.put(material);
    await db.materialDefinitions.put(converted.definition);
    await db.materialProgress.put(converted.progress);
  });
  return converted;
}

export async function importPhoenixMaterialPackage(
  material: MaterialPackage,
  sourceFileName: string,
  options: { allowDowngrade?: boolean; setActive?: boolean } = {},
) {
  const result = await db.transaction("rw", db.materialDefinitions, db.materialProgress, async () => {
    const existingDefinition = await db.materialDefinitions.get(material.slug);
    const existingProgress = await db.materialProgress.get(material.slug);
    const status = getMaterialImportStatus(material, existingDefinition);
    assertImportAllowed(status, options.allowDowngrade);

    const definition = materialPackageToDefinition(material, sourceFileName, existingDefinition);
    const progress = mergeMaterialProgress(material, existingProgress, existingDefinition);
    if (options.setActive) {
      const allProgress = await db.materialProgress.toArray();
      await db.materialProgress.bulkPut(
        allProgress.map((item) => ({ ...item, isActive: item.materialSlug === material.slug })),
      );
      progress.isActive = true;
    }
    await db.materialDefinitions.put(definition);
    await db.materialProgress.put(progress);
    return { definition, progress, status };
  });
  const eventReceipt = await processDomainEvent({
    type: result.status === "upgrade" || result.status === "downgrade" ? "material.updated" : "material.imported",
    materialSlug: result.definition.slug,
    payload: { version: result.definition.version, status: result.status },
  });
  return { ...result, eventReceipts: [eventReceipt] };
}

export async function setActiveMaterial(slug: string) {
  return db.transaction("rw", db.materialProgress, async () => {
    const definitions = await db.materialDefinitions.toArray();
    const progressItems = await db.materialProgress.toArray();
    const progressBySlug = new Map(progressItems.map((item) => [item.materialSlug, item]));
    await db.materialProgress.bulkPut(
      definitions.map((definition) => ({
        ...(progressBySlug.get(definition.slug) ?? emptyProgressForDefinition(definition)),
        isActive: definition.slug === slug,
      })),
    );
    return db.materialProgress.get(slug);
  });
}

export async function updateMaterialChapterProgress(slug: string, chapterKey: string, value: number) {
  const result = await db.transaction("rw", db.materialDefinitions, db.materialProgress, async () => {
    const definition = await db.materialDefinitions.get(slug);
    if (!definition || !definition.chapters.some((chapter) => chapter.key === chapterKey)) return undefined;
    const current = (await db.materialProgress.get(slug)) ?? emptyProgressForDefinition(definition);
    const previousValue = current.chapterProgress[chapterKey] ?? 0;
    const normalized = Math.max(0, Math.min(100, Math.round(value)));
    const chapterProgress = { ...current.chapterProgress, [chapterKey]: normalized };
    const completedChapterKeys = definition.chapters
      .map((chapter) => chapter.key)
      .filter((key) => (chapterProgress[key] ?? 0) >= 100);
    const overallProgress = Math.round(
      definition.chapters.reduce((sum, chapter) => sum + (chapterProgress[chapter.key] ?? 0), 0) /
        definition.chapters.length,
    );
    const next: MaterialProgress = {
      ...current,
      activeChapterKey: chapterKey,
      chapterProgress,
      completedChapterKeys,
      overallProgress,
      lastOpenedAt: new Date().toISOString(),
    };
    await db.materialProgress.put(next);
    return { next, previousValue, normalized };
  });
  if (!result) return undefined;
  const eventReceipts = [await processDomainEvent({
    type: "chapter.progress.changed",
    materialSlug: slug,
    chapterKey,
    payload: { previous: result.previousValue, current: result.normalized },
  })];
  if (result.previousValue < 100 && result.normalized >= 100) {
    eventReceipts.push(await processDomainEvent({
      type: "chapter.completed",
      materialSlug: slug,
      chapterKey,
      payload: { progress: 100 },
    }));
  }
  return { progress: result.next, eventReceipts };
}

export async function openMaterialChapter(slug: string, chapterKey: string) {
  const next = await db.transaction("rw", db.materialDefinitions, db.materialProgress, async () => {
    const definition = await db.materialDefinitions.get(slug);
    if (!definition || !definition.chapters.some((chapter) => chapter.key === chapterKey)) return undefined;
    const current = (await db.materialProgress.get(slug)) ?? emptyProgressForDefinition(definition);
    const progress: MaterialProgress = {
      ...current,
      activeChapterKey: chapterKey,
      lastOpenedAt: new Date().toISOString(),
    };
    await db.materialProgress.put(progress);
    return progress;
  });
  if (!next) return undefined;
  const eventReceipt = await processDomainEvent({
    type: "chapter.opened",
    materialSlug: slug,
    chapterKey,
    payload: {},
  });
  return { progress: next, eventReceipts: [eventReceipt] };
}

export async function recordMaterialQuizAttempt(slug: string, attempt: MaterialQuizAttempt) {
  const next = await db.transaction("rw", db.materialDefinitions, db.materialProgress, async () => {
    const definition = await db.materialDefinitions.get(slug);
    if (!definition) return undefined;
    const current = (await db.materialProgress.get(slug)) ?? emptyProgressForDefinition(definition);
    const next = {
      ...current,
      activeChapterKey: attempt.chapterKey,
      quizAttempts: [...current.quizAttempts, attempt],
      lastOpenedAt: attempt.attemptedAt,
    };
    await db.materialProgress.put(next);
    return next;
  });
  if (!next) return undefined;
  const eventReceipts = [await processDomainEvent({
    type: "quiz.attempted",
    materialSlug: slug,
    chapterKey: attempt.chapterKey,
    payload: { correct: attempt.correct, questionIndex: attempt.questionIndex },
  })];
  eventReceipts.push(await processDomainEvent({
    type: attempt.correct ? "quiz.correct" : "quiz.incorrect",
    materialSlug: slug,
    chapterKey: attempt.chapterKey,
    payload: { questionIndex: attempt.questionIndex },
  }));
  return { progress: next, eventReceipts };
}

export async function deleteMaterialBundle(slug: string) {
  await db.transaction("rw", db.materialDefinitions, db.materialProgress, db.studyMaterials, async () => {
    await db.materialDefinitions.delete(slug);
    await db.materialProgress.delete(slug);
    if (slug.startsWith("legacy-")) await db.studyMaterials.delete(slug.slice("legacy-".length));
  });
}

export async function addLegacyMaterialChapter(slug: string, title: string) {
  return db.transaction("rw", db.materialDefinitions, db.materialProgress, async () => {
    const definition = await db.materialDefinitions.get(slug);
    if (!definition || definition.kind !== "legacy") return undefined;
    const key = `manual-${Date.now()}`;
    const nextDefinition: MaterialDefinition = {
      ...definition,
      chapters: [
        ...definition.chapters,
        {
          key,
          title: title.trim(),
          summary: "Phoenix 手動建立的閱讀進度單元。",
          estimatedMinutes: 1,
          objectives: ["完成本單元閱讀"],
          blocks: [
            {
              type: "callout",
              tone: "info",
              title: "自訂單元",
              body: "這個單元用來追蹤舊版教材中的自訂閱讀範圍。",
            },
          ],
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    const current = (await db.materialProgress.get(slug)) ?? emptyProgressForDefinition(definition);
    const nextProgress: MaterialProgress = {
      ...current,
      chapterProgress: { ...current.chapterProgress, [key]: 0 },
    };
    await db.materialDefinitions.put(nextDefinition);
    await db.materialProgress.put(nextProgress);
    return { definition: nextDefinition, progress: nextProgress };
  });
}
