import { z } from "zod";

export const wrongQuestionIndexSchema = z.object({
  questionId: z.string(),
  wrongCount: z.number(),
  lastWrongAt: z.string().datetime().optional(),
  lastCorrectAt: z.string().datetime().optional(),
  severity: z.number().min(0).max(3),
  nextReviewAt: z.string().datetime().nullable().optional(),
});

export type WrongQuestionIndex = z.infer<typeof wrongQuestionIndexSchema>;
