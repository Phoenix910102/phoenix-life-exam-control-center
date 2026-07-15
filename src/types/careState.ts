import { z } from "zod";

export const careStateSchema = z.object({
  id: z.literal("singleton"),
  hydration: z.object({
    countToday: z.number().int().nonnegative(),
    countDate: z.string(),
    lastDrinkAt: z.string().datetime().optional(),
    nextReminderAt: z.string().datetime().optional(),
  }),
  meal: z.object({
    countToday: z.number().int().nonnegative(),
    countDate: z.string(),
    lastMealAt: z.string().datetime().optional(),
  }),
  rest: z.object({
    restUntil: z.string().datetime().optional(),
    mode: z.enum(["none", "short-rest", "sleep"]),
  }),
  updatedAt: z.string().datetime(),
});

export type CareState = z.infer<typeof careStateSchema>;
