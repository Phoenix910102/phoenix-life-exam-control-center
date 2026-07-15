import { processDomainEvent } from "@/lib/achievements/rules";
import { db } from "@/lib/db/client";
import { toTaipeiDateKey } from "@/lib/utils/date";
import type { CareState } from "@/types/careState";

const HYDRATION_INTERVAL_MS = 25 * 60 * 1000;

export function createDefaultCareState(now = new Date()): CareState {
  const nowIso = now.toISOString();
  const dateKey = toTaipeiDateKey(now);
  return {
    id: "singleton",
    hydration: {
      countToday: 0,
      countDate: dateKey,
      lastDrinkAt: nowIso,
      nextReminderAt: new Date(now.getTime() + HYDRATION_INTERVAL_MS).toISOString(),
    },
    meal: {
      countToday: 0,
      countDate: dateKey,
    },
    rest: { mode: "none" },
    updatedAt: nowIso,
  };
}

function normalizeCareState(state: CareState, now: Date): CareState {
  const dateKey = toTaipeiDateKey(now);
  const hydration = state.hydration.countDate === dateKey
    ? state.hydration
    : { ...state.hydration, countToday: 0, countDate: dateKey };
  const meal = state.meal.countDate === dateKey
    ? state.meal
    : { ...state.meal, countToday: 0, countDate: dateKey };
  const restExpired = state.rest.restUntil && new Date(state.rest.restUntil).getTime() <= now.getTime();
  return {
    ...state,
    hydration,
    meal,
    rest: restExpired ? { mode: "none" } : state.rest,
    updatedAt: now.toISOString(),
  };
}

export async function getCareState(now = new Date()) {
  const current = (await db.careState.get("singleton")) ?? createDefaultCareState(now);
  const normalized = normalizeCareState(current, now);
  await db.careState.put(normalized);
  return normalized;
}

export async function confirmHydration(now = new Date()) {
  const current = await getCareState(now);
  const next: CareState = {
    ...current,
    hydration: {
      countToday: current.hydration.countToday + 1,
      countDate: toTaipeiDateKey(now),
      lastDrinkAt: now.toISOString(),
      nextReminderAt: new Date(now.getTime() + HYDRATION_INTERVAL_MS).toISOString(),
    },
    updatedAt: now.toISOString(),
  };
  await db.careState.put(next);
  await processDomainEvent({ type: "care.water.confirmed", payload: { countToday: next.hydration.countToday } });
  return next;
}

export async function confirmMeal(now = new Date()) {
  const current = await getCareState(now);
  const next: CareState = {
    ...current,
    meal: {
      countToday: current.meal.countToday + 1,
      countDate: toTaipeiDateKey(now),
      lastMealAt: now.toISOString(),
    },
    updatedAt: now.toISOString(),
  };
  await db.careState.put(next);
  await processDomainEvent({ type: "care.meal.confirmed", payload: { countToday: next.meal.countToday } });
  return next;
}

export async function startRest(minutes = 30, now = new Date()) {
  const current = await getCareState(now);
  const next: CareState = {
    ...current,
    rest: {
      mode: minutes >= 30 ? "sleep" : "short-rest",
      restUntil: new Date(now.getTime() + minutes * 60 * 1000).toISOString(),
    },
    updatedAt: now.toISOString(),
  };
  await db.careState.put(next);
  await processDomainEvent({ type: "care.rest.started", payload: { minutes, restUntil: next.rest.restUntil } });
  return next;
}

export async function endRest(now = new Date()) {
  const current = await getCareState(now);
  const next: CareState = { ...current, rest: { mode: "none" }, updatedAt: now.toISOString() };
  await db.careState.put(next);
  await processDomainEvent({ type: "care.rest.ended", payload: {} });
  return next;
}
