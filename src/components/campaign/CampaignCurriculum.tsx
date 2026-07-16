"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Search, Star, X } from "lucide-react";
import type { GlossaryTerm, MaterialQuestion } from "@/types/materialPackage";
import type { MaterialDefinition, MaterialProgress, MaterialQuizAttempt } from "@/types/materialRecord";
import styles from "./CampaignCurriculum.module.css";

type Props = {
  definition: MaterialDefinition;
  progress: MaterialProgress;
  chapterKey: string;
  onChapterSelect: (chapterKey: string) => void | Promise<void>;
  onQuizAttempt?: (attempt: MaterialQuizAttempt) => void | Promise<void>;
};

const levelLabel = { core: "A 級核心", frequent: "B 級常考", index: "C 級索引" } as const;

export function CampaignHome({ definition, progress, onMode }: Props & { onMode: (mode: string, bankKind?: "boss" | "final") => void }) {
  const collections = definition.collections;
  const terms = collections?.glossary?.terms ?? [];
  const banks = collections?.questionBanks ?? [];
  const questions = collections?.questions ?? [];
  const active = definition.chapters.find((chapter) => chapter.key === progress.activeChapterKey) ?? definition.chapters[0];
  const recentWrong = [...(progress.quizAttempts ?? [])].reverse().find((attempt) => !attempt.correct);
  return (
    <div className={styles.home} data-testid="campaign-curriculum-home">
      <p className={styles.kicker}>NATIVE PHOENIX CURRICULUM · v{definition.version}</p>
      <h3>{definition.title}</h3>
      <p className={styles.lead}>章節、名詞、題庫與來源彼此相連；閱讀不再承擔整本詞典的重量。</p>
      <div className={styles.metrics}>
        <Metric value={definition.chapters.length} label="章節" />
        <Metric value={terms.length} label="詞條" />
        <Metric value={terms.filter((term) => term.level === "core").length} label="A 級核心" />
        <Metric value={collections?.glossary?.categories.length ?? 0} label="詞庫分類" />
        <Metric value={questions.length} label="題庫總數" />
      </div>
      <div className={styles.homeGrid}>
        <section><span>目前主線</span><strong>{active?.title ?? "選擇第一章"}</strong><p>{progress.overallProgress}% 已完成</p></section>
        <section><span>最近弱點</span><strong>{recentWrong?.questionKey ?? "尚無未解題目"}</strong><p>{recentWrong ? "回到關聯詞條後再試一次" : "完成 Boss Quiz 取得診斷"}</p></section>
        <section><span>今日建議任務</span><strong>讀完一個核心段落，再做 6 題 Boss Quiz</strong><p>不擴張戰線，先建立可回憶的連結。</p></section>
      </div>
      <div className={styles.actions}>
        <button onClick={() => onMode("reader")} type="button"><BookOpen size={16} />繼續閱讀</button>
        <button onClick={() => onMode("glossary")} type="button">進入名詞庫</button>
        <button onClick={() => onMode("question-bank", "boss")} type="button">開始 Boss Quiz</button>
        <button onClick={() => onMode("question-bank", "final")} type="button">Final Exam</button>
      </div>
      <p className={styles.bankSummary}>{banks.filter((bank) => bank.kind === "boss").length} 個 Boss 題庫 · {banks.filter((bank) => bank.kind === "final").length} 個 Final 題庫</p>
    </div>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return <div><strong>{value}</strong><span>{label}</span></div>;
}

export function CampaignGlossary({ definition, chapterKey, onChapterSelect }: Props) {
  const glossary = definition.collections?.glossary;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [selectedKey, setSelectedKey] = useState<string>();
  const terms = glossary?.terms ?? [];
  const filtered = useMemo(() => terms.filter((term) => {
    const text = `${term.term} ${term.english ?? ""} ${term.oneLiner} ${term.confusion}`.toLocaleLowerCase("zh-TW");
    return (!query || text.includes(query.toLocaleLowerCase("zh-TW")))
      && (category === "all" || term.categoryKey === category)
      && (level === "all" || term.level === level);
  }), [category, level, query, terms]);
  const selected = terms.find((term) => term.key === selectedKey);
  return (
    <div className={styles.glossary} data-testid="campaign-glossary">
      <header><div><p className={styles.kicker}>GLOSSARY INDEX</p><h3>AIAP 名詞戰術庫</h3><p>{filtered.length} / {terms.length} 詞</p></div></header>
      <div className={styles.filters}>
        <label><Search size={15} /><input aria-label="搜尋名詞" placeholder="搜尋名詞、判題信號或混淆" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <select aria-label="詞庫分類" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">17 類全部</option>{glossary?.categories.map((item) => <option key={item.key} value={item.key}>{item.title}</option>)}</select>
        <select aria-label="詞條級別" value={level} onChange={(event) => setLevel(event.target.value)}><option value="all">A/B/C 全部</option><option value="core">A 級核心</option><option value="frequent">B 級常考</option><option value="index">C 級索引</option></select>
      </div>
      <div className={styles.termGrid}>{filtered.map((term) => <button key={term.key} onClick={() => setSelectedKey(term.key)} type="button"><span>{levelLabel[term.level]}</span><strong>{term.term}</strong><small>{term.english}</small><p>{term.oneLiner}</p></button>)}</div>
      {selected && <TermDossierDrawer definition={definition} term={selected} terms={filtered} onClose={() => setSelectedKey(undefined)} onSelect={setSelectedKey} onChapterSelect={onChapterSelect} />}
    </div>
  );
}

export function TermReferences({ definition, termRefs, onChapterSelect }: { definition: MaterialDefinition; termRefs: string[]; onChapterSelect?: (key: string) => void | Promise<void> }) {
  const [selected, setSelected] = useState<GlossaryTerm>();
  const terms = definition.collections?.glossary?.terms.filter((term) => termRefs.includes(term.key)) ?? [];
  return <section className={styles.featuredTerms} data-testid="featured-terms"><p className={styles.kicker}>FEATURED TERMS</p><h4>本章核心名詞</h4><div>{terms.slice(0, 12).map((term) => <button key={term.key} onClick={() => setSelected(term)} type="button"><span>{levelLabel[term.level]}</span><strong>{term.term}</strong><p>{term.questionSignal}</p></button>)}</div>{selected && <TermDossierDrawer definition={definition} term={selected} terms={terms} onClose={() => setSelected(undefined)} onSelect={(key) => setSelected(terms.find((term) => term.key === key))} onChapterSelect={onChapterSelect} />}</section>;
}

function TermDossierDrawer({ definition, term, terms, onClose, onSelect, onChapterSelect }: { definition: MaterialDefinition; term: GlossaryTerm; terms: GlossaryTerm[]; onClose: () => void; onSelect: (key: string) => void; onChapterSelect?: (key: string) => void | Promise<void> }) {
  const relatedQuestions = definition.collections?.questions?.filter((question) => question.termRefs.includes(term.key)) ?? [];
  const index = terms.findIndex((item) => item.key === term.key);
  return <div className={styles.drawerBackdrop} onKeyDown={(event) => { if (event.key === "Escape") onClose(); }} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><aside aria-modal="true" className={styles.drawer} data-testid="term-dossier" role="dialog"><button aria-label="關閉詞條" className={styles.close} onClick={onClose} type="button"><X /></button><p className={styles.kicker}>{levelLabel[term.level]}</p><h3>{term.term}</h3><p className={styles.english}>{term.english}</p><blockquote>{term.oneLiner}</blockquote><dl><div><dt>判題信號</dt><dd>{term.questionSignal}</dd></div><div><dt>應用情況</dt><dd>{term.application}</dd></div><div><dt>考題例子</dt><dd>{term.examExample}</dd></div><div><dt>高風險混淆</dt><dd>{term.confusion}</dd></div></dl><div className={styles.drawerActions}>{term.chapterRefs.map((key) => <button key={key} onClick={() => { onChapterSelect?.(key); onClose(); }} type="button"><ArrowLeft size={14} />回到引用章節</button>)}<span>{relatedQuestions.length} 題關聯題目</span></div><nav aria-label="詞條前後導覽" className={styles.termPager}><button disabled={index <= 0} onClick={() => onSelect(terms[index - 1].key)} type="button"><ArrowLeft size={14} />上一詞</button><span>{index + 1} / {terms.length}</span><button disabled={index < 0 || index >= terms.length - 1} onClick={() => onSelect(terms[index + 1].key)} type="button">下一詞<ArrowRight size={14} /></button></nav></aside></div>;
}

export function CampaignQuestionBanks({ definition, chapterKey, onQuizAttempt, initialKind = "boss" }: Props & { initialKind?: "boss" | "final" }) {
  const banks = definition.collections?.questionBanks ?? [];
  const questions = definition.collections?.questions ?? [];
  const [bankKey, setBankKey] = useState(banks.find((bank) => bank.kind === initialKind)?.key ?? banks[0]?.key);
  const bank = banks.find((item) => item.key === bankKey);
  const bankQuestions = (bank?.questionRefs ?? []).map((key) => questions.find((question) => question.key === key)).filter(Boolean) as MaterialQuestion[];
  return <div className={styles.questionBanks} data-testid="campaign-question-banks"><header><p className={styles.kicker}>QUESTION BANKS</p><h3>Boss Quiz / Final Exam</h3></header><nav>{banks.map((item) => <button className={item.key === bankKey ? styles.activeBank : ""} key={item.key} onClick={() => setBankKey(item.key)} type="button">{item.kind === "final" ? "FINAL" : "BOSS"}<strong>{item.title}</strong><span>{item.questionRefs.length} 題</span></button>)}</nav>{bank && <QuestionRunner bankKey={bank.key} chapterKey={chapterKey} questions={bankQuestions} onQuizAttempt={onQuizAttempt} />}</div>;
}

function QuestionRunner({ bankKey, chapterKey, questions, onQuizAttempt }: { bankKey: string; chapterKey: string; questions: MaterialQuestion[]; onQuizAttempt?: Props["onQuizAttempt"] }) {
  const [index, setIndex] = useState(0); const [selected, setSelected] = useState<number>(); const [submitted, setSubmitted] = useState(false); const [confidence, setConfidence] = useState<"certain" | "hesitant" | "guess">("hesitant"); const [hintLevel, setHintLevel] = useState(0); const [changed, setChanged] = useState(false); const startedAt = useRef(Date.now());
  const question = questions[index]; if (!question) return <p>這個題庫目前沒有題目。</p>;
  const move = (next: number) => { setIndex(next); setSelected(undefined); setSubmitted(false); setHintLevel(0); setChanged(false); startedAt.current = Date.now(); };
  return <section className={styles.runner} data-testid="question-runner"><div className={styles.runnerMeta}><span>{bankKey}</span><strong>{index + 1} / {questions.length}</strong></div>{question.imageAsset && <Image alt={`${question.key} 題目附圖`} className={styles.questionImage} height={1200} src={question.imageAsset} width={850} />}<h4>{question.prompt}</h4><div className={styles.options}>{question.options.map((option, optionIndex) => <button className={selected === optionIndex ? styles.selectedOption : ""} disabled={submitted} key={option} onClick={() => { if (selected !== undefined && selected !== optionIndex) setChanged(true); setSelected(optionIndex); }} type="button"><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div><div className={styles.answerControls}><select aria-label="回答信心" value={confidence} onChange={(event) => setConfidence(event.target.value as typeof confidence)}><option value="certain">確定</option><option value="hesitant">有點猶豫</option><option value="guess">猜的</option></select><button onClick={() => setHintLevel((value) => Math.min(6, value + 1))} type="button">提示 {hintLevel}/6</button><button disabled={selected === undefined || submitted} onClick={async () => { if (selected === undefined) return; setSubmitted(true); await onQuizAttempt?.({ chapterKey: question.chapterRefs[0] ?? chapterKey, blockIndex: 0, questionIndex: index, questionKey: question.key, selectedIndex: selected, correct: selected === question.answer, confidence, hintLevel, changedAnswer: changed, durationMs: Date.now() - startedAt.current, latestCorrect: selected === question.answer, unresolved: selected !== question.answer, attemptedAt: new Date().toISOString() }); }} type="button">送出答案</button></div>{submitted && <div className={selected === question.answer ? styles.correct : styles.incorrect}><strong>{selected === question.answer ? "答對" : `正確答案：${String.fromCharCode(65 + question.answer)}`}</strong><p>{question.explanation}</p></div>}<footer><button disabled={index === 0} onClick={() => move(index - 1)} type="button"><ArrowLeft size={14} />上一題</button><button disabled={index >= questions.length - 1} onClick={() => move(index + 1)} type="button">下一題<ArrowRight size={14} /></button></footer></section>;
}

export function SourceLibrary({ definition }: Pick<Props, "definition">) {
  const sources = definition.collections?.sourceLibrary ?? [];
  return <div className={styles.sourceLibrary}><p className={styles.kicker}>SOURCE LIBRARY</p><h3>教材來源庫</h3><div>{sources.map((source) => <article key={source.key}><span>{source.kind}</span><h4>{source.title}</h4><p>{source.citation}</p>{source.url && <a href={source.url} rel="noreferrer" target="_blank">開啟來源</a>}</article>)}</div></div>;
}

export function QuickReviewDeck({ definition }: Pick<Props, "definition">) {
  const terms = definition.collections?.glossary?.terms.filter((term) => term.level === "core") ?? [];
  return <div className={styles.quickReview}><p className={styles.kicker}>QUICK REVIEW</p><h3>考前核心詞卡</h3><div>{terms.map((term) => <article key={term.key}><Star size={15} /><strong>{term.term}</strong><p>{term.oneLiner}</p><small>{term.questionSignal}</small></article>)}</div></div>;
}
