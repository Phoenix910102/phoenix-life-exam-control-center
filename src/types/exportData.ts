import { z } from "zod";
import { dailyLogSchema } from "./dailyLog";
import { taskSchema } from "./task";
import { examAttemptSchema } from "./exam";
import { wrongQuestionIndexSchema } from "./wrongIndex";
import { gameSessionSchema } from "./game";
import { achievementProgressSchema, achievementSchema } from "./achievement";
import { appSettingsSchema } from "./settings";
import { studyMaterialSchema } from "./studyMaterial";
import { materialDefinitionSchema, materialProgressSchema } from "./materialRecord";
import { questionSchema } from "./question";
import { careStateSchema } from "./careState";
import { domainEventSchema } from "./domainEvent";
import {
  contentPatchDraftSchema,
  contentReleaseSchema,
  legalQuestionDefinitionV2Schema,
  legalReviewQueueItemSchema,
  materialBookmarkSchema,
  materialHighlightSchema,
  materialNoteSchema,
  questionAttemptV2Schema,
  questionLearningStateSchema,
  questionSessionStateSchema,
} from "./legalQuestion";

export const exportDataSchema = z.object({
  meta: z.object({
    userName: z.string().optional(),
    timezone: z.literal("Asia/Taipei"),
    appVersion: z.string(),
    createdAt: z.string().datetime(),
  }),
  dailyLogs: z.array(dailyLogSchema),
  tasks: z.array(taskSchema),
  questionBankMeta: z.object({
    bankVersion: z.string(),
    lastImportAt: z.string().datetime().optional(),
  }),
  questions: z.array(questionSchema).default([]),
  examAttempts: z.array(examAttemptSchema),
  wrongIndex: z.array(wrongQuestionIndexSchema),
  gameSessions: z.array(gameSessionSchema),
  achievements: z.array(achievementSchema),
  achievementProgress: z.array(achievementProgressSchema).default([]),
  careState: careStateSchema.optional(),
  domainEvents: z.array(domainEventSchema).default([]),
  studyMaterials: z.array(studyMaterialSchema).default([]),
  materialDefinitions: z.array(materialDefinitionSchema).default([]),
  materialProgress: z.array(materialProgressSchema).default([]),
  legalQuestionDefinitions: z.array(legalQuestionDefinitionV2Schema).default([]),
  questionAttemptsV2: z.array(questionAttemptV2Schema).default([]),
  questionLearningStates: z.array(questionLearningStateSchema).default([]),
  studySessions: z.array(questionSessionStateSchema).default([]),
  reviewQueue: z.array(legalReviewQueueItemSchema).default([]),
  materialNotes: z.array(materialNoteSchema).default([]),
  materialBookmarks: z.array(materialBookmarkSchema).default([]),
  materialHighlights: z.array(materialHighlightSchema).default([]),
  contentPatchDrafts: z.array(contentPatchDraftSchema).default([]),
  contentReleases: z.array(contentReleaseSchema).default([]),
  settings: appSettingsSchema,
});

export type ExportData = z.infer<typeof exportDataSchema>;
