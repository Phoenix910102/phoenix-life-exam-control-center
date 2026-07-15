"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  CircleAlert,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MaterialBlock } from "@/types/materialPackage";
import type { MaterialDefinition, MaterialQuizAttempt } from "@/types/materialRecord";

type Props = {
  definition: MaterialDefinition;
  chapterKey: string;
  onQuizAttempt?: (attempt: MaterialQuizAttempt) => void | Promise<void>;
};

const blockPriority: Record<MaterialBlock["type"], number> = {
  position: 0,
  concept: 1,
  callout: 2,
  comparison: 3,
  confusion: 3,
  "exam-signal": 4,
  flow: 5,
  example: 5,
  quiz: 6,
  memory: 7,
};

function PositionBlock({ block }: { block: Extract<MaterialBlock, { type: "position" }> }) {
  return (
    <section className="border-y border-rose-950/10 bg-[linear-gradient(90deg,rgba(249,168,212,0.08),rgba(196,181,253,0.14),rgba(249,168,212,0.08))] px-5 py-6">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-800">
        <Compass className="h-4 w-4" />{block.category} 的位置
      </div>
      <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1.15fr_auto_1fr]">
        <div className="border-l-2 border-violet-200 px-3 py-2 text-sm text-slate-600">{block.before}</div>
        <ArrowRight className="mx-auto hidden h-4 w-4 self-center text-violet-300 sm:block" />
        <div className="border border-rose-300 bg-rose-50/75 px-4 py-3 text-sm font-semibold text-rose-950 shadow-[inset_3px_0_0_#be123c]">
          {block.current}
        </div>
        <ArrowRight className="mx-auto hidden h-4 w-4 self-center text-violet-300 sm:block" />
        <div className="border-l-2 border-violet-200 px-3 py-2 text-sm text-slate-600">{block.after}</div>
      </div>
    </section>
  );
}

function ConceptBlock({ block }: { block: Extract<MaterialBlock, { type: "concept" }> }) {
  return (
    <section className="grid gap-3 border-b border-slate-200 px-5 py-7 md:grid-cols-[150px_minmax(0,1fr)]">
      <h4 className="font-serif text-lg font-semibold text-violet-950">{block.title}</h4>
      <p className="whitespace-pre-line text-[15px] leading-7 text-slate-700">{block.body}</p>
    </section>
  );
}

