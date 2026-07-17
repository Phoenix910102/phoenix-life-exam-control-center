import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db/client";
import { classifyLegalAttempt, deriveLearningState } from "@/lib/law/diagnosis";
import {
  createLegalStudySession,
  getLegalLearningSnapshot,
  recordLegalQuestionAttempt,
  transitionAndSaveLegalSession,
} from "@/lib/law/repository";
import { legalQuestionSeeds } from "@/lib/law/sampleQuestions";
import { createQuestionSession, transitionQuestionSession } from "@/lib/law/questionSession";
import { legalQuestionDefinitionV2Schema } from "@/types/legalQuestion";

describe("legal question v2", () => {
  it("accepts all vertical-slice seed questions", () => {
    expect(legalQuestionSeeds).toHaveLength(5);
    legalQuestionSeeds.forEach((question) => expect(legalQuestionDefinitionV2Schema.safeParse(question).success).toBe(true));
  });

  it("rejects answer revisions that reference a missing option", () => {
    const question = structuredClone(legalQuestionSeeds[0]);
    question.answerRevisions[0].correctOptionKeys = ["missing"];
    const parsed = legalQuestionDefinitionV2Schema.safeParse(question);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.issues.some((issue) => issue.message.includes("不存在的選項"))).toBe(true);
  });

  it("does not allow AI questions to self-publish", () => {
    const question = structuredClone(legalQuestionSeeds[0]);
    question.origin = "ai-generated";
    question.reviewStatus = "published";
    const parsed = legalQuestionDefinitionV2Schema.safeParse(question);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.issues.some((issue) => issue.message.includes("AI 題"))).toBe(true);
  });
});

