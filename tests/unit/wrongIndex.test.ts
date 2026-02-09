import { describe, expect, it } from "vitest";
import { applyAttemptToWrongIndex } from "@/lib/exams/wrongIndex";

describe("wrong index update", () => {
  it("increments severity on wrong", () => {
    const x = applyAttemptToWrongIndex(undefined, { questionId: "q1", chosenAnswer: "A", isCorrect: false, timeSpentSec: 5 }, new Date().toISOString());
    expect(x.wrongCount).toBe(1);
    expect(x.severity).toBe(1);
    expect(x.nextReviewAt).toBeTruthy();
  });

  it("decrements severity on correct", () => {
    const x = applyAttemptToWrongIndex({ questionId: "q1", wrongCount: 2, severity: 2, nextReviewAt: null }, { questionId: "q1", chosenAnswer: "A", isCorrect: true, timeSpentSec: 5 }, new Date().toISOString());
    expect(x.severity).toBe(1);
  });
});
