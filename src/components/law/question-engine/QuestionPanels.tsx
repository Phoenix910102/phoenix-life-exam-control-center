"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Check,
  CheckCircle2,
  Eye,
  Flag,
  Lightbulb,
  ListChecks,
  LockKeyhole,
  RotateCcw,
  ShieldQuestion,
  Target,
  XCircle,
} from "lucide-react";
import type { LegalConfidence, LegalQuestionDefinitionV2, QuestionSessionState } from "@/types/legalQuestion";
import type { QuestionSessionEvent } from "@/lib/law/questionSession";
import styles from "../layouts/aiap-soft-study/aiap-soft-study.module.css";

type Send = (event: QuestionSessionEvent) => void | Promise<void>;

export function StemFirstPanel({ question, onEvent }: { question: LegalQuestionDefinitionV2; onEvent: Send }) {
  return (
    <section className={styles.questionStage} data-stage="stem">
      <div className={styles.stageLabel}><Eye size={15} /><span>STEP 01</span>題幹先行</div>
      <p className={styles.instruction}>先不要看選項。只判斷這題要求妳處理什麼。</p>
      <h1>{question.prompt}</h1>
      <button className={styles.primaryAction} onClick={() => onEvent({ type: "signal-lock.opened" })} type="button">
        <LockKeyhole size={17} />開始鎖定題眼<ArrowRight size={16} />
      </button>
    </section>
  );
}

export function SignalLockPanel({ question, session, onEvent }: { question: LegalQuestionDefinitionV2; session: QuestionSessionState; onEvent: Send }) {
  const [signals, setSignals] = useState<string[]>(session.current.selectedSignals);
  const [negativeLocked, setNegativeLocked] = useState(session.current.negativeLocked);
  const toggle = (signal: string) => setSignals((current) => current.includes(signal) ? current.filter((item) => item !== signal) : [...current, signal]);
  return (
    <section className={styles.questionStage} data-stage="signals">
      <div className={styles.stageLabel}><Target size={15} /><span>STEP 02</span>鎖定題眼</div>
      <p className={styles.instruction}>只圈會改變判斷方向的字。妳可以只選一個。</p>
      <blockquote>{question.prompt}</blockquote>
      <div className={styles.signalGrid} aria-label="題幹訊號">
        {question.questionSignals.map((signal) => (
          <button aria-pressed={signals.includes(signal)} key={signal} onClick={() => toggle(signal)} type="button">
            {signals.includes(signal) ? <Check size={15} /> : <Target size={15} />}{signal}
          </button>
        ))}
        {question.negativeStem ? (
          <button aria-pressed={negativeLocked} onClick={() => setNegativeLocked((value) => !value)} type="button">
            {negativeLocked ? <Check size={15} /> : <Flag size={15} />}否定詞已鎖定
          </button>
        ) : null}
      </div>
      <button className={styles.primaryAction} disabled={signals.length === 0} onClick={() => onEvent({ type: "signals.locked", signals, negativeLocked })} type="button">
        確認題眼<ArrowRight size={16} />
      </button>
    </section>
  );
}

export function IssuePredictionPanel({ question, session, onEvent }: { question: LegalQuestionDefinitionV2; session: QuestionSessionState; onEvent: Send }) {
  const [choice, setChoice] = useState(session.current.issuePrediction ?? "");
  const [confidence, setConfidence] = useState<"certain" | "hesitant" | "guess">(session.current.positionConfidence ?? "hesitant");
  return (
    <section className={styles.questionStage} data-stage="issue">
      <div className={styles.stageLabel}><ShieldQuestion size={15} /><span>STEP 03</span>位置判斷</div>
      <p className={styles.instruction}>現在只判斷位置，不求答案。</p>
      <div className={styles.choiceRows} role="radiogroup" aria-label="爭點位置">
        {question.predictionChoices.map((item) => (
          <button aria-checked={choice === item.key} key={item.key} onClick={() => setChoice(item.key)} role="radio" type="button">
            <span>{item.label}</span>{choice === item.key ? <CheckCircle2 size={17} /> : null}
          </button>
        ))}
      </div>
      <div className={styles.compactSegment} aria-label="位置判斷信心">
        {(["certain", "hesitant", "guess"] as const).map((value) => (
          <button aria-pressed={confidence === value} key={value} onClick={() => setConfidence(value)} type="button">
            {{ certain: "確定", hesitant: "猶豫", guess: "猜測" }[value]}
          </button>
        ))}
      </div>
      <button className={styles.primaryAction} disabled={!choice} onClick={() => onEvent({ type: "issue.predicted", issueKey: choice, confidence })} type="button">
        顯示選項<ArrowRight size={16} />
      </button>
    </section>
  );
}

