import { z } from "zod";
import { medicationCheckSchema } from "./medication";

const mealItemSchema = z.object({
  eaten: z.boolean(),
  note: z.string().optional(),
});

export const dailyLogSchema = z.object({
  date: z.string(),
  sleepHours: z.number().optional(),
  waterIntakeMl: z.number().optional(),
  meals: z
    .object({
      breakfast: mealItemSchema.optional(),
      lunch: mealItemSchema.optional(),
      dinner: mealItemSchema.optional(),
    })
    .optional(),
  bodyState: z.string().optional(),
  moodTag: z.string().optional(),
  medications: z.array(medicationCheckSchema).optional(),
  studySummary: z
    .object({
      totalStudyMinutes: z.number().optional(),
      subjectsSummary: z
        .array(
          z.object({
            subject: z.string(),
            questions: z.number(),
            minutes: z.number(),
          }),
        )
        .optional(),
      focusQuality: z.number().optional(),
    })
    .optional(),
  tasksSummary: z
    .object({
      completionRate: z.number().optional(),
      topUndoneTitles: z.array(z.string()).optional(),
    })
    .optional(),
  gameSummary: z
    .object({
      agitationIndex: z.number().optional(),
      fatigueIndex: z.number().optional(),
      focusIndex: z.number().optional(),
      totalGameMinutes: z.number().optional(),
    })
    .optional(),
  noteForHelel: z.string().optional(),
});

export type DailyLog = z.infer<typeof dailyLogSchema>;