function ComparisonBlock({ block }: { block: Extract<MaterialBlock, { type: "comparison" }> }) {
  return (
    <section className="px-5 py-7">
      <h4 className="mb-4 font-serif text-lg font-semibold text-violet-950">{block.title}</h4>
      <div className="overflow-x-auto border-y border-violet-200">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead className="bg-violet-950 text-violet-50">
            <tr>{block.columns.map((column) => <th className="px-4 py-3 font-medium" key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr className="border-b border-violet-100 odd:bg-violet-50/40" key={`${row.join("-")}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td className={`px-4 py-3 align-top leading-6 ${cellIndex === 0 ? "font-semibold text-violet-950" : "text-slate-700"}`} key={`${cell}-${cellIndex}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ConfusionBlock({ block }: { block: Extract<MaterialBlock, { type: "confusion" }> }) {
  return (
    <section className="border-y border-amber-200/70 bg-amber-50/55 px-5 py-7">
      <h4 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-amber-950">
        <CircleAlert className="h-5 w-5" />容易混淆
      </h4>
      <div className="divide-y divide-amber-200/80">
        {block.items.map((item) => (
          <div className="grid gap-2 py-4 md:grid-cols-[160px_1fr_1.2fr]" key={item.name}>
            <strong className="text-sm text-amber-950">{item.name}</strong>
            <p className="text-sm leading-6 text-slate-700">{item.role}</p>
            <p className="border-l-2 border-amber-300 pl-3 text-sm leading-6 text-slate-700">{item.difference}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FlowBlock({ block }: { block: Extract<MaterialBlock, { type: "flow" }> }) {
  return (
    <section className="px-5 py-7">
      <h4 className="font-serif text-lg font-semibold text-violet-950">{block.title}</h4>
      <ol className="mt-5 space-y-0">
        {block.steps.map((step, index) => (
          <li className="relative grid grid-cols-[34px_1fr] gap-3 pb-5 last:pb-0" key={`${step}-${index}`}>
            {index < block.steps.length - 1 && <span className="absolute left-4 top-8 h-[calc(100%-1rem)] w-px bg-rose-200" />}
            <span className="z-10 grid h-8 w-8 place-items-center rounded-full bg-rose-900 text-xs font-bold text-white">{index + 1}</span>
            <p className="pt-1 text-sm leading-6 text-slate-700">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ExamSignalBlock({ block }: { block: Extract<MaterialBlock, { type: "exam-signal" }> }) {
  return (
    <section className="bg-violet-950 px-5 py-7 text-violet-50">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">題幹訊號</p>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {block.cues.map((cue) => <li className="before:mr-2 before:text-rose-300 before:content-['◆']" key={cue}>{cue}</li>)}
          </ul>
        </div>
        <div className="space-y-4 border-l border-violet-700 pl-5">
          <div>
            <p className="text-xs font-semibold text-violet-300">作答規則</p>
            <p className="mt-1 text-sm leading-6">{block.answerRule}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs font-semibold text-rose-300"><AlertTriangle className="h-3.5 w-3.5" />陷阱</p>
            <p className="mt-1 text-sm leading-6 text-violet-100">{block.traps.join("、")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExampleBlock({ block }: { block: Extract<MaterialBlock, { type: "example" }> }) {
  return (
    <details className="group border-y border-slate-200 px-5 py-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-serif text-lg font-semibold text-violet-950">
        <span>例題｜{block.prompt}</span><span className="text-sm font-sans text-rose-800 group-open:hidden">展開推理</span>
      </summary>
      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_220px]">
        <ol className="space-y-3">
          {block.reasoningSteps.map((step, index) => (
            <li className="flex gap-3 text-sm leading-6 text-slate-700" key={`${step}-${index}`}>
              <span className="font-semibold text-rose-800">{String(index + 1).padStart(2, "0")}</span>{step}
            </li>
          ))}
        </ol>
        <div className="border-l-2 border-rose-700 bg-rose-50/70 p-4 text-sm leading-6 text-rose-950">
          <strong className="block text-xs uppercase tracking-[0.15em]">Answer</strong>{block.answer}
        </div>
      </div>
    </details>
  );
}

function MemoryBlock({ block }: { block: Extract<MaterialBlock, { type: "memory" }> }) {
  return (
    <section className="relative overflow-hidden bg-rose-950 px-6 py-8 text-rose-50">
      <BookMarked className="absolute -right-4 -top-5 h-28 w-28 text-rose-800/40" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">記憶錨點</p>
      <blockquote className="relative mt-2 font-serif text-2xl font-semibold leading-9">{block.anchor}</blockquote>
      <p className="relative mt-3 max-w-2xl text-sm leading-6 text-rose-100/85">{block.explanation}</p>
    </section>
  );
}

function CalloutBlock({ block }: { block: Extract<MaterialBlock, { type: "callout" }> }) {
  const tones = {
    info: "border-sky-300 bg-sky-50/70 text-sky-950",
    warning: "border-amber-400 bg-amber-50/70 text-amber-950",
    important: "border-rose-500 bg-rose-50/75 text-rose-950",
  };
  return (
    <aside className={`mx-5 my-6 border-l-4 px-4 py-3 ${tones[block.tone]}`}>
      <strong className="text-sm">{block.title}</strong>
      <p className="mt-1 text-sm leading-6">{block.body}</p>
    </aside>
  );
}

function QuizBlock({
  block,
  blockIndex,
  chapterKey,
  onQuizAttempt,
}: {
  block: Extract<MaterialBlock, { type: "quiz" }>;
  blockIndex: number;
  chapterKey: string;
  onQuizAttempt?: Props["onQuizAttempt"];
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  return (
    <section className="border-y-2 border-violet-900 bg-violet-50/45 px-5 py-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Knowledge Check</p>
      <h4 className="mt-1 font-serif text-xl font-semibold text-violet-950">{block.title ?? "章節測驗"}</h4>
      <div className="mt-6 space-y-8">
        {block.questions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          const isSubmitted = submitted[questionIndex];
          const isCorrect = isSubmitted && selected === question.answer;
          return (
            <fieldset className="border-t border-violet-200 pt-5" key={`${question.question}-${questionIndex}`}>
              <legend className="pr-4 text-sm font-semibold leading-6 text-violet-950">
                {questionIndex + 1}. {question.question}
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => {
                  const checked = selected === optionIndex;
                  const revealCorrect = isSubmitted && optionIndex === question.answer;
                  const revealWrong = isSubmitted && checked && !revealCorrect;
                  return (
                    <label
                      className={`flex cursor-pointer gap-3 border px-3 py-3 text-sm leading-5 transition ${
                        revealCorrect
                          ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                          : revealWrong
                            ? "border-rose-500 bg-rose-50 text-rose-950"
                            : checked
                              ? "border-violet-600 bg-violet-100 text-violet-950"
                              : "border-violet-200 bg-white/70 text-slate-700 hover:border-violet-400"
                      }`}
                      key={`${option}-${optionIndex}`}
                    >
                      <input
                        checked={checked}
                        className="mt-1 accent-violet-800"
                        disabled={isSubmitted}
                        name={`${chapterKey}-${blockIndex}-${questionIndex}`}
                        onChange={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                        type="radio"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
              {!isSubmitted ? (
                <Button
                  className="mt-3"
                  disabled={selected === undefined}
                  size="sm"
                  onClick={async () => {
                    if (selected === undefined) return;
                    setSubmitted((current) => ({ ...current, [questionIndex]: true }));
                    await onQuizAttempt?.({
                      chapterKey,
                      blockIndex,
                      questionIndex,
                      selectedIndex: selected,
                      correct: selected === question.answer,
                      attemptedAt: new Date().toISOString(),
                    });
                  }}
                >
                  送出答案
                </Button>
              ) : (
                <div className={`mt-3 border-l-4 px-4 py-3 text-sm ${isCorrect ? "border-emerald-600 bg-emerald-50" : "border-rose-700 bg-rose-50"}`}>
                  <p className="flex items-center gap-2 font-semibold">
                    {isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <CircleAlert className="h-4 w-4 text-rose-700" />}
                    {isCorrect ? "答對" : `答錯，正確答案是第 ${question.answer + 1} 項`}
                  </p>
                  <p className="mt-1 leading-6 text-slate-700">{question.explanation}</p>
                  {question.tags.length > 0 && <p className="mt-2 text-xs text-slate-500">標籤：{question.tags.join("、")}</p>}
                </div>
              )}
            </fieldset>
          );
        })}
      </div>
    </section>
  );
}

export function PhoenixMaterialRenderer({ definition, chapterKey, onQuizAttempt }: Props) {
  const chapter = definition.chapters.find((item) => item.key === chapterKey) ?? definition.chapters[0];
  const blocks = useMemo(
    () => chapter.blocks.map((block, index) => ({ block, index })).sort((a, b) => blockPriority[a.block.type] - blockPriority[b.block.type]),
    [chapter],
  );

  return (
    <article className="overflow-hidden bg-[#fffdfb] text-slate-900">
      <header className="border-b border-rose-200 bg-[linear-gradient(120deg,#fff7f7_0%,#fbf7ff_60%,#fffdfb_100%)] px-5 py-7 md:px-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-violet-700">
          <span>{definition.subject}</span><span className="text-rose-300">/</span><span>約 {chapter.estimatedMinutes} 分鐘</span>
        </div>
        <h2 className="mt-2 max-w-3xl font-serif text-3xl font-semibold leading-tight text-violet-950">{chapter.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{chapter.summary}</p>
        <div className="mt-5 border-l-2 border-rose-700 pl-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-800">本章會做到</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{chapter.objectives.join(" · ")}</p>
        </div>
      </header>

      {blocks.map(({ block, index }) => {
        switch (block.type) {
          case "position": return <PositionBlock block={block} key={`${block.type}-${index}`} />;
          case "concept": return <ConceptBlock block={block} key={`${block.type}-${index}`} />;
          case "comparison": return <ComparisonBlock block={block} key={`${block.type}-${index}`} />;
          case "confusion": return <ConfusionBlock block={block} key={`${block.type}-${index}`} />;
          case "flow": return <FlowBlock block={block} key={`${block.type}-${index}`} />;
          case "exam-signal": return <ExamSignalBlock block={block} key={`${block.type}-${index}`} />;
          case "example": return <ExampleBlock block={block} key={`${block.type}-${index}`} />;
          case "memory": return <MemoryBlock block={block} key={`${block.type}-${index}`} />;
          case "callout": return <CalloutBlock block={block} key={`${block.type}-${index}`} />;
          case "quiz":
            return (
              <QuizBlock
                block={block}
                blockIndex={index}
                chapterKey={chapter.key}
                key={`${chapter.key}-${block.type}-${index}`}
                onQuizAttempt={onQuizAttempt}
              />
            );
        }
      })}
    </article>
  );
}
