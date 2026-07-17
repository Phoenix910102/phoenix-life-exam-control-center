import type {
  LegalErrorCategory,
  LegalQuestionDefinitionV2,
  QuestionAttemptV2,
  QuestionLearningState,
  QuestionSessionState,
} from "@/types/legalQuestion";

export function latestAnswerRevision(question: LegalQuestionDefinitionV2) {
  return [...question.answerRevisions].sort((a, b) => b.effectiveAt.localeCompare(a.effectiveAt))[0];
}

export function optionKeysMatch(left: string[], right: string[]) {
  return left.length === right.length && [...left].sort().every((key, index) => key === [...right].sort()[index]);
}

export function classifyLegalAttempt(
  question: LegalQuestionDefinitionV2,
  session: QuestionSessionState,
  correct: boolean,
): LegalErrorCategory[] {
  const categories = new Set<LegalErrorCategory>();
  if (question.negativeStem && !session.current.negativeLocked) categories.add("negative-not-locked");
  if (session.current.selectedSignals.length === 0) categories.add("stem-signal-missed");
  if (session.current.changedAnswer && !correct) categories.add("option-contamination");
  if (question.primaryIssueRef && session.current.issuePrediction !== question.primaryIssueRef) categories.add("layer-confusion");
  if (!correct) categories.add("knowledge-gap");
  if (correct && ["guess", "unreadable"].includes(session.current.confidence ?? "")) categories.add("lucky-correct");
  return [...categories];
}

export function deriveLearningState(
  previous: QuestionLearningState | undefined,
  attempt: QuestionAttemptV2,
): QuestionLearningState {
  const attemptCount = (previous?.attemptCount ?? 0) + 1;
  const correctCount = (previous?.correctCount ?? 0) + Number(attempt.correct);
  const evidence = attempt.correct
    ? attempt.confidence === "certain" && attempt.hintLevel === 0 ? 24 : 10
    : -18;
  const mastery = Math.max(0, Math.min(100, Math.round((previous?.mastery ?? 20) + evidence)));
  const unresolved = !attempt.correct || attempt.errorCategories.includes("lucky-correct");
  const nextReviewAt = unresolved
    ? new Date(Date.parse(attempt.attemptedAt) + (attempt.correct ? 3 : 1) * 86_400_000).toISOString()
    : undefined;
  return {
    questionKey: attempt.questionKey,
    mastery,
    attemptCount,
    correctCount,
    latestCorrect: attempt.correct,
    unresolved,
    lastAttemptAt: attempt.attemptedAt,
    nextReviewAt,
    errorCategories: attempt.errorCategories,
  };
}
