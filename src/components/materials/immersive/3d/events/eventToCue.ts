import { achievementDefinitions } from "@/lib/achievements/definitions";
import type { DomainEventReceipt } from "@/types/domainEvent";
import type { BattlefieldAnimationCue } from "./animationCues";

function numericPayload(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function achievementCue(eventId: string, achievementId: string, index: number): BattlefieldAnimationCue {
  const title = achievementDefinitions.find((item) => item.id === achievementId)?.title ?? "新成就";
  return {
    id: `${eventId}:achievement:${achievementId}:${index}`,
    type: "achievement",
    priority: 50,
    durationMs: 2200,
    intensity: 1,
    cinematic: true,
    announcement: `成就解鎖：${title}`,
  };
}

export function eventReceiptToCues(receipt: DomainEventReceipt): BattlefieldAnimationCue[] {
  const { event } = receipt;
  const cues: BattlefieldAnimationCue[] = [];

  if (event.type === "chapter.opened" && event.chapterKey) {
    cues.push({
      id: `${event.id}:focus`,
      type: "focus-zone",
      zoneKey: event.chapterKey,
      priority: 30,
      durationMs: 700,
      intensity: 0.45,
      cinematic: false,
      announcement: "鏡頭已移至目前章節。",
    });
  }

  if (event.type === "chapter.progress.changed" && event.chapterKey) {
    const previous = numericPayload(event.payload.previous, 0);
    const current = numericPayload(event.payload.current, previous);
    if (current !== previous) {
      cues.push({
        id: `${event.id}:progress`,
        type: current > previous ? "allied-advance" : "enemy-reinforcement",
        zoneKey: event.chapterKey,
        priority: 45,
        durationMs: 1000,
        intensity: Math.min(1, Math.max(0.3, Math.abs(current - previous) / 30)),
        cinematic: false,
        announcement: current > previous ? "前線已向前推進。" : "章節進度回撤，前線重新部署。",
      });
    }
  }

  if ((event.type === "quiz.correct" || event.type === "quiz.incorrect") && event.chapterKey) {
    const correct = event.type === "quiz.correct";
    cues.push({
      id: `${event.id}:quiz`,
      type: correct ? "allied-advance" : "enemy-reinforcement",
      zoneKey: event.chapterKey,
      priority: 55,
      durationMs: correct ? 1150 : 1050,
      intensity: 0.75,
      cinematic: false,
      announcement: correct ? "作答正確，己方推進。" : "作答未命中，敵方壓力上升。",
    });
  }

  if (event.type === "chapter.completed" && event.chapterKey) {
    cues.push({
      id: `${event.id}:secure`,
      type: "secure-zone",
      zoneKey: event.chapterKey,
      priority: 90,
      durationMs: 3200,
      intensity: 1,
      cinematic: true,
      announcement: "章節完成，據點已固守。",
    });
  }

  if (event.type === "care.water.confirmed" || event.type === "care.meal.confirmed") {
    cues.push({
      id: `${event.id}:supply`,
      type: "supply-replenished",
      priority: 40,
      durationMs: 1100,
      intensity: 0.7,
      cinematic: false,
      announcement: event.type === "care.water.confirmed" ? "飲水補給已送達。" : "餐食補給已送達。",
    });
  }

  if (event.type === "care.rest.started" || event.type === "care.rest.ended") {
    cues.push({
      id: `${event.id}:rest`,
      type: "rest-mode",
      priority: 35,
      durationMs: 900,
      intensity: event.type === "care.rest.started" ? 1 : 0.45,
      cinematic: false,
      announcement: event.type === "care.rest.started" ? "戰場已切換為低刺激休整模式。" : "休整結束，戰場恢復待命。",
    });
  }

  return cues.concat(receipt.achievementsUnlocked.map((id, index) => achievementCue(event.id, id, index)));
}

export function eventReceiptsToCues(receipts: DomainEventReceipt[]) {
  return receipts.flatMap(eventReceiptToCues);
}
