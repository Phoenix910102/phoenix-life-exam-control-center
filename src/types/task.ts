import { z } from "zod";

export const taskCategorySchema = z.enum(["study", "meds", "life", "admin", "other"]);
export const taskImportanceSchema = z.enum(["low", "normal", "high"]);
export const escalationProfileSchema = z.enum(["none", "soft", "aggressive"]);
export const intensitySchema = z.enum(["gentle", "standard", "strict"]);

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  category: taskCategorySchema,
  dueTime: z.string().datetime().nullable(),
  importance: taskImportanceSchema,
  escalationProfile: escalationProfileSchema,
  intensity: intensitySchema,
  done: z.boolean(),
  doneAt: z.string().datetime().optional(),
});

export const taskDraftSchema = z.object({
  title: z.string().min(1),
  category: taskCategorySchema.default("other"),
  dueTime: z.string().optional().nullable(),
  importance: taskImportanceSchema.default("normal"),
  escalationProfile: escalationProfileSchema.default("none"),
  intensity: intensitySchema.default("standard"),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskDraft = z.infer<typeof taskDraftSchema>;
