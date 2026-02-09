"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db/client";
import type { Question } from "@/types/question";
import type { ExamAttempt } from "@/types/exam";
import { addExamAttempt } from "@/lib/db/repository";
import { newId } from "@/lib/utils/id";

export default function QuickExamPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [responses, setResponses] = useState<ExamAttempt["responses"]>([]);
  const [startedAt, setStartedAt] = useState<string>("");
  const [finished, setFinished] = useState<ExamAttempt | null>(null);
  const [qStart, setQStart] = useState<number>(Date.now());

  useEffect(() => {
    (async () => {
      const all = await db.questions.toArray();
      setQuestions(all.sort(() => Math.random() - 0.5).slice(0, 10));
      setStartedAt(new Date().toISOString());
      setQStart(Date.now());
    })();
  }, []);

  const current = questions[idx];

  const submitAnswer = async (chosen: string) => {
    if (!current) return;
    const correct = Array.isArray(current.answer)
      ? current.answer.includes(chosen)
      : String(current.answer ?? "") === chosen;

    const nextResp = [
      ...responses,
      {
        questionId: current.questionId,
        chosenAnswer: chosen,
        isCorrect: correct,
        timeSpentSec: Math.round((Date.now() - qStart) / 1000),
      },
    ];

    if (idx + 1 >= questions.length) {
      const end = new Date().toISOString();
      const correctCount = nextResp.filter((r) => r.isCorrect).length;
      const attempt: ExamAttempt = {
        attemptId: newId("attempt"),
        dateTimeStart: startedAt,
        dateTimeEnd: end,
        mode: "quick",
        config: { numQuestions: questions.length, timeLimitSec: 0 },
        results: {
          totalQuestions: questions.length,
          correctCount,
          score: (correctCount / Math.max(1, questions.length)) * 100,
          durationSec: Math.round((Date.parse(end) - Date.parse(startedAt)) / 1000),
        },
        responses: nextResp,
      };
      await addExamAttempt(attempt);
      setFinished(attempt);
      return;
    }

    setResponses(nextResp);
    setIdx((v) => v + 1);
    setQStart(Date.now());
  };

  const progress = useMemo(() => `${idx + 1}/${Math.max(questions.length, 1)}`, [idx, questions.length]);

  if (finished) {
    return (
      <Card className="space-y-2">
        <h2 className="text-lg font-semibold">Exam Complete</h2>
        <p>Score: {finished.results.score.toFixed(1)}</p>
        <p>Correct: {finished.results.correctCount}/{finished.results.totalQuestions}</p>
      </Card>
    );
  }

  if (!current) {
    return <Card>Question bank is empty. Import JSONL in Settings first.</Card>;
  }

  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-semibold">Quick Exam ({progress})</h2>
      <p className="text-sm">{current.stem}</p>
      <div className="grid gap-2">
        {(current.options ?? ["A", "B", "C", "D"]).map((opt) => (
          <Button key={opt} variant="outline" onClick={() => submitAnswer(opt)}>{opt}</Button>
        ))}
      </div>
    </Card>
  );
}
