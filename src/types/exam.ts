import { z } from "zod";

export const examResponseSchema = z.object({
  questionId: z.string(),
  chosenAnswer: z.any(),
  isCorrect: z.boolean(),
  timeSpentSec: z.number().min(0),
  confidence: z.number().optional(),
  markedTags: z.array(z.string()).optional(),
});

export const examAttemptSchema = z.object({
  attemptId: z.string(),
  dateTimeStart: z.string().datetime(),
  dateTimeEnd: z.string().datetime(),
  mode: z.enum(["quick", "chapter", "mock"]),
  config: z.object({
    subject: z.string().optional(),
    topic: z.string().optional(),
    timeLimitSec: z.number().optional(),
    numQuestions: z.number(),
    seed: z.string().optional(),
  }),
  results: z.object({
    totalQuestions: z.number(),
    correctCount: z.number(),
    score: z.number(),
    durationSec: z.number(),
  }),
  responses: z.array(examResponseSchema),
});

export type ExamAttempt = z.infer<typeof examAttemptSchema>;
export type ExamResponse = z.infer<typeof examResponseSchema>;
