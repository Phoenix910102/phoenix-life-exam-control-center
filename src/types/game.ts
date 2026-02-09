import { z } from "zod";

export const gameTypeSchema = z.enum([
  "tap_lock",
  "focus_bet",
  "card_repair",
  "tag_dump",
  "reaction_calm",
]);

export const gameSessionSchema = z.object({
  sessionId: z.string(),
  gameType: gameTypeSchema,
  dateTimeStart: z.string().datetime(),
  dateTimeEnd: z.string().datetime(),
  durationSec: z.number(),
  quit: z.boolean(),
  metrics: z.record(z.union([z.number(), z.string(), z.boolean()])),
  selfReport: z
    .object({
      moodBefore: z.string().optional(),
      moodAfter: z.string().optional(),
    })
    .optional(),
});

export type GameSession = z.infer<typeof gameSessionSchema>;
