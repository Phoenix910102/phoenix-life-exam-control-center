import { z } from "zod";
import { materialPackageChapterSchema, semverSchema } from "./materialPackage";
import { studyMaterialFormatSchema } from "./studyMaterial";

export const materialDefinitionSchema = z.object({
  kind: z.enum(["phoenix-package", "legacy"]),
  slug: z.string().min(1),
  schema: z.literal("phoenix.material.v1").optional(),
  version: semverSchema,
  title: z.string().min(1),
  description: z.string().default(""),
  subject: z.string().default("一般教材"),
  exam: z
    .object({
      name: z.string().min(1),
      level: z.string().min(1).optional(),
      session: z.string().min(1).optional(),
    })
    .optional(),
  language: z.string().default("zh-TW"),
  tags: z.array(z.string()).default([]),
  generatedAt: z.string().datetime().optional(),
  generator: z
    .object({
      name: z.string().min(1),
      version: z.string().min(1).optional(),
      model: z.string().min(1).optional(),
    })
    .optional(),
  format: z.union([studyMaterialFormatSchema, z.literal("phoenix-package")]),
  sourceFileName: z.string().min(1),
  mimeType: z.string(),
  sourceContent: z.string().optional(),
  contentEncoding: z.enum(["text", "data-url"]).optional(),
  chapters: z.array(materialPackageChapterSchema).min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const materialQuizAttemptSchema = z.object({
  chapterKey: z.string().min(1),
  blockIndex: z.number().int().nonnegative(),
  questionIndex: z.number().int().nonnegative(),
  selectedIndex: z.number().int().nonnegative(),
  correct: z.boolean(),
  attemptedAt: z.string().datetime(),
});

export const materialProgressSchema = z.object({
  materialSlug: z.string().min(1),
  activeChapterKey: z.string().min(1).optional(),
  chapterProgress: z.record(z.string(), z.number().min(0).max(100)).default({}),
  completedChapterKeys: z.array(z.string()).default([]),
  quizAttempts: z.array(materialQuizAttemptSchema).default([]),
  orphanedProgress: z.record(z.string(), z.number().min(0).max(100)).default({}),
  lastOpenedAt: z.string().datetime().optional(),
  overallProgress: z.number().min(0).max(100).default(0),
  isActive: z.boolean().default(false),
});

export type MaterialDefinition = z.infer<typeof materialDefinitionSchema>;
export type MaterialProgress = z.infer<typeof materialProgressSchema>;
export type MaterialQuizAttempt = z.infer<typeof materialQuizAttemptSchema>;

export type MaterialBundle = {
  definition: MaterialDefinition;
  progress: MaterialProgress;
};
