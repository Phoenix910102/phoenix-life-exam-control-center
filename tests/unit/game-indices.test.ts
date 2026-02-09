import { describe, expect, it } from "vitest";
import { computeIndices } from "@/lib/games/computeIndices";

describe("game indices", () => {
  it("returns explainable indices", () => {
    const x = computeIndices([
      {
        sessionId: "s1",
        gameType: "tap_lock",
        dateTimeStart: new Date().toISOString(),
        dateTimeEnd: new Date().toISOString(),
        durationSec: 20,
        quit: false,
        metrics: { missed: 2, avgDeviationMs: 300 },
      },
      {
        sessionId: "s2",
        gameType: "focus_bet",
        dateTimeStart: new Date().toISOString(),
        dateTimeEnd: new Date().toISOString(),
        durationSec: 60,
        quit: false,
        metrics: { success: true, interruptions: 0 },
      },
    ]);

    expect(x.focusIndex).toBeGreaterThan(0);
    expect(x.agitationIndex).toBeGreaterThanOrEqual(0);
  });
});
