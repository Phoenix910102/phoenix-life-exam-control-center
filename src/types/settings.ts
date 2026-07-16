import { z } from "zod";
import { campaignReadingModeValues } from "@/components/campaign/theme/campaign-theme.types";
import { intensitySchema } from "./task";

export const appSettingsSchema = z.object({
  id: z.literal("singleton").default("singleton"),
  notifications: z.object({
    enabled: z.boolean(),
    quietHours: z.object({
      start: z.number().min(0).max(23),
      end: z.number().min(0).max(23),
    }),
    types: z.object({
      meds: z.boolean(),
      task: z.boolean(),
      study: z.boolean(),
      life: z.boolean(),
      mood: z.boolean(),
    }),
    intensity: intensitySchema,
  }),
  backups: z.object({
    scheduleTimes: z.array(z.string()),
  }),
  models: z.object({
    helelModel: z.string(),
    parserModel: z.string(),
  }),
  campaign: z.object({
    readingMode: z.enum(campaignReadingModeValues),
  }),
});

export type AppSettings = z.infer<typeof appSettingsSchema>;

export const defaultSettings: AppSettings = {
  id: "singleton",
  notifications: {
    enabled: true,
    quietHours: { start: 23, end: 7 },
    types: { meds: true, task: true, study: true, life: true, mood: true },
    intensity: "standard",
  },
  backups: {
    scheduleTimes: ["09:30", "15:30", "23:30"],
  },
  models: {
    helelModel: "gpt-5.2",
    parserModel: "gpt-5.2",
  },
  campaign: {
    readingMode: "reading",
  },
};
