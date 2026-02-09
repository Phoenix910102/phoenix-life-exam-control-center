import { z } from "zod";
import { dailyLogSchema } from "./dailyLog";
import { taskSchema } from "./task";
import { examAttemptSchema } from "./exam";
import { wrongQuestionIndexSchema } from "./wrongIndex";
import { gameSessionSchema } from "./game";
import { achievementSchema } from "./achievement";
import { appSettingsSchema } from "./settings";

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
  examAttempts: z.array(examAttemptSchema),
  wrongIndex: z.array(wrongQuestionIndexSchema),
  gameSessions: z.array(gameSessionSchema),
  achievements: z.array(achievementSchema),
  settings: appSettingsSchema,
});

export type ExportData = z.infer<typeof exportDataSchema>;
