import { describe, expect, it } from "vitest";
import { answerKey, correctAnswerKey, isQuestionAnswerCorrect } from "@/lib/exams/answer";
import type { Question } from "@/types/question";

const question: Question = {
  questionId: "q1",
  subject: "AIAP",
  topic: "NLP",
  type: "single",
  stem: "x",
  options: ["A. alpha", "B. beta", "C. gamma", "D. delta"],
  answer: "B",
};

describe("exam answer helpers", () => {
  it("normalizes full option labels to answer keys", () => {
    expect(answerKey("B. beta")).toBe("B");
    expect(answerKey("(C) gamma")).toBe("C");
  });

  it("checks a selected option against a letter answer", () => {
    expect(isQuestionAnswerCorrect(question, "B. beta")).toBe(true);
    expect(isQuestionAnswerCorrect(question, "D. delta")).toBe(false);
  });

  it("renders multi-answer keys compactly", () => {
    expect(correctAnswerKey({ ...question, answer: ["A. alpha", "C"] })).toBe("A, C");
  });
});
