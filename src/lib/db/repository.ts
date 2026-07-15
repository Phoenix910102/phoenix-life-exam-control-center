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
  const prev = (await db.settings.get("singleton")) ?? defaultSettings;
  const next: AppSettings = {
    ...prev,
    ...patch,
    id: "singleton",
    notifications: { ...prev.notifications, ...(patch.notifications ?? {}) },
    backups: { ...prev.backups, ...(patch.backups ?? {}) },
    models: { ...prev.models, ...(patch.models ?? {}) },
  };
  await db.settings.put(next);
  return next;
}

export async function getSettings() {
  return (await db.settings.get("singleton")) ?? defaultSettings;
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
