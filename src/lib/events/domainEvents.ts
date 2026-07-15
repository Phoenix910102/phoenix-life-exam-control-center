import { db } from "@/lib/db/client";
import { newId } from "@/lib/utils/id";
import type { DomainEvent, NewDomainEvent } from "@/types/domainEvent";

export async function recordDomainEvent(input: NewDomainEvent): Promise<DomainEvent> {
  const event: DomainEvent = {
    ...input,
    id: newId("event"),
    occurredAt: input.occurredAt ?? new Date().toISOString(),
  };
  await db.domainEvents.put(event);
  return event;
}

export async function listRecentDomainEvents(limit = 50) {
  return db.domainEvents.orderBy("occurredAt").reverse().limit(limit).toArray();
}
