import { db } from "@/lib/db/client";
import { legacyStudyMaterialToRecords } from "@/lib/materials/legacyMigration";
import { exportDataSchema } from "@/types/exportData";

export async function restoreFullBackup(input: unknown) {
  const data = exportDataSchema.parse(input);
  const convertedLegacy = data.materialDefinitions.length === 0
    ? data.studyMaterials.map(legacyStudyMaterialToRecords)
    : [];
  const definitions = data.materialDefinitions.length > 0
    ? data.materialDefinitions
    : convertedLegacy.map((item) => item.definition);
  const progress = data.materialProgress.length > 0
    ? data.materialProgress
    : convertedLegacy.map((item) => item.progress);

  await db.transaction(
    "rw",
    [
      db.dailyLogs,
      db.tasks,
      db.questions,
      db.examAttempts,
      db.wrongIndex,
      db.gameSessions,
      db.achievements,
      db.achievementProgress,
      db.careState,
      db.domainEvents,
      db.settings,
      db.studyMaterials,
      db.materialDefinitions,
      db.materialProgress,
      db.legalQuestionDefinitions,
      db.questionAttemptsV2,
      db.questionLearningStates,
      db.studySessions,
      db.reviewQueue,
      db.materialNotes,
      db.materialBookmarks,
      db.materialHighlights,
      db.contentPatchDrafts,
      db.contentReleases,
    ],
    async () => {
      await Promise.all([
        db.dailyLogs.clear(),
        db.tasks.clear(),
        db.questions.clear(),
        db.examAttempts.clear(),
        db.wrongIndex.clear(),
        db.gameSessions.clear(),
        db.achievements.clear(),
        db.achievementProgress.clear(),
        db.careState.clear(),
        db.domainEvents.clear(),
        db.settings.clear(),
        db.studyMaterials.clear(),
        db.materialDefinitions.clear(),
        db.materialProgress.clear(),
        db.legalQuestionDefinitions.clear(),
        db.questionAttemptsV2.clear(),
        db.questionLearningStates.clear(),
        db.studySessions.clear(),
        db.reviewQueue.clear(),
        db.materialNotes.clear(),
        db.materialBookmarks.clear(),
        db.materialHighlights.clear(),
        db.contentPatchDrafts.clear(),
        db.contentReleases.clear(),
      ]);
      await db.dailyLogs.bulkPut(data.dailyLogs);
      await db.tasks.bulkPut(data.tasks);
      await db.questions.bulkPut(data.questions);
      await db.examAttempts.bulkPut(data.examAttempts);
      await db.wrongIndex.bulkPut(data.wrongIndex);
      await db.gameSessions.bulkPut(data.gameSessions);
      await db.achievements.bulkPut(data.achievements);
      await db.achievementProgress.bulkPut(data.achievementProgress);
      if (data.careState) await db.careState.put(data.careState);
      await db.domainEvents.bulkPut(data.domainEvents);
      await db.settings.put(data.settings);
      await db.studyMaterials.bulkPut(data.studyMaterials);
      await db.materialDefinitions.bulkPut(definitions);
      await db.materialProgress.bulkPut(progress);
      await db.legalQuestionDefinitions.bulkPut(data.legalQuestionDefinitions);
      await db.questionAttemptsV2.bulkPut(data.questionAttemptsV2);
      await db.questionLearningStates.bulkPut(data.questionLearningStates);
      await db.studySessions.bulkPut(data.studySessions);
      await db.reviewQueue.bulkPut(data.reviewQueue);
      await db.materialNotes.bulkPut(data.materialNotes);
      await db.materialBookmarks.bulkPut(data.materialBookmarks);
      await db.materialHighlights.bulkPut(data.materialHighlights);
      await db.contentPatchDrafts.bulkPut(data.contentPatchDrafts);
      await db.contentReleases.bulkPut(data.contentReleases);
    },
  );

  return {
    questions: data.questions.length,
    materialDefinitions: definitions.length,
    materialProgress: progress.length,
    achievements: data.achievements.length,
    domainEvents: data.domainEvents.length,
    legalQuestionDefinitions: data.legalQuestionDefinitions.length,
    questionAttemptsV2: data.questionAttemptsV2.length,
    studySessions: data.studySessions.length,
    restoredAt: new Date().toISOString(),
  };
}