export function OptionPanel({ question, session, onEvent }: { question: LegalQuestionDefinitionV2; session: QuestionSessionState; onEvent: Send }) {
  const selected = session.current.finalSelectedOptionKeys;
  return (
    <section className={styles.questionStage} data-stage="options">
      <div className={styles.stageLabel}><ListChecks size={15} /><span>STEP 04</span>選擇答案</div>
      <h1 className={styles.compactStem}>{question.prompt}</h1>
      <div className={styles.optionList} role="radiogroup" aria-label="題目選項">
        {question.options.map((option) => (
          <button aria-checked={selected.includes(option.key)} key={option.key} onClick={() => onEvent({ type: "answer.selected", optionKeys: [option.key] })} role="radio" type="button">
            <b>{option.key.toUpperCase()}</b><span>{option.text}</span>{selected.includes(option.key) ? <CheckCircle2 size={18} /> : null}
          </button>
        ))}
      </div>
    </section>
  );
}

const confidenceLabels: Record<LegalConfidence, string> = {
  certain: "確定",
  hesitant: "有點猶豫",
  guess: "猜的",
  changed: "改過答案",
  unreadable: "看不懂題目",
};

export function ConfidenceSelector({ session, onEvent }: { session: QuestionSessionState; onEvent: Send }) {
  return (
    <section className={styles.confidenceBand}>
      <div><span>CONFIDENCE LOCK</span><h2>這個答案有多穩？</h2></div>
      <div className={styles.confidenceOptions}>
        {(Object.keys(confidenceLabels) as LegalConfidence[]).map((value) => (
          <button key={value} onClick={() => onEvent({ type: "confidence.locked", confidence: value })} type="button">
            {value === "changed" && session.current.changedAnswer ? <RotateCcw size={14} /> : null}{confidenceLabels[value]}
          </button>
        ))}
      </div>
    </section>
  );
}

export function OptionAnalysisPanel({ question, session, onEvent }: { question: LegalQuestionDefinitionV2; session: QuestionSessionState; onEvent: Send }) {
  return (
    <section className={styles.analysisStage} aria-live="polite">
      <div className={styles.stageLabel}><ListChecks size={15} /><span>STEP 05</span>逐項拆解</div>
      <div className={styles.analysisRows}>
        {question.optionAnalyses.map((analysis) => {
          const option = question.options.find((item) => item.key === analysis.optionKey);
          const selected = session.current.finalSelectedOptionKeys.includes(analysis.optionKey);
          return (
            <article data-selected={selected} data-verdict={analysis.verdict} key={analysis.optionKey}>
              <b>{analysis.optionKey.toUpperCase()}</b>
              <div>
                <strong>{option?.text}</strong>
                <p>{analysis.rule}</p>
                {analysis.errorPoint ? <small>錯點：{analysis.errorPoint}</small> : null}
                {analysis.minimalCorrection ? <small>最小修正：{analysis.minimalCorrection}</small> : null}
              </div>
              {analysis.verdict === "correct" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            </article>
          );
        })}
      </div>
      <button className={styles.primaryAction} onClick={() => onEvent({ type: "micro-lesson.opened" })} type="button">
        <BookOpenText size={17} />只補這題的缺口<ArrowRight size={16} />
      </button>
    </section>
  );
}

export function MicroLessonPanel({ question, hasVariant, queueForReview, onEvent }: { question: LegalQuestionDefinitionV2; hasVariant: boolean; queueForReview: boolean; onEvent: Send }) {
  return (
    <section className={styles.lessonStage}>
      <div className={styles.stageLabel}><Lightbulb size={15} /><span>STEP 06</span>微型補課</div>
      <h2>這題只需要守住一條判斷線</h2>
      <ol>{question.reasoningSteps.map((step) => <li key={step}>{step}</li>)}</ol>
      {question.commonTraps.length > 0 ? (
        <aside><strong>容易踩的陷阱</strong>{question.commonTraps.map((trap) => <p key={trap}>{trap}</p>)}</aside>
      ) : null}
      <button
        className={styles.primaryAction}
        onClick={() => onEvent(hasVariant ? { type: "variant.opened" } : { type: "question.completed", queueForReview })}
        type="button"
      >
        {hasVariant ? "用變化題確認" : "完成這一題"}<ArrowRight size={16} />
      </button>
    </section>
  );
}

export function VariantQuestionPanel({ question, queueForReview, onEvent }: { question: LegalQuestionDefinitionV2; queueForReview: boolean; onEvent: Send }) {
  const [selected, setSelected] = useState("");
  const answer = question.answerRevisions[question.answerRevisions.length - 1].correctOptionKeys;
  return (
    <section className={styles.variantStage}>
      <div className={styles.stageLabel}><RotateCcw size={15} /><span>STEP 07</span>最小差異變化題</div>
      <h2>{question.prompt}</h2>
      <div className={styles.optionList} role="radiogroup" aria-label="變化題選項">
        {question.options.map((option) => (
          <button aria-checked={selected === option.key} key={option.key} onClick={() => setSelected(option.key)} role="radio" type="button">
            <b>{option.key.toUpperCase()}</b><span>{option.text}</span>{selected === option.key ? <CheckCircle2 size={18} /> : null}
          </button>
        ))}
      </div>
      <button
        className={styles.primaryAction}
        disabled={!selected}
        onClick={() => onEvent({ type: "variant.completed", correct: answer.includes(selected), queueForReview: queueForReview || !answer.includes(selected) })}
        type="button"
      >
        提交變化題<ArrowRight size={16} />
      </button>
    </section>
  );
}
