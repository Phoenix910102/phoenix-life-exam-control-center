import { describe, expect, it } from "vitest";
import { aiapJuniorPastQuestions } from "@/lib/exams/aiapJuniorPastQuestions";
import { getAiapQuestionBank } from "@/lib/exams/aiapQuestionBanks";

describe("AIAP junior official past questions", () => {
  it("contains both complete 114 fourth-session subjects", () => {
    expect(aiapJuniorPastQuestions).toHaveLength(100);
    expect(aiapJuniorPastQuestions.filter((question) => question.subject === "AIAP 初級 第一科")).toHaveLength(50);
    expect(aiapJuniorPastQuestions.filter((question) => question.subject === "AIAP 初級 第二科")).toHaveLength(50);
  });

  it("uses stable unique IDs and complete single-choice answers", () => {
    const ids = aiapJuniorPastQuestions.map((question) => question.questionId);
    expect(new Set(ids).size).toBe(100);

    for (const question of aiapJuniorPastQuestions) {
      expect(question.questionId).toMatch(/^aiap-junior-114-4-[12]-\d{3}$/);
      expect(question.options).toHaveLength(4);
      expect(question.answer).toMatch(/^[A-D]$/);
      expect(question.tags).toEqual(expect.arrayContaining(["AIAP", "初級", "114年第四次", "考古題"]));
      expect(question.source).toContain("初級 AI 應用規劃師");
    }
  });

  it("registers the junior bank without changing the intermediate default", () => {
    expect(getAiapQuestionBank("junior-official").questions).toHaveLength(100);
    expect(getAiapQuestionBank(undefined).id).toBe("official");
  });
});
