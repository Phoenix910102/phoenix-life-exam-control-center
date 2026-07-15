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
      db.examAttempts,
      db.wrongIndex,
      db.gameSessions,
      db.achievements,
      db.settings,
      db.studyMaterials,
      db.materialDefinitions,
      db.materialProgress,
    ],
    async () => {
      await Promise.all([
        db.dailyLogs.clear(),
        db.tasks.clear(),
        db.examAttempts.clear(),
        db.wrongIndex.clear(),
        db.gameSessions.clear(),
        db.achievements.clear(),
        db.settings.clear(),
        db.studyMaterials.clear(),
        db.materialDefinitions.clear(),
        db.materialProgress.clear(),
      ]);
      await db.dailyLogs.bulkPut(data.dailyLogs);
      await db.tasks.bulkPut(data.tasks);
      await db.examAttempts.bulkPut(data.examAttempts);
      await db.wrongIndex.bulkPut(data.wrongIndex);
      await db.gameSessions.bulkPut(data.gameSessions);
      await db.achievements.bulkPut(data.achievements);
      await db.settings.put(data.settings);
      await db.studyMaterials.bulkPut(data.studyMaterials);
      await db.materialDefinitions.bulkPut(definitions);
      await db.materialProgress.bulkPut(progress);
    },
  );

  return {
    materialDefinitions: definitions.length,
    materialProgress: progress.length,
    restoredAt: new Date().toISOString(),
  };
}
