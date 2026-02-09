import { z } from "zod";

export const medicationTimeSchema = z.enum(["morning", "noon", "evening", "other"]);

export const medicationCheckSchema = z.object({
  name: z.string().min(1),
  timeOfDay: medicationTimeSchema,
  taken: z.boolean(),
});

export type MedicationCheck = z.infer<typeof medicationCheckSchema>;
