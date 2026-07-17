import type {
  LegalConfidence,
  QuestionSessionDraft,
  QuestionSessionState,
} from "@/types/legalQuestion";

export type QuestionSessionEvent =
  | { type: "signal-lock.opened" }
  | { type: "signals.locked"; signals: string[]; negativeLocked: boolean }
  | { type: "issue.predicted"; issueKey: string; confidence: "certain" | "hesitant" | "guess" }
  | { type: "answer.selected"; optionKeys: string[] }
  | { type: "confidence.locked"; confidence: LegalConfidence }
  | { type: "answer.submitted"; attemptId: string }
  | { type: "analysis.opened" }
  | { type: "micro-lesson.opened" }
  | { type: "variant.opened" }
  | { type: "variant.completed"; correct: boolean; queueForReview: boolean }
  | { type: "question.completed"; queueForReview: boolean }
  | { type: "next-question" };

const emptyDraft = (): QuestionSessionDraft => ({
  selectedSignals: [],
  negativeLocked: false,
  firstSelectedOptionKeys: [],
  finalSelectedOptionKeys: [],
  hintLevel: 0,
  changedAnswer: false,
  optionAnalysisOpened: false,
  microLessonOpened: false,
});

export function createQuestionSession(input: {
  sessionId: string;
  subjectKey: string;
  questionKeys: string[];
  now?: string;
}): QuestionSessionState {
  if (input.questionKeys.length === 0) throw new Error("Session 至少需要一題");
  const now = input.now ?? new Date().toISOString();
  return {
    sessionId: input.sessionId,
    status: "active",
    subjectKey: input.subjectKey,
    questionKeys: [...input.questionKeys],
    currentIndex: 0,
    currentQuestionKey: input.questionKeys[0],
    step: "stem-only",
    layout: "aiap-soft-study",
    mode: "reading",
    current: emptyDraft(),
    startedAt: now,
    questionStartedAt: now,
    updatedAt: now,
  };
}

function sameAnswers(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  return [...left].sort().every((value, index) => value === [...right].sort()[index]);
}

function requireStep(session: QuestionSessionState, accepted: QuestionSessionState["step"][]) {
  if (!accepted.includes(session.step)) {
    throw new Error(`Session ${session.step} 不接受這個操作`);
  }
}

export function transitionQuestionSession(
  session: QuestionSessionState,
  event: QuestionSessionEvent,
  now = new Date().toISOString(),
): QuestionSessionState {
  if (session.status !== "active" && event.type !== "next-question") {
    throw new Error("已結束的 Session 不接受新操作");
  }

  switch (event.type) {
    case "signal-lock.opened":
      requireStep(session, ["stem-only"]);
      return { ...session, step: "signal-lock", updatedAt: now };
    case "signals.locked":
      requireStep(session, ["signal-lock"]);
      return {
        ...session,
        step: "issue-prediction",
        current: { ...session.current, selectedSignals: [...event.signals], negativeLocked: event.negativeLocked },
        updatedAt: now,
      };
    case "issue.predicted":
      requireStep(session, ["issue-prediction"]);
      return {
        ...session,
        step: "options-visible",
        current: { ...session.current, issuePrediction: event.issueKey, positionConfidence: event.confidence },
        updatedAt: now,
      };
    case "answer.selected": {
      requireStep(session, ["options-visible", "answer-selected"]);
      if (event.optionKeys.length === 0) throw new Error("至少選擇一個答案");
      const first = session.current.firstSelectedOptionKeys.length > 0
        ? session.current.firstSelectedOptionKeys
        : [...event.optionKeys];
      return {
        ...session,
        step: "answer-selected",
        current: {
          ...session.current,
          firstSelectedOptionKeys: first,
          finalSelectedOptionKeys: [...event.optionKeys],
          changedAnswer: !sameAnswers(first, event.optionKeys),
        },
        updatedAt: now,
      };
    }
    case "confidence.locked":
      requireStep(session, ["answer-selected"]);
      return { ...session, step: "confidence-locked", current: { ...session.current, confidence: event.confidence }, updatedAt: now };
    case "answer.submitted":
      requireStep(session, ["confidence-locked"]);
      return {
        ...session,
        step: "submitted",
        current: { ...session.current, submittedAttemptId: event.attemptId },
        updatedAt: now,
      };
    case "analysis.opened":
      requireStep(session, ["submitted"]);
      return { ...session, step: "option-analysis", current: { ...session.current, optionAnalysisOpened: true }, updatedAt: now };
    case "micro-lesson.opened":
      requireStep(session, ["option-analysis"]);
      return { ...session, step: "micro-lesson", current: { ...session.current, microLessonOpened: true }, updatedAt: now };
    case "variant.opened":
      requireStep(session, ["micro-lesson"]);
      return { ...session, step: "variant-question", updatedAt: now };
    case "variant.completed":
      requireStep(session, ["variant-question"]);
      return {
        ...session,
        step: event.queueForReview ? "queued-for-review" : "completed",
        current: { ...session.current, transferCorrect: event.correct },
        updatedAt: now,
      };
    case "question.completed":
      requireStep(session, ["micro-lesson"]);
      return { ...session, step: event.queueForReview ? "queued-for-review" : "completed", updatedAt: now };
    case "next-question": {
      requireStep(session, ["completed", "queued-for-review"]);
      const nextIndex = session.currentIndex + 1;
      if (nextIndex >= session.questionKeys.length) {
        return { ...session, status: "completed", completedAt: now, updatedAt: now };
      }
      return {
        ...session,
        currentIndex: nextIndex,
        currentQuestionKey: session.questionKeys[nextIndex],
        step: "stem-only",
        current: emptyDraft(),
        questionStartedAt: now,
        updatedAt: now,
      };
    }
  }
}

export const questionSessionStepLabels: Record<QuestionSessionState["step"], string> = {
  "stem-only": "題幹先行",
  "signal-lock": "鎖定題眼",
  "issue-prediction": "位置判斷",
  "options-visible": "選擇答案",
  "answer-selected": "答案已選",
  "confidence-locked": "信心已鎖",
  submitted: "答案已提交",
  "option-analysis": "逐項拆解",
  "micro-lesson": "微型補課",
  "variant-question": "變化題",
  completed: "本題完成",
  "queued-for-review": "已排入複習",
};
