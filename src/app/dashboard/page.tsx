"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db/client";
import { toTaipeiDateKey } from "@/lib/utils/date";

export default function DashboardPage() {
  const [stats, setStats] = useState({ tasks: 0, done: 0, questions: 0, exams: 0, gameFocus: 0 });

  useEffect(() => {
    (async () => {
      const tasks = await db.tasks.toArray();
      const today = toTaipeiDateKey();
      const log = await db.dailyLogs.get(today);
      setStats({
        tasks: tasks.length,
        done: tasks.filter((t) => t.done).length,
        questions: await db.questions.count(),
        exams: await db.examAttempts.count(),
        gameFocus: log?.gameSummary?.focusIndex ?? 0,
      });
    })();
  }, []);

  return (
    <main className="grid gap-4 md:grid-cols-2">
      <Card><h2 className="font-semibold">Life Summary</h2><p>今日專注指數: {stats.gameFocus}</p></Card>
      <Card><h2 className="font-semibold">Study Summary</h2><p>題庫題數: {stats.questions}</p><p>測驗次數: {stats.exams}</p></Card>
      <Card><h2 className="font-semibold">Task Summary</h2><p>{stats.done}/{stats.tasks} completed</p></Card>
      <Card><h2 className="font-semibold">Quick Note</h2><p>在 /console 直接新增任務與題目。</p></Card>
    </main>
  );
}
