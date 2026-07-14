"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db/client";

export default function ExamsPage() {
  const [repairPool, setRepairPool] = useState<Array<{ questionId: string; severity: number; wrongCount: number }>>([]);

  useEffect(() => {
    (async () => {
      const items = await db.wrongIndex.orderBy("severity").reverse().toArray();
      setRepairPool(items.slice(0, 10));
    })();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-lg font-semibold">考試系統</h2>
        <p className="text-sm">進行快速練習、AIAP 官方公告題或非官方模擬／仿真題訓練。</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link href={{ pathname: "/exams/past" }} className="inline-block rounded bg-primary px-3 py-2 text-sm text-primary-foreground">AIAP 題庫訓練</Link>
          <Link href="/exams/quick" className="inline-block rounded border border-border bg-white px-3 py-2 text-sm">快速測驗</Link>
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold">錯題修復池</h3>
        {repairPool.map((x) => (
          <p key={x.questionId} className="text-sm">{x.questionId} - 嚴重度 {x.severity} / 錯 {x.wrongCount} 次</p>
        ))}
        {repairPool.length === 0 && <p className="text-sm">目前沒有錯題紀錄。</p>}
      </Card>
    </div>
  );
}
