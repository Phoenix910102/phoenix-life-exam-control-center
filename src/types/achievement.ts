import { z } from "zod";

export const achievementSchema = z.object({
  id: z.string(),
  unlockedAt: z.string().datetime(),
});

export type Achievement = z.infer<typeof achievementSchema>;
