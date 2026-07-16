import { z } from "zod";

export const domainEventTypeSchema = z.enum([
  "material.imported",
  "material.updated",
  "material.opened",
  "chapter.opened",
  "chapter.progress.changed",
  "chapter.completed",
  "quiz.attempted",
  "quiz.correct",
  "quiz.incorrect",
  "achievement.unlocked",
  "care.water.confirmed",
  "care.meal.confirmed",
  "care.rest.started",
  "care.rest.ended",
]);

export const domainEventSchema = z.object({
  id: z.string().min(1),
  type: domainEventTypeSchema,
  occurredAt: z.string().datetime(),
  materialSlug: z.string().optional(),
  chapterKey: z.string().optional(),
  payload: z.record(z.unknown()).default({}),
});

export type DomainEventType = z.infer<typeof domainEventTypeSchema>;
export type DomainEvent = z.infer<typeof domainEventSchema>;
export type NewDomainEvent = Omit<DomainEvent, "id" | "occurredAt"> & {
  occurredAt?: string;
};

export type DomainEventReceipt = {
  event: DomainEvent;
  achievementsUnlocked: string[];
};
