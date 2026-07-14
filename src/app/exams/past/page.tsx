"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Save,
  Sparkles,
  Target,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { aiapAllQuestions, aiapQuestionBanks, getAiapQuestionBank, type AiapQuestionBankId } from "@/lib/exams/aiapQuestionBanks";
import { addExamAttempt, bulkUpsertQuestions, getSettings, listExamAttempts } from "@/lib/db/repository";
import { db } from "@/lib/db/client";
import { newId } from "@/lib/utils/id";
import { answerKey, correctAnswerKey, isQuestionAnswerCorrect } from "@/lib/exams/answer";
import { notify } from "@/lib/notifications/toast";
import { apiHeaders } from "@/lib/utils/api";
import type { ExamAttempt, ExamResponse } from "@/types/exam";
import type { Question } from "@/types/question";
import type { AppSettings } from "@/types/settings";
import type { WrongQuestionIndex } from "@/types/wrongIndex";

type PracticeMode = "mock" | "random" | "weak" | "wrong";

type TopicStat = {
  key: string;
  subject: string;
  topic: string;
  questionCount: number;
  attempted: number;
  correct: number;
  wrong: number;
  totalTimeSec: number;
};

type RecentMiss = {
  questionId: string;
  subject: string;
  topic: string;
  stem: string;
  chosenAnswer: string;
  correctAnswer: string;
};

type WeaknessReport = {
  summary: string;
  focusTopics: Array<{ subject: string; topic: string; diagnosis: string; nextDrill: string }>;
  nextActions: string[];
  riskFlags: string[];
  source: "openai" | "local";
};

const ALL = "all";

const modeOptions: Array<{ value: PracticeMode; label: string }> = [
  { value: "random", label: "隨機 20" },
  { value: "mock", label: "完整卷" },
  { value: "weak", label: "弱點補強" },
  { value: "wrong", label: "錯題" },
];

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function questionNumber(question: Question) {
  return Number(question.questionId.slice(-3));
}

function subjectShort(subject: string) {
  if (subject.includes("第一科")) return "一科";
  if (subject.includes("第二科")) return "二科";
  if (subject.includes("Python")) return "Python";
  return subject.replace("AIAP 中級", "").trim() || subject;
}

function statAccuracy(stat: TopicStat) {
  return stat.attempted > 0 ? stat.correct / stat.attempted : 0;
}

