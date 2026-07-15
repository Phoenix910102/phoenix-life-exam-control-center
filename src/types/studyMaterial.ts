import { z } from "zod";

export const studyMaterialFormatSchema = z.enum(["html", "pdf", "markdown", "text", "json"]);
export type StudyMaterialFormat = z.infer<typeof studyMaterialFormatSchema>;

export const studyMaterialChapterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int().nonnegative(),
  progress: z.number().min(0).max(100).default(0),
  completed: z.boolean().default(false),
  lastOpenedAt: z.string().datetime().optional(),
});

export const studyMaterialSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  format: studyMaterialFormatSchema,
  sourceFileName: z.string().min(1),
  mimeType: z.string(),
  sourceContent: z.string(),
  contentEncoding: z.enum(["text", "data-url"]),
  chapters: z.array(studyMaterialChapterSchema).min(1),
  activeChapterId: z.string().optional(),
  progressPercent: z.number().min(0).max(100).default(0),
  isActive: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastOpenedAt: z.string().datetime().optional(),
});

export type StudyMaterial = z.infer<typeof studyMaterialSchema>;
export type StudyMaterialChapter = z.infer<typeof studyMaterialChapterSchema>;
