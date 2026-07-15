import { afterEach, describe, expect, it } from "vitest";
import { eventReceiptToCues } from "@/components/materials/immersive/3d/events/eventToCue";
import { useBattlefield3DStore } from "@/components/materials/immersive/3d/store/useBattlefield3DStore";
import type { DomainEventReceipt } from "@/types/domainEvent";

function receipt(
  type: DomainEventReceipt["event"]["type"],
  options: Partial<DomainEventReceipt["event"]> = {},
  achievementsUnlocked: string[] = [],
): DomainEventReceipt {
  return {
    event: {
      id: options.id ?? `event-${type}`,
      type,
      occurredAt: options.occurredAt ?? "2026-07-16T04:00:00.000Z",
      materialSlug: options.materialSlug ?? "sample",
      chapterKey: options.chapterKey,
      payload: options.payload ?? {},
    },
    achievementsUnlocked,
  };
}

afterEach(() => useBattlefield3DStore.getState().clear());

describe("battlefield event cues", () => {
  it("maps correct and incorrect answers to opposing battlefield movement", () => {
    const correct = eventReceiptToCues(receipt("quiz.correct", { chapterKey: "position" }));
    const incorrect = eventReceiptToCues(receipt("quiz.incorrect", { chapterKey: "position" }));

    expect(correct).toEqual([expect.objectContaining({ type: "allied-advance", zoneKey: "position" })]);
    expect(incorrect).toEqual([expect.objectContaining({ type: "enemy-reinforcement", zoneKey: "position" })]);
  });

  it("creates a cinematic secure cue and a named achievement cue", () => {
    const cues = eventReceiptToCues(receipt(
      "chapter.completed",
      { chapterKey: "position" },
      ["chapter_conqueror"],
    ));

    expect(cues).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "secure-zone", cinematic: true, priority: 90 }),
      expect.objectContaining({ type: "achievement", announcement: "成就解鎖：據點收復", priority: 50 }),
    ]));
  });

  it("keeps care cues global so the active zone can receive supplies", () => {
    const [cue] = eventReceiptToCues(receipt("care.water.confirmed"));
    expect(cue).toMatchObject({ type: "supply-replenished" });
    expect(cue.zoneKey).toBeUndefined();
  });

  it("deduplicates cues and starts higher-priority cinematics first", () => {
    const store = useBattlefield3DStore.getState();
    const low = eventReceiptToCues(receipt("chapter.opened", { id: "focus", chapterKey: "position" }));
    const high = eventReceiptToCues(receipt("chapter.completed", { id: "secure", chapterKey: "position" }));
    store.enqueue([...low, ...high, ...low]);

    useBattlefield3DStore.getState().beginNext();
    expect(useBattlefield3DStore.getState().activeCue?.type).toBe("secure-zone");
    expect(useBattlefield3DStore.getState().queue).toHaveLength(1);
  });
});
