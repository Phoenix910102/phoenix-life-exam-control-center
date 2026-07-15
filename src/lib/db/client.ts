import Dexie, { type Table } from "dexie";
import type { DailyLog } from "@/types/dailyLog";
import type { Task } from "@/types/task";
import type { Question } from "@/types/question";
import type { ExamAttempt } from "@/types/exam";
import type { WrongQuestionIndex } from "@/types/wrongIndex";
import type { GameSession } from "@/types/game";
import type { AppSettings } from "@/types/settings";
import type { Achievement } from "@/types/achievement";
import type { StudyMaterial } from "@/types/studyMaterial";

class PhoenixDB extends Dexie {
  dailyLogs!: Table<DailyLog, string>;
  tasks!: Table<Task, string>;
  questions!: Table<Question, string>;
  examAttempts!: Table<ExamAttempt, string>;
  wrongIndex!: Table<WrongQuestionIndex, string>;
  gameSessions!: Table<GameSession, string>;
  settings!: Table<AppSettings, string>;
  achievements!: Table<Achievement, string>;
  studyMaterials!: Table<StudyMaterial, string>;

  constructor() {
    super("phoenix_life_exam_db");
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
  }
}

export const db = new PhoenixDB();
