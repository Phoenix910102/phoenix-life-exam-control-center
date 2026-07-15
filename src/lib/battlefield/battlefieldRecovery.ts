import type { MaterialQuizAttempt } from "@/types/materialRecord";

export function questionAttemptKey(attempt: MaterialQuizAttempt) {
  return `${attempt.chapterKey}:${attempt.blockIndex}:${attempt.questionIndex}`;
}

export function latestAttemptsByQuestion(attempts: MaterialQuizAttempt[]) {
  const latest = new Map<string, MaterialQuizAttempt>();

  for (const attempt of attempts) {
    const key = questionAttemptKey(attempt);
    const previous = latest.get(key);
    if (!previous || previous.attemptedAt <= attempt.attemptedAt) latest.set(key, attempt);
  }

  return [...latest.values()];
}
