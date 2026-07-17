"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AiapSoftStudyLayout } from "@/components/law/layouts/aiap-soft-study/AiapSoftStudyLayout";
import {
  createOrResumeLegalStudySession,
  getLegalLearningSnapshot,
  getSessionQuestions,
  recordLegalQuestionAttempt,
  setLegalSessionMode,
  transitionAndSaveLegalSession,
} from "@/lib/law/repository";
import type { QuestionSessionEvent } from "@/lib/law/questionSession";
import type { LegalQuestionDefinitionV2, QuestionLearningState, QuestionSessionState } from "@/types/legalQuestion";
import styles from "@/components/law/layouts/aiap-soft-study/aiap-soft-study.module.css";

export function QuestionSessionController({ requestedSessionId }: { requestedSessionId?: string }) {
  const router = useRouter();
  const [session, setSession] = useState<QuestionSessionState>();
  const [questions, setQuestions] = useState<LegalQuestionDefinitionV2[]>([]);
  const [learningState, setLearningState] = useState<QuestionLearningState>();
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const nextSession = await createOrResumeLegalStudySession(requestedSessionId);
      const nextQuestions = await getSessionQuestions(nextSession);
      setSession(nextSession);
      setQuestions(nextQuestions);
      const snapshot = await getLegalLearningSnapshot(nextSession.currentQuestionKey);
      setLearningState(snapshot.learningState);
      if (!requestedSessionId) router.replace(`/law/practice/session/${encodeURIComponent(nextSession.sessionId)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "無法建立法律題目 Session");
    }
  }, [requestedSessionId, router]);

  useEffect(() => { void load(); }, [load]);

  const question = useMemo(
    () => questions.find((item) => item.key === session?.currentQuestionKey),
    [questions, session?.currentQuestionKey],
  );
  const variant = useMemo(
    () => questions.find((item) => item.variantOf === session?.currentQuestionKey),
    [questions, session?.currentQuestionKey],
  );

  async function onEvent(event: QuestionSessionEvent) {
    if (!session || !question) return;
    try {
      const next = await transitionAndSaveLegalSession(session, event);
      setSession(next);
      if (event.type === "micro-lesson.opened") {
        await recordLegalQuestionAttempt(next, question);
        const snapshot = await getLegalLearningSnapshot(question.key);
        setLearningState(snapshot.learningState);
      }
      if (event.type === "next-question" && next.status === "active") {
        const snapshot = await getLegalLearningSnapshot(next.currentQuestionKey);
        setLearningState(snapshot.learningState);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Session 操作失敗");
    }
  }

  async function onModeChange(mode: QuestionSessionState["mode"]) {
    if (!session) return;
    const next = await setLegalSessionMode(session, mode);
    setSession(next);
  }

  if (error) return <main className={styles.loading}><strong>SESSION ERROR</strong><p>{error}</p></main>;
  if (!session || !question) return <main className={styles.loading}><strong>PREPARING SESSION</strong><p>正在載入題目與學習狀態...</p></main>;

  return (
    <AiapSoftStudyLayout
      learningState={learningState}
      onEvent={onEvent}
      onModeChange={onModeChange}
      question={question}
      session={session}
      variant={variant}
    />
  );
}
