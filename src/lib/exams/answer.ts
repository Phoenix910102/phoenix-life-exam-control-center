import type { Question } from "@/types/question";

export function answerKey(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().toUpperCase();
  const match = trimmed.match(/^\(?([A-D])(?:[.)、．]|$)/);
  return match?.[1] ?? trimmed;
}

export function isQuestionAnswerCorrect(question: Question, chosenAnswer: string): boolean {
  const chosen = answerKey(chosenAnswer);
  const answer = question.answer;

  if (Array.isArray(answer)) {
    return answer.map(answerKey).includes(chosen);
  }

  return answerKey(answer) === chosen;
}

export function correctAnswerKey(question: Question): string {
  if (Array.isArray(question.answer)) {
    return question.answer.map(answerKey).join(", ");
  }

  return answerKey(question.answer);
}
