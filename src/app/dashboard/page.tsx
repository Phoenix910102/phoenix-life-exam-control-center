"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db/client";
import { toTaipeiDateKey } from "@/lib/utils/date";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ tasks: 0, done: 0, questions: 0, exams: 0, gameFocus: 0 });
  const [material, setMaterial] = useState<{ title: string; progress: number; chapter: string } | null>(null);

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
      const active = (await db.studyMaterials.filter((item) => item.isActive).first()) ?? (await db.studyMaterials.orderBy("updatedAt").last());
      if (active) {
        setMaterial({
          title: active.title,
          progress: active.progressPercent,
          chapter: active.chapters.find((chapter) => chapter.id === active.activeChapterId)?.title ?? active.chapters[0]?.title ?? "未選章節",
        });
      }
    })();
  }, []);

  return (
    <main className="grid gap-4 md:grid-cols-2">
      <Card><h2 className="font-semibold">生活摘要</h2><p>今日專注指數：{stats.gameFocus}</p></Card>
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-semibold"><BookOpen className="h-4 w-4 text-primary" />目前教材</h2>
          <Link className="inline-flex items-center text-sm text-primary" href={{ pathname: "/materials" }}>教材中心<ArrowRight className="ml-1 h-4 w-4" /></Link>
        </div>
        {material ? (
          <>
            <div><p className="font-medium">{material.title}</p><p className="text-sm text-muted-foreground">目前：{material.chapter}</p></div>
            <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${material.progress}%` }} /></div>
            <p className="text-sm">總進度 {material.progress}%</p>
          </>
        ) : <p className="text-sm text-muted-foreground">還沒有教材，先到教材中心匯入。</p>}
      </Card>
      <Card><h2 className="font-semibold">讀書摘要</h2><p>題庫題數：{stats.questions}</p><p>測驗次數：{stats.exams}</p></Card>
      <Card><h2 className="font-semibold">任務摘要</h2><p>已完成 {stats.done}/{stats.tasks} 件</p></Card>
      <Card><h2 className="font-semibold">快速提醒</h2><p>可以到「控制台」直接新增任務與題目。</p></Card>
    </main>
  );
}
