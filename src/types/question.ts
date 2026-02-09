import { z } from "zod";

export const questionTypeSchema = z.enum(["single", "multi", "short", "essay"]);

export const questionSchema = z.object({
  questionId: z.string(),
  subject: z.string().min(1),
  topic: z.string().min(1),
  type: questionTypeSchema,
  stem: z.string().min(1),
  options: z.array(z.string()).optional(),
  answer: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  explanation: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.number().min(0).max(10).nullable().optional(),
  source: z.string().nullable().optional(),
});

export const questionDraftSchema = questionSchema.omit({ questionId: true }).extend({
  questionId: z.string().optional(),
});

export type Question = z.infer<typeof questionSchema>;
export type QuestionDraft = z.infer<typeof questionDraftSchema>;