function statErrorRate(stat: TopicStat) {
  return stat.attempted > 0 ? stat.wrong / stat.attempted : 0;
}

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function PastExamPage() {
  const [bankId, setBankId] = useState<AiapQuestionBankId>("official");
  const [mode, setMode] = useState<PracticeMode>("random");
  const [subjectFilter, setSubjectFilter] = useState(ALL);
  const [topicFilter, setTopicFilter] = useState(ALL);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [wrongIndex, setWrongIndex] = useState<WrongQuestionIndex[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [deck, setDeck] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ExamResponse>>({});
  const [startedAt, setStartedAt] = useState("");
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [seeded, setSeeded] = useState(false);
  const [report, setReport] = useState<WeaknessReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const activeBank = useMemo(() => getAiapQuestionBank(bankId), [bankId]);
  const activeQuestions = activeBank.questions;
  const questionMap = useMemo(() => new Map(activeQuestions.map((question) => [question.questionId, question])), [activeQuestions]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("bank") === "simulation") {
      setBankId("simulation");
    }
  }, []);

  const changeBank = (nextBankId: AiapQuestionBankId) => {
    setBankId(nextBankId);
    setSubjectFilter(ALL);
    setTopicFilter(ALL);
    setReport(null);
    setConfirmReset(false);
    const nextUrl = nextBankId === "simulation" ? "/exams/past?bank=simulation" : "/exams/past";
    window.history.replaceState(null, "", nextUrl);
  };

  const loadStudyState = useCallback(async () => {
    await bulkUpsertQuestions(aiapAllQuestions);
    const [allAttempts, allWrongIndex, appSettings] = await Promise.all([
      listExamAttempts(),
      db.wrongIndex.toArray(),
      getSettings(),
    ]);

    setAttempts(allAttempts.filter((attempt) => attempt.responses.some((response) => questionMap.has(response.questionId))));
    setWrongIndex(allWrongIndex.filter((item) => questionMap.has(item.questionId)));
    setSettings(appSettings);
    setSeeded(true);
  }, [questionMap]);

  useEffect(() => {
    void loadStudyState();
  }, [loadStudyState]);

  const subjects = useMemo(() => [...new Set(activeQuestions.map((question) => question.subject))], [activeQuestions]);

  const topics = useMemo(() => {
    const source = subjectFilter === ALL
      ? activeQuestions
      : activeQuestions.filter((question) => question.subject === subjectFilter);
    return [...new Set(source.map((question) => question.topic))].sort((a, b) => a.localeCompare(b, "zh-Hant"));
  }, [activeQuestions, subjectFilter]);

  useEffect(() => {
    if (topicFilter !== ALL && !topics.includes(topicFilter)) {
      setTopicFilter(ALL);
    }
  }, [topicFilter, topics]);

  const analytics = useMemo(() => {
    const topicStats = new Map<string, TopicStat>();
    const questionStats = new Map<string, { attempted: number; correct: number; wrong: number }>();
    let attempted = 0;
    let correct = 0;
    let wrong = 0;

    for (const question of activeQuestions) {
      const key = `${question.subject}::${question.topic}`;
      const stat = topicStats.get(key) ?? {
        key,
        subject: question.subject,
        topic: question.topic,
        questionCount: 0,
        attempted: 0,
        correct: 0,
        wrong: 0,
        totalTimeSec: 0,
      };
      stat.questionCount += 1;
      topicStats.set(key, stat);
      questionStats.set(question.questionId, { attempted: 0, correct: 0, wrong: 0 });
    }

    const recentMisses: RecentMiss[] = [];
    for (const attempt of attempts) {
      for (const response of attempt.responses) {
        const question = questionMap.get(response.questionId);
        if (!question) continue;

        const key = `${question.subject}::${question.topic}`;
        const topic = topicStats.get(key);
        const questionStat = questionStats.get(question.questionId);
        if (!topic || !questionStat) continue;

        attempted += 1;
        topic.attempted += 1;
        topic.totalTimeSec += response.timeSpentSec;
        questionStat.attempted += 1;

        if (response.isCorrect) {
          correct += 1;
          topic.correct += 1;
          questionStat.correct += 1;
        } else {
          wrong += 1;
          topic.wrong += 1;
          questionStat.wrong += 1;
          if (recentMisses.length < 12) {
            recentMisses.push({
              questionId: question.questionId,
              subject: question.subject,
              topic: question.topic,
              stem: question.stem,
              chosenAnswer: answerKey(response.chosenAnswer),
              correctAnswer: correctAnswerKey(question),
            });
          }
        }
      }
    }

    const sortedTopics = [...topicStats.values()].sort(
      (a, b) => Number(b.attempted > 0) - Number(a.attempted > 0) || statErrorRate(b) - statErrorRate(a) || b.wrong - a.wrong,
    );

    return {
      overall: {
        attempted,
        correct,
        wrong,
        accuracy: attempted > 0 ? correct / attempted : 0,
      },
      topicStats: sortedTopics,
      questionStats,
      recentMisses,
    };
  }, [activeQuestions, attempts, questionMap]);

  const filteredBank = useMemo(() => {
    return activeQuestions.filter((question) => {
      const subjectOk = subjectFilter === ALL || question.subject === subjectFilter;
      const topicOk = topicFilter === ALL || question.topic === topicFilter;
      return subjectOk && topicOk;
    });
  }, [activeQuestions, subjectFilter, topicFilter]);

  const refreshDeck = useCallback(() => {
    let pool = [...filteredBank];

    if (mode === "wrong") {
      const wrongIds = new Set(wrongIndex.filter((item) => item.severity > 0 || item.wrongCount > 0).map((item) => item.questionId));
      const wrongPool = pool.filter((question) => wrongIds.has(question.questionId));
      pool = wrongPool.length > 0 ? wrongPool : pool;
    }

    if (mode === "weak") {
      const weakKeys = new Set(
        analytics.topicStats
          .filter((stat) => stat.attempted > 0 && stat.wrong > 0)
          .slice(0, 3)
          .map((stat) => stat.key),
      );
      const weakPool = pool.filter((question) => weakKeys.has(`${question.subject}::${question.topic}`));
      pool = weakPool.length > 0 ? weakPool : pool;
    }

    const nextDeck =
      mode === "mock"
        ? [...pool].sort((a, b) => a.questionId.localeCompare(b.questionId))
        : shuffle(pool).slice(0, mode === "wrong" ? 30 : 20);

    setDeck(nextDeck);
    setCurrentIndex(0);
    setResponses({});
    setStartedAt(new Date().toISOString());
    setQuestionStartedAt(Date.now());
    setConfirmReset(false);
  }, [analytics.topicStats, filteredBank, mode, wrongIndex]);

  useEffect(() => {
    refreshDeck();
  }, [refreshDeck]);

  const currentQuestion = deck[currentIndex];
  const currentResponse = currentQuestion ? responses[currentQuestion.questionId] : undefined;
  const answeredCount = Object.keys(responses).length;
  const currentCorrect = Object.values(responses).filter((response) => response.isCorrect).length;
  const currentAccuracy = answeredCount > 0 ? currentCorrect / answeredCount : 0;
  const pendingReviewCount = wrongIndex.filter((item) => item.severity > 0).length;

  const chooseAnswer = (option: string) => {
    if (!currentQuestion) return;
    const chosenAnswer = answerKey(option);
    const isCorrect = isQuestionAnswerCorrect(currentQuestion, chosenAnswer);
    const previous = responses[currentQuestion.questionId];
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.questionId]: {
        questionId: currentQuestion.questionId,
        chosenAnswer,
        isCorrect,
        timeSpentSec: previous?.timeSpentSec ?? Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000)),
      },
    }));
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(Math.min(Math.max(index, 0), Math.max(deck.length - 1, 0)));
    setQuestionStartedAt(Date.now());
  };

  const saveAttempt = async () => {
    const savedResponses = deck.map((question) => responses[question.questionId]).filter(Boolean);
    if (savedResponses.length === 0) {
      notify("尚未作答", "先答幾題再交卷。");
      return;
    }

    const end = new Date().toISOString();
    const correctCount = savedResponses.filter((response) => response.isCorrect).length;
    const attempt: ExamAttempt = {
      attemptId: newId("attempt"),
      dateTimeStart: startedAt || end,
      dateTimeEnd: end,
      mode: mode === "mock" ? "mock" : "chapter",
      config: {
        subject: subjectFilter === ALL ? undefined : subjectFilter,
        topic: topicFilter === ALL ? undefined : topicFilter,
        numQuestions: savedResponses.length,
        seed: `aiap-${bankId}-${mode}-${Date.now()}`,
        timeLimitSec: 0,
      },
      results: {
        totalQuestions: savedResponses.length,
        correctCount,
        score: (correctCount / Math.max(1, savedResponses.length)) * 100,
        durationSec: Math.max(1, Math.round((Date.parse(end) - Date.parse(startedAt || end)) / 1000)),
      },
      responses: savedResponses,
    };

    await addExamAttempt(attempt);
    notify(`${activeBank.label}紀錄已保存`, `本輪 ${correctCount}/${savedResponses.length}`);
    await loadStudyState();
  };

  const resetAiapHistory = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }

    const aiapAttemptIds = attempts
      .filter((attempt) => attempt.responses.some((response) => questionMap.has(response.questionId)))
      .map((attempt) => attempt.attemptId);
    const aiapWrongIds = wrongIndex.map((item) => item.questionId);

    await db.transaction("rw", db.examAttempts, db.wrongIndex, async () => {
      if (aiapAttemptIds.length > 0) await db.examAttempts.bulkDelete(aiapAttemptIds);
      if (aiapWrongIds.length > 0) await db.wrongIndex.bulkDelete(aiapWrongIds);
    });

    setReport(null);
    setConfirmReset(false);
    notify(`${activeBank.label}紀錄已清除`, "題庫保留，可重新練。");
    await loadStudyState();
  };

  const requestAnalysis = async () => {
    setAnalyzing(true);
    try {
      const payload = {
        model: settings?.models.helelModel,
        overall: analytics.overall,
        topics: analytics.topicStats
          .filter((stat) => stat.attempted > 0)
          .slice(0, 10)
          .map((stat) => ({
            subject: stat.subject,
            topic: stat.topic,
            attempted: stat.attempted,
            correct: stat.correct,
            wrong: stat.wrong,
            errorRate: statErrorRate(stat),
            avgTimeSec: stat.attempted > 0 ? Math.round(stat.totalTimeSec / stat.attempted) : 0,
          })),
        recentMisses: analytics.recentMisses,
      };

      const response = await fetch("/api/exams/weakness-analysis", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "analysis failed");
      setReport(data);
    } catch (error) {
      notify("分析失敗", error instanceof Error ? error.message : "API failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const worstTopics = analytics.topicStats.filter((stat) => stat.attempted > 0 && stat.wrong > 0).slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="space-y-4 border-emerald-200 bg-white/95">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{activeBank.eyebrow}</p>
              <h2 className="text-2xl font-semibold tracking-normal">{activeBank.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{activeBank.description}</p>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {seeded ? activeBank.badgeLabel : "同步中"} / {activeQuestions.length} 題
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">題庫來源</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {aiapQuestionBanks.map((bank) => (
                <button
                  key={bank.id}
                  className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm font-medium transition ${
                    bankId === bank.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:bg-muted"
                  }`}
                  onClick={() => changeBank(bank.id)}
                  type="button"
                >
                  <span className="block">{bank.label}</span>
                  <span className={`mt-0.5 block text-xs ${bankId === bank.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {bank.questions.length} 題
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-md border border-border bg-sky-50 p-3">
              <p className="text-xs text-muted-foreground">累積作答</p>
              <p className="mt-1 text-2xl font-semibold">{analytics.overall.attempted}</p>
            </div>
            <div className="rounded-md border border-border bg-emerald-50 p-3">
              <p className="text-xs text-muted-foreground">正確率</p>
              <p className="mt-1 text-2xl font-semibold">{percent(analytics.overall.accuracy)}</p>
            </div>
            <div className="rounded-md border border-border bg-rose-50 p-3">
              <p className="text-xs text-muted-foreground">錯誤率</p>
              <p className="mt-1 text-2xl font-semibold">{analytics.overall.attempted > 0 ? percent(analytics.overall.wrong / analytics.overall.attempted) : "0%"}</p>
            </div>
            <div className="rounded-md border border-border bg-lime-50 p-3">
              <p className="text-xs text-muted-foreground">本輪</p>
              <p className="mt-1 text-2xl font-semibold">{answeredCount}/{deck.length}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-3 bg-white/95">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">弱點 API</h3>
              <p className="text-sm text-muted-foreground">{report ? `來源：${report.source === "openai" ? "OpenAI" : "本機規則"}` : "等待分析"}</p>
            </div>
            <Button onClick={requestAnalysis} disabled={analyzing} className="gap-2">
              <Sparkles className="h-4 w-4" />
              {analyzing ? "分析中" : "AI 研判"}
            </Button>
          </div>
          <p className="text-sm leading-6">{report?.summary ?? "完成作答後，這裡會整理高錯誤率主題與下一輪補強。"} </p>
          {report && (
            <div className="space-y-2 text-sm">
              {report.focusTopics.slice(0, 2).map((topic) => (
                <div key={`${topic.subject}-${topic.topic}`} className="rounded-md border border-border bg-muted/40 p-3">
                  <p className="font-medium">{topic.topic}</p>
                  <p className="mt-1 text-muted-foreground">{topic.diagnosis}</p>
                  <p className="mt-1">{topic.nextDrill}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="space-y-3 bg-white/95">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr_auto]">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">模式</p>
            <div className="grid grid-cols-2 gap-2">
              {modeOptions.map((item) => (
                <button
                  key={item.value}
                  className={`h-10 rounded-md border px-3 text-sm font-medium transition ${
                    mode === item.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:bg-muted"
                  }`}
                  onClick={() => setMode(item.value)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-muted-foreground">科目</span>
            <select
              className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm"
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              <option value={ALL}>全部科目</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-muted-foreground">主題</span>
            <select
              className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm"
              value={topicFilter}
              onChange={(event) => setTopicFilter(event.target.value)}
            >
              <option value={ALL}>全部主題</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </label>

          <div className="flex items-end gap-2">
            <Button variant="outline" className="gap-2" onClick={refreshDeck}>
              <RefreshCw className="h-4 w-4" />
              重抽
            </Button>
            <Button className="gap-2" onClick={saveAttempt}>
              <Save className="h-4 w-4" />
              交卷
            </Button>
            <Button variant="outline" className="gap-2" onClick={resetAiapHistory}>
              <Trash2 className="h-4 w-4" />
              {confirmReset ? "確認清除" : "清紀錄"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
        <Card className="space-y-4 bg-white/95">
          {currentQuestion ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-md bg-muted px-2 py-1 font-medium">{subjectShort(currentQuestion.subject)}</span>
                  <span className="rounded-md bg-sky-50 px-2 py-1 text-sky-800">{currentQuestion.topic}</span>
                  <span className="rounded-md bg-lime-50 px-2 py-1 text-lime-800">第 {questionNumber(currentQuestion)} 題</span>
                  {currentQuestion.source && (
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-800">{currentQuestion.source}</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{currentIndex + 1}/{Math.max(deck.length, 1)}</div>
              </div>

              {currentQuestion.tags?.includes("含附圖") && (
                <div className="flex gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>原公告題含附圖或表格；題幹已保留文字脈絡，細節可對照 PDF。</span>
                </div>
              )}

              <p className="whitespace-pre-line text-base leading-7">{currentQuestion.stem}</p>

              <div className="grid gap-2">
                {(currentQuestion.options ?? ["A", "B", "C", "D"]).map((option) => {
                  const optionKey = answerKey(option);
                  const selected = currentResponse?.chosenAnswer === optionKey;
                  const isCorrectOption = correctAnswerKey(currentQuestion).split(", ").includes(optionKey);
                  const revealed = Boolean(currentResponse);
                  return (
                    <button
                      key={option}
                      className={`min-h-12 rounded-md border px-3 py-2 text-left text-sm leading-6 transition ${
                        revealed && isCorrectOption
                          ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                          : selected
                            ? "border-primary bg-emerald-50"
                            : "border-border bg-white hover:bg-muted"
                      }`}
                      onClick={() => chooseAnswer(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {currentResponse && (
                <div className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
                  currentResponse.isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-900"
                }`}>
                  {currentResponse.isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <XCircle className="mt-0.5 h-4 w-4" />}
                  <div>
                    <p className="font-medium">{currentResponse.isCorrect ? "答對" : "答錯"} / 正解 {correctAnswerKey(currentQuestion)}</p>
                    <p className="mt-1">本題用時 {currentResponse.timeSpentSec} 秒。</p>
                    {currentQuestion.explanation && <p className="mt-1 leading-6">解析：{currentQuestion.explanation}</p>}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button variant="outline" className="gap-2" onClick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0}>
                  <ChevronLeft className="h-4 w-4" />
                  上一題
                </Button>
                <div className="rounded-md bg-muted px-3 py-2 text-sm">
                  本輪正確率 {percent(currentAccuracy)}
                </div>
                <Button variant="outline" className="gap-2" onClick={() => goToQuestion(currentIndex + 1)} disabled={currentIndex + 1 >= deck.length}>
                  下一題
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">沒有符合條件的題目。</div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="space-y-3 bg-white/95">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-semibold"><Target className="h-4 w-4" />主題錯誤率</h3>
              <span className="text-sm text-muted-foreground">{pendingReviewCount} 題待複習</span>
            </div>
            <div className="space-y-3">
              {worstTopics.length > 0 ? worstTopics.map((stat) => (
                <div key={stat.key} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{subjectShort(stat.subject)} / {stat.topic}</span>
                    <span className="font-medium">{percent(statErrorRate(stat))}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-rose-500" style={{ width: percent(statErrorRate(stat)) }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.wrong}/{stat.attempted} 錯，題庫 {stat.questionCount} 題</p>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">還沒有錯題統計。</p>
              )}
            </div>
          </Card>

          <Card className="space-y-3 bg-white/95">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-semibold"><BarChart3 className="h-4 w-4" />本輪題號</h3>
              <span className="text-sm text-muted-foreground">{answeredCount}/{deck.length}</span>
            </div>
            <div className="grid max-h-72 grid-cols-5 gap-2 overflow-auto pr-1 sm:grid-cols-6 xl:grid-cols-5">
              {deck.map((question, index) => {
                const response = responses[question.questionId];
                return (
                  <button
                    key={question.questionId}
                    className={`h-9 rounded-md border text-xs font-medium ${
                      index === currentIndex
                        ? "border-primary bg-primary text-primary-foreground"
                        : response?.isCorrect
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : response
                            ? "border-rose-200 bg-rose-50 text-rose-800"
                            : "border-border bg-white"
                    }`}
                    onClick={() => goToQuestion(index)}
                    type="button"
                  >
                    {subjectShort(question.subject)}-{questionNumber(question)}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-3 bg-white/95">
            <h3 className="flex items-center gap-2 font-semibold"><Brain className="h-4 w-4" />下一輪</h3>
            <div className="space-y-2 text-sm">
              {(report?.nextActions ?? ["隨機 20 題暖身", "保存作答紀錄", "切到弱點補強"]).slice(0, 3).map((action) => (
                <p key={action} className="rounded-md border border-border bg-muted/40 px-3 py-2">{action}</p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
