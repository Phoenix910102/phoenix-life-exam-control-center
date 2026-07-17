"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText, CheckCircle2, Clock3, Scale, ShieldCheck, Target } from "lucide-react";
import { latestAnswerRevision, optionKeysMatch } from "@/lib/law/diagnosis";
import { questionSessionStepLabels, type QuestionSessionEvent } from "@/lib/law/questionSession";
import type { LegalQuestionDefinitionV2, QuestionLearningState, QuestionSessionState } from "@/types/legalQuestion";
import {
  ConfidenceSelector,
  IssuePredictionPanel,
  MicroLessonPanel,
  OptionAnalysisPanel,
  OptionPanel,
  SignalLockPanel,
  StemFirstPanel,
  VariantQuestionPanel,
} from "@/components/law/question-engine/QuestionPanels";
import styles from "./aiap-soft-study.module.css";

type Props = {
  session: QuestionSessionState;
  question: LegalQuestionDefinitionV2;
  variant?: LegalQuestionDefinitionV2;
  learningState?: QuestionLearningState;
  onEvent: (event: QuestionSessionEvent) => void | Promise<void>;
  onModeChange: (mode: QuestionSessionState["mode"]) => void | Promise<void>;
};

export function AiapSoftStudyLayout({ session, question, variant, learningState, onEvent, onModeChange }: Props) {
  const correct = optionKeysMatch(session.current.finalSelectedOptionKeys, latestAnswerRevision(question).correctOptionKeys);
  const queueForReview = !correct || session.current.confidence !== "certain";
  const positionLabel = question.predictionChoices.find((item) => item.key === session.current.issuePrediction)?.label;

  return (
    <main className={styles.app} data-reading-mode={session.mode} data-session-step={session.step}>
      <header className={styles.topbar}>
        <Link href="/law"><ArrowLeft size={16} />司律主線</Link>
        <div className={styles.identity}><span>AIAP SOFT STUDY</span><strong>刑法・犯罪成立三階層</strong></div>
        <div className={styles.modeSwitch} aria-label="閱讀環境">
          {(["reading", "immersive", "night"] as const).map((mode) => (
            <button aria-pressed={session.mode === mode} key={mode} onClick={() => onModeChange(mode)} type="button">
              {{ reading: "柔和", immersive: "專注", night: "夜讀" }[mode]}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.subjectRail}>
          <div><span>SUBJECT</span><h2>刑法</h2><strong>70</strong><small>第一試預設權重</small></div>
          <nav aria-label="本次學習區域">
            <a data-active="true" href="#question"><Target size={16} />今日題目</a>
            <a href="#diagnosis"><ShieldCheck size={16} />診斷紀錄</a>
            <Link href="/law/content-inbox"><BookOpenText size={16} />內容收件匣</Link>
          </nav>
          <div className={styles.deckProgress}>
            <span>SESSION</span>
            <strong>{String(session.currentIndex + 1).padStart(2, "0")} / {String(session.questionKeys.length).padStart(2, "0")}</strong>
            <div><i style={{ width: `${((session.currentIndex + 1) / session.questionKeys.length) * 100}%` }} /></div>
          </div>
        </aside>

        <section className={styles.paper} id="question">
          <div className={styles.questionMeta}>
            <span>{question.origin === "official" ? "官方原題" : "樣板題・待審"}</span>
            <span>{question.paperCode}</span>
            <span>Q{String(question.questionNumber ?? session.currentIndex + 1).padStart(2, "0")}</span>
            <span>{question.lawVersion}</span>
          </div>

          {session.status === "completed" ? (
            <section className={styles.completionStage}>
              <CheckCircle2 size={38} />
              <span>SESSION COMPLETE</span>
              <h1>本次刑法主線已完成</h1>
              <p>作答、信心、題眼與需要複習的錯誤類型都已保存在這個瀏覽器。</p>
              <Link href="/law"><ArrowLeft size={16} />返回司律主線</Link>
            </section>
          ) : (
            <>
              {session.step === "stem-only" ? <StemFirstPanel onEvent={onEvent} question={question} /> : null}
              {session.step === "signal-lock" ? <SignalLockPanel onEvent={onEvent} question={question} session={session} /> : null}
              {session.step === "issue-prediction" ? <IssuePredictionPanel onEvent={onEvent} question={question} session={session} /> : null}
              {["options-visible", "answer-selected"].includes(session.step) ? (
                <><OptionPanel onEvent={onEvent} question={question} session={session} />{session.step === "answer-selected" ? <ConfidenceSelector onEvent={onEvent} session={session} /> : null}</>
              ) : null}
              {session.step === "confidence-locked" ? (
                <section className={styles.lockedStage}>
                  <ShieldCheck size={28} /><span>ANSWER LOCKED</span><h1>答案與信心已封存</h1>
                  <p>選擇：{session.current.finalSelectedOptionKeys.map((key) => key.toUpperCase()).join("、")}・{session.current.confidence}</p>
                  <button onClick={() => onEvent({ type: "answer.submitted", attemptId: `attempt:${session.sessionId}:${question.key}` })} type="button">提交答案<ArrowRight size={16} /></button>
                </section>
              ) : null}
              {session.step === "submitted" ? (
                <section className={styles.lockedStage}>
                  <CheckCircle2 size={28} /><span>SUBMITTED</span><h1>答案已提交</h1>
                  <p>現在才打開選項解析，避免作答前被答案污染。</p>
                  <button onClick={() => onEvent({ type: "analysis.opened" })} type="button">查看逐項解析<ArrowRight size={16} /></button>
                </section>
              ) : null}
              {session.step === "option-analysis" ? <OptionAnalysisPanel onEvent={onEvent} question={question} session={session} /> : null}
              {session.step === "micro-lesson" ? <MicroLessonPanel hasVariant={Boolean(variant)} onEvent={onEvent} question={question} queueForReview={queueForReview} /> : null}
              {session.step === "variant-question" && variant ? <VariantQuestionPanel onEvent={onEvent} question={variant} queueForReview={queueForReview} /> : null}
              {["completed", "queued-for-review"].includes(session.step) ? (
                <section className={styles.completionStage}>
                  {session.step === "queued-for-review" ? <Clock3 size={34} /> : <CheckCircle2 size={34} />}
                  <span>{session.step === "queued-for-review" ? "REVIEW QUEUED" : "QUESTION SECURED"}</span>
                  <h1>{session.step === "queued-for-review" ? "這題已排進弱點修復" : "這個判斷點暫時守住了"}</h1>
                  <p>{session.current.transferCorrect === false ? "變化題仍有落差，系統會保留這次證據。" : "進度不是只看答對，信心與變化題也一起計算。"}</p>
                  <button onClick={() => onEvent({ type: "next-question" })} type="button">
                    {session.currentIndex + 1 >= session.questionKeys.length ? "完成本次主線" : "進入下一題"}<ArrowRight size={16} />
                  </button>
                </section>
              ) : null}
            </>
          )}
        </section>

        <aside className={styles.diagnosisRail} id="diagnosis">
          <div className={styles.diagnosisHeader}><Scale size={18} /><span>LIVE DIAGNOSIS</span></div>
          <dl>
            <div><dt>目前步驟</dt><dd>{questionSessionStepLabels[session.step]}</dd></div>
            <div><dt>鎖定題眼</dt><dd>{session.current.selectedSignals.join("、") || "尚未鎖定"}</dd></div>
            <div><dt>位置判斷</dt><dd>{positionLabel ?? "尚未判斷"}</dd></div>
            <div><dt>作答信心</dt><dd>{session.current.confidence ?? "尚未鎖定"}</dd></div>
            <div><dt>提示層級</dt><dd>Level {session.current.hintLevel}</dd></div>
          </dl>
          <div className={styles.masteryBlock}>
            <span>MASTERY EVIDENCE</span>
            <strong>{learningState?.mastery ?? 20}</strong>
            <div><i style={{ width: `${learningState?.mastery ?? 20}%` }} /></div>
            <p>{learningState?.unresolved ? "仍有未解除證據" : "等待本題完成後更新"}</p>
          </div>
          <p className={styles.rekaiLine}>Rékaí：先把題目放對位置，再碰選項。</p>
        </aside>
      </div>
    </main>
  );
}