describe("question session state machine", () => {
  beforeEach(async () => {
    await db.transaction(
      "rw",
      db.legalQuestionDefinitions,
      db.questionAttemptsV2,
      db.questionLearningStates,
      db.studySessions,
      db.reviewQueue,
      async () => {
        await Promise.all([
          db.legalQuestionDefinitions.clear(),
          db.questionAttemptsV2.clear(),
          db.questionLearningStates.clear(),
          db.studySessions.clear(),
          db.reviewQueue.clear(),
        ]);
      },
    );
  });

  it("walks through the question-first learning flow without losing selected state", () => {
    const session = createQuestionSession({
      sessionId: "law-session:test",
      subjectKey: "criminal-law",
      questionKeys: [legalQuestionSeeds[0].key, legalQuestionSeeds[1].key],
      now: "2026-07-17T00:00:00.000Z",
    });
    const signal = transitionQuestionSession(session, { type: "signal-lock.opened" });
    const issue = transitionQuestionSession(signal, {
      type: "signals.locked",
      signals: ["判斷順序"],
      negativeLocked: false,
    });
    const options = transitionQuestionSession(issue, {
      type: "issue.predicted",
      issueKey: legalQuestionSeeds[0].primaryIssueRef!,
      confidence: "certain",
    });
    const selected = transitionQuestionSession(options, { type: "answer.selected", optionKeys: ["c"] });
    const confidence = transitionQuestionSession(selected, { type: "confidence.locked", confidence: "certain" });
    const submitted = transitionQuestionSession(confidence, { type: "answer.submitted", attemptId: "attempt:test" });
    const analysis = transitionQuestionSession(submitted, { type: "analysis.opened" });
    const lesson = transitionQuestionSession(analysis, { type: "micro-lesson.opened" });
    const variant = transitionQuestionSession(lesson, { type: "variant.opened" });
    const completed = transitionQuestionSession(variant, { type: "variant.completed", correct: true, queueForReview: false });
    const next = transitionQuestionSession(completed, { type: "next-question" });

    expect(completed.current).toMatchObject({
      selectedSignals: ["判斷順序"],
      finalSelectedOptionKeys: ["c"],
      confidence: "certain",
      optionAnalysisOpened: true,
      microLessonOpened: true,
      transferCorrect: true,
    });
    expect(next).toMatchObject({ currentIndex: 1, currentQuestionKey: legalQuestionSeeds[1].key, step: "stem-only" });
    expect(next.current.finalSelectedOptionKeys).toEqual([]);
  });

  it("rejects out-of-order transitions", () => {
    const session = createQuestionSession({ sessionId: "law-session:test", subjectKey: "criminal-law", questionKeys: [legalQuestionSeeds[0].key] });
    expect(() => transitionQuestionSession(session, { type: "answer.selected", optionKeys: ["c"] })).toThrow("不接受");
  });

  it("classifies confident mistakes and derives a due review", () => {
    let session = createQuestionSession({ sessionId: "law-session:test", subjectKey: "criminal-law", questionKeys: [legalQuestionSeeds[0].key] });
    session = transitionQuestionSession(session, { type: "signal-lock.opened" });
    session = transitionQuestionSession(session, { type: "signals.locked", signals: [], negativeLocked: false });
    session = transitionQuestionSession(session, { type: "issue.predicted", issueKey: "criminal-law.offense-structure.culpability", confidence: "certain" });
    session = transitionQuestionSession(session, { type: "answer.selected", optionKeys: ["a"] });
    session = transitionQuestionSession(session, { type: "confidence.locked", confidence: "certain" });
    const categories = classifyLegalAttempt(legalQuestionSeeds[0], session, false);
    expect(categories).toEqual(expect.arrayContaining(["stem-signal-missed", "layer-confusion", "knowledge-gap"]));

    const learning = deriveLearningState(undefined, {
      attemptId: "attempt:test",
      sessionId: session.sessionId,
      questionKey: session.currentQuestionKey,
      answerRevisionId: "answer.original",
      firstSelectedOptionKeys: ["a"],
      finalSelectedOptionKeys: ["a"],
      correct: false,
      confidence: "certain",
      issuePrediction: session.current.issuePrediction,
      negativeLocked: false,
      selectedSignals: [],
      hintLevel: 0,
      changedAnswer: false,
      durationMs: 1000,
      microLessonOpened: true,
      errorCategories: categories,
      attemptedAt: "2026-07-17T00:00:00.000Z",
    });
    expect(learning.unresolved).toBe(true);
    expect(learning.nextReviewAt).toBe("2026-07-18T00:00:00.000Z");
  });

  it("persists a diagnosis, attempt and review queue without duplicating the attempt", async () => {
    let session = await createLegalStudySession();
    session = await transitionAndSaveLegalSession(session, { type: "signal-lock.opened" });
    session = await transitionAndSaveLegalSession(session, {
      type: "signals.locked",
      signals: [],
      negativeLocked: false,
    });
    session = await transitionAndSaveLegalSession(session, {
      type: "issue.predicted",
      issueKey: "criminal-law.offense-structure.culpability",
      confidence: "certain",
    });
    session = await transitionAndSaveLegalSession(session, { type: "answer.selected", optionKeys: ["a"] });
    session = await transitionAndSaveLegalSession(session, { type: "confidence.locked", confidence: "certain" });
    session = await transitionAndSaveLegalSession(session, {
      type: "answer.submitted",
      attemptId: `attempt:${session.sessionId}:${session.currentQuestionKey}`,
    });
    session = await transitionAndSaveLegalSession(session, { type: "analysis.opened" });
    session = await transitionAndSaveLegalSession(session, { type: "micro-lesson.opened" });

    const question = legalQuestionSeeds.find((item) => item.key === session.currentQuestionKey)!;
    const first = await recordLegalQuestionAttempt(session, question);
    const duplicate = await recordLegalQuestionAttempt(session, question);
    const snapshot = await getLegalLearningSnapshot(question.key);

    expect(duplicate.attemptId).toBe(first.attemptId);
    expect(snapshot.attempts).toHaveLength(1);
    expect(snapshot.learningState).toMatchObject({ latestCorrect: false, unresolved: true, attemptCount: 1 });
    expect(snapshot.reviewItems.length).toBeGreaterThan(0);
    expect(await db.studySessions.get(session.sessionId)).toMatchObject({
      step: "micro-lesson",
      current: { confidence: "certain", finalSelectedOptionKeys: ["a"] },
    });
  });
});
