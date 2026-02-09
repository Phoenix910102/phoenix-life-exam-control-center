import { z } from "zod";
import { intensitySchema } from "@/types/task";

export const helelTriggerSchema = z.enum([
  "task_publish",
  "task_nudge",
  "med_reminder",
  "study_prompt",
  "life_prompt",
  "exam_review",
]);

export const helelRequestSchema = z.object({
  trigger: helelTriggerSchema,
  intensity: intensitySchema,
  attempt: z.number().nullable().optional(),
  model: z.string().nullable().optional(),
  userStateSummary: z.string().min(1),
  payload: z.record(z.any()).nullable().optional(),
});

export const helelResponseSchema = z.object({
  message: z.string(),
  cta: z.string(),
  toneTag: z.enum(["soft", "firm", "strict", "praise", "protect"]),
  handoffHint: z.enum(["none", "suggest_upload_snapshot", "suggest_review_exam"]),
});

export type HelelRequest = z.infer<typeof helelRequestSchema>;
export type HelelResponse = z.infer<typeof helelResponseSchema>;
