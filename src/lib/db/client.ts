import Dexie, { type Table } from "dexie";
import type { DailyLog } from "@/types/dailyLog";
import type { Task } from "@/types/task";
import type { Question } from "@/types/question";
import type { ExamAttempt } from "@/types/exam";
import type { WrongQuestionIndex } from "@/types/wrongIndex";
import type { GameSession } from "@/types/game";
import type { AppSettings } from "@/types/settings";
import type { Achievement, AchievementProgress } from "@/types/achievement";
import type { StudyMaterial } from "@/types/studyMaterial";
import type { MaterialDefinition, MaterialProgress } from "@/types/materialRecord";
import type { CareState } from "@/types/careState";
import type { DomainEvent } from "@/types/domainEvent";
import { legacyStudyMaterialToRecords } from "@/lib/materials/legacyMigration";

export class PhoenixDB extends Dexie {
  dailyLogs!: Table<DailyLog, string>;
  tasks!: Table<Task, string>;
  questions!: Table<Question, string>;
  examAttempts!: Table<ExamAttempt, string>;
  wrongIndex!: Table<WrongQuestionIndex, string>;
  gameSessions!: Table<GameSession, string>;
  settings!: Table<AppSettings, string>;
  achievements!: Table<Achievement, string>;
  studyMaterials!: Table<StudyMaterial, string>;
  materialDefinitions!: Table<MaterialDefinition, string>;
  materialProgress!: Table<MaterialProgress, string>;
  achievementProgress!: Table<AchievementProgress, string>;
  careState!: Table<CareState, string>;
  domainEvents!: Table<DomainEvent, string>;

  constructor(name = "phoenix_life_exam_db") {
    super(name);
    this.version(1).stores({
      dailyLogs: "date",
      tasks: "id, done, dueTime, category",
      questions: "questionId, subject, topic, type",
      examAttempts: "attemptId, dateTimeStart, mode",
      wrongIndex: "questionId, severity, nextReviewAt",
      gameSessions: "sessionId, gameType, dateTimeStart",
      settings: "id",
      achievements: "id",
    });
    this.version(2).stores({
      dailyLogs: "date",
      tasks: "id, done, dueTime, category",
      questions: "questionId, subject, topic, type",
      examAttempts: "attemptId, dateTimeStart, mode",
      wrongIndex: "questionId, severity, nextReviewAt",
      gameSessions: "sessionId, gameType, dateTimeStart",
      settings: "id",
      achievements: "id",
      studyMaterials: "id, updatedAt, lastOpenedAt, format",
    });
    this.version(3)
      .stores({
        dailyLogs: "date",
        tasks: "id, done, dueTime, category",
        questions: "questionId, subject, topic, type",
        examAttempts: "attemptId, dateTimeStart, mode",
        wrongIndex: "questionId, severity, nextReviewAt",
        gameSessions: "sessionId, gameType, dateTimeStart",
        settings: "id",
        achievements: "id",
        studyMaterials: "id, updatedAt, lastOpenedAt, format",
        materialDefinitions: "slug, version, updatedAt, subject, kind",
        materialProgress: "materialSlug, lastOpenedAt, overallProgress, isActive",
      })
      .upgrade(async (transaction) => {
        const legacyMaterials = (await transaction.table("studyMaterials").toArray()) as StudyMaterial[];
        if (legacyMaterials.length === 0) return;

        const definitions = transaction.table("materialDefinitions") as Table<MaterialDefinition, string>;
        const progressTable = transaction.table("materialProgress") as Table<MaterialProgress, string>;
        const converted = legacyMaterials.map(legacyStudyMaterialToRecords);
        await definitions.bulkPut(converted.map((item) => item.definition));
        await progressTable.bulkPut(converted.map((item) => item.progress));
      });
    this.version(4).stores({
      dailyLogs: "date",
      tasks: "id, done, dueTime, category",
      questions: "questionId, subject, topic, type",
      examAttempts: "attemptId, dateTimeStart, mode",
      wrongIndex: "questionId, severity, nextReviewAt",
      gameSessions: "sessionId, gameType, dateTimeStart",
      settings: "id",
      achievements: "id",
      achievementProgress: "achievementId, updatedAt",
      careState: "id",
      domainEvents: "id, type, occurredAt, materialSlug, chapterKey",
      studyMaterials: "id, updatedAt, lastOpenedAt, format",
      materialDefinitions: "slug, version, updatedAt, subject, kind",
      materialProgress: "materialSlug, lastOpenedAt, overallProgress, isActive",
    });
  }
}

export const db = new PhoenixDB();
