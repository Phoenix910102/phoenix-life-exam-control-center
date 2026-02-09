import { z } from "zod";
import { taskDraftSchema } from "@/types/task";
import { questionDraftSchema } from "@/types/question";

export const ingestTaskSchema = taskDraftSchema.extend({
  withHelelLine: z.boolean().optional(),
  model: z.string().optional().nullable(),
});

export const ingestQuestionSchema = z.union([
  z.object({
    mode: z.literal("structured"),
    questionDraft: questionDraftSchema,
  }),
  z.object({
    mode: z.literal("raw"),
    rawText: z.string().min(1),
    model: z.string().optional().nullable(),
  }),
]);

export const ingestQuestionInboxSchema = z.object({
  text: z.string().min(1),
  format: z.enum(["md", "csv", "auto"]).default("auto"),
  model: z.string().nullable().optional(),
});
