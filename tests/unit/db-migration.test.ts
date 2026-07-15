import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { PhoenixDB } from "@/lib/db/client";
import type { StudyMaterial } from "@/types/studyMaterial";

const databaseNames: string[] = [];

afterEach(async () => {
  await Promise.all(databaseNames.splice(0).map((name) => Dexie.delete(name)));
});

describe("Dexie material migration", () => {
  it("upgrades a real v2 database to v3 and preserves legacy progress", async () => {
    const name = `phoenix-migration-${crypto.randomUUID()}`;
    databaseNames.push(name);
    const legacyDb = new Dexie(name);
    legacyDb.version(1).stores({
      dailyLogs: "date",
      tasks: "id, done, dueTime, category",
      questions: "questionId, subject, topic, type",
      examAttempts: "attemptId, dateTimeStart, mode",
      wrongIndex: "questionId, severity, nextReviewAt",
      gameSessions: "sessionId, gameType, dateTimeStart",
      settings: "id",
      achievements: "id",
    });
    legacyDb.version(2).stores({
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
    await legacyDb.open();

    const now = new Date().toISOString();
    const material: StudyMaterial = {
      id: "criminal-law-v2",
      title: "罪責之骨",
      format: "html",
      sourceFileName: "criminal-law.html",
      mimeType: "text/html",
      sourceContent: "<h1>罪責之骨</h1>",
      contentEncoding: "text",
      chapters: [
        { id: "map", title: "刑總地圖", order: 0, progress: 65, completed: false },
        { id: "three-layers", title: "犯罪三階層", order: 1, progress: 100, completed: true },
      ],
      activeChapterId: "map",
      progressPercent: 83,
      isActive: true,
      tags: ["刑法"],
      createdAt: now,
      updatedAt: now,
    };
    await legacyDb.table("studyMaterials").put(material);
    legacyDb.close();

    const upgraded = new PhoenixDB(name);
    await upgraded.open();
    expect(upgraded.verno).toBe(3);
    expect(await upgraded.studyMaterials.get(material.id)).toBeDefined();
    expect(await upgraded.materialDefinitions.get("legacy-criminal-law-v2")).toMatchObject({
      title: "罪責之骨",
      kind: "legacy",
    });
    expect(await upgraded.materialProgress.get("legacy-criminal-law-v2")).toMatchObject({
      chapterProgress: {
        "legacy-map": 65,
        "legacy-three-layers": 100,
      },
      completedChapterKeys: ["legacy-three-layers"],
      overallProgress: 83,
      isActive: true,
    });
    upgraded.close();
  });
});
