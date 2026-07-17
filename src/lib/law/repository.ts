import { db } from "@/lib/db/client";
import { classifyLegalAttempt, deriveLearningState, latestAnswerRevision, optionKeysMatch } from "@/lib/law/diagnosis";
import { legalQuestionSeeds, legalSessionSeedQuestionKeys } from "@/lib/law/sampleQuestions";
import { createQuestionSession, transitionQuestionSession, type QuestionSessionEvent } from "@/lib/law/questionSession";
import type {
  LegalQuestionDefinitionV2,
  QuestionAttemptV2,
  QuestionSessionState,
} from "@/types/legalQuestion";

export async function ensureLegalQuestionSeeds() {
  return db.transaction("rw", db.legalQuestionDefinitions, async () => {
    const existing = new Set((await db.legalQuestionDefinitions.bulkGet(legalQuestionSeeds.map((question) => question.key)))
      .filter(Boolean)
      .map((question) => question?.key));
    const missing = legalQuestionSeeds.filter((question) => !existing.has(question.key));
    if (missing.length > 0) await db.legalQuestionDefinitions.bulkAdd(missing);
    return { added: missing.length, total: await db.legalQuestionDefinitions.count() };
  });
}

export async function listLegalQuestions(subjectKey?: string) {
  if (!subjectKey) return db.legalQuestionDefinitions.toArray();
  return db.legalQuestionDefinitions.where("subjectKey").equals(subjectKey).toArray();
}

export async function getLegalQuestion(key: string) {
  return db.legalQuestionDefinitions.get(key);
}

function sessionId() {
  return `law-session:${Date.now()}:${Math.random().toString(36).slice(2, 9)}`;
}

export async function createLegalStudySession() {
  await ensureLegalQuestionSeeds();
  const session = createQuestionSession({
    sessionId: sessionId(),
    subjectKey: "criminal-law",
    questionKeys: legalSessionSeedQuestionKeys,
  });
  await db.studySessions.add(session);
  return session;
}

export async function getLegalStudySession(id: string) {
  return db.studySessions.get(id);
}

export async function getLatestActiveLegalStudySession() {
  const active = await db.studySessions.where("status").equals("active").toArray();
  return active.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
}

export async function createOrResumeLegalStudySession(requestedSessionId?: string) {
  await ensureLegalQuestionSeeds();
  if (requestedSessionId) {
    const requested = await getLegalStudySession(requestedSessionId);
    if (requested) return requested;
  }
  const active = await getLatestActiveLegalStudySession();
  return active ?? createLegalStudySession();
}

export async function transitionAndSaveLegalSession(
  session: QuestionSessionState,
  event: QuestionSessionEvent,
) {
  const next = transitionQuestionSession(session, event);
  await db.studySessions.put(next);
  return next;
}

export async function setLegalSessionMode(
  session: QuestionSessionState,
  mode: QuestionSessionState["mode"],
) {
  const next = { ...session, mode, updatedAt: new Date().toISOString() };
  await db.studySessions.put(next);
  return next;
}

export async function getSessionQuestions(session: QuestionSessionState) {
  const keys = new Set(session.questionKeys);
  const questions = await db.legalQuestionDefinitions.toArray();
  return questions.filter((question) => keys.has(question.key) || session.questionKeys.includes(question.variantOf ?? ""));
}

export async function recordLegalQuestionAttempt(
  session: QuestionSessionState,
  question: LegalQuestionDefinitionV2,
) {
  const attemptId = `attempt:${session.sessionId}:${question.key}`;
  const existing = await db.questionAttemptsV2.get(attemptId);
  if (existing) return existing;
  const answerRevision = latestAnswerRevision(question);
  const correct = optionKeysMatch(session.current.finalSelectedOptionKeys, answerRevision.correctOptionKeys);
  const attemptedAt = new Date().toISOString();
  const errorCategories = classifyLegalAttempt(question, session, correct);
  const attempt: QuestionAttemptV2 = {
    attemptId,
    sessionId: session.sessionId,
    questionKey: question.key,
    answerRevisionId: answerRevision.id,
    firstSelectedOptionKeys: session.current.firstSelectedOptionKeys,
    finalSelectedOptionKeys: session.current.finalSelectedOptionKeys,
    correct,
    confidence: session.current.confidence ?? "unreadable",
    issuePrediction: session.current.issuePrediction,
    negativeLocked: session.current.negativeLocked,
    selectedSignals: session.current.selectedSignals,
    hintLevel: session.current.hintLevel,
    changedAnswer: session.current.changedAnswer,
    durationMs: Math.max(0, Date.parse(attemptedAt) - Date.parse(session.questionStartedAt)),
    microLessonOpened: session.current.microLessonOpened,
    errorCategories,
    attemptedAt,
  };

  await db.transaction("rw", db.questionAttemptsV2, db.questionLearningStates, db.reviewQueue, async () => {
    await db.questionAttemptsV2.add(attempt);
    const previous = await db.questionLearningStates.get(question.key);
    const learningState = deriveLearningState(previous, attempt);
    await db.questionLearningStates.put(learningState);
    if (learningState.nextReviewAt) {
      const categories = errorCategories.length > 0 ? errorCategories : (["knowledge-gap"] as const);
      await db.reviewQueue.bulkPut(categories.map((errorCategory) => ({
        id: `review:${attemptId}:${errorCategory}`,
        questionKey: question.key,
        subjectKey: question.subjectKey,
        errorCategory,
        dueAt: learningState.nextReviewAt!,
        status: "pending" as const,
        sourceAttemptId: attemptId,
      })));
    }
  });
  return attempt;
}

export async function getLegalLearningSnapshot(questionKey: string) {
  const [learningState, attempts, reviewItems] = await Promise.all([
    db.questionLearningStates.get(questionKey),
    db.questionAttemptsV2.where("questionKey").equals(questionKey).toArray(),
    db.reviewQueue.where("questionKey").equals(questionKey).toArray(),
  ]);
  return { learningState, attempts, reviewItems };
}
