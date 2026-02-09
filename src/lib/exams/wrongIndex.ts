import type { ExamAttempt } from "@/types/exam";
import type { WrongQuestionIndex } from "@/types/wrongIndex";

function calcNextReview(severity: number, nowIso: string): string | null {
  if (severity <= 0) return null;
  const now = new Date(nowIso);
  const next = new Date(now);
  if (severity === 3) next.setDate(now.getDate() + 1);
  else if (severity === 2) next.setDate(now.getDate() + 3);
  else next.setDate(now.getDate() + 7);
  return next.toISOString();
}

export function applyAttemptToWrongIndex(
  previous: WrongQuestionIndex | undefined,
  response: ExamAttempt["responses"][number],
  nowIso: string,
): WrongQuestionIndex {
  const base: WrongQuestionIndex =
    previous ?? {
      questionId: response.questionId,
      wrongCount: 0,
      severity: 0,
      nextReviewAt: null,
    };

  if (!response.isCorrect) {
    const severity = Math.min(3, base.severity + 1);
    return {
      ...base,
      wrongCount: base.wrongCount + 1,
      lastWrongAt: nowIso,
      severity,
      nextReviewAt: calcNextReview(severity, nowIso),
    };
  }

  const severity = Math.max(0, base.severity - 1);
  return {
    ...base,
    lastCorrectAt: nowIso,
    severity,
    nextReviewAt: calcNextReview(severity, nowIso),
  };
}
