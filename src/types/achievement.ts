import { z } from "zod";

export const achievementSchema = z.object({
  id: z.string(),
  unlockedAt: z.string().datetime(),
  materialSlug: z.string().optional(),
  context: z.record(z.unknown()).optional(),
});

export const achievementProgressSchema = z.object({
  achievementId: z.string().min(1),
  current: z.number().nonnegative(),
  target: z.number().positive(),
  updatedAt: z.string().datetime(),
});

export const achievementCategorySchema = z.enum([
  "conquest",
  "stability",
  "recovery",
  "style",
  "care",
  "foundation",
]);

export const achievementTierSchema = z.enum(["bronze", "silver", "gold", "obsidian"]);

export type Achievement = z.infer<typeof achievementSchema>;
export type AchievementProgress = z.infer<typeof achievementProgressSchema>;
export type AchievementCategory = z.infer<typeof achievementCategorySchema>;
export type AchievementTier = z.infer<typeof achievementTierSchema>;
