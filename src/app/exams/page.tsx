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
        <h2 className="text-lg font-semibold">Exam System</h2>
        <p className="text-sm">Run a quick exam of 10 questions.</p>
        <Link href="/exams/quick" className="mt-2 inline-block rounded bg-primary px-3 py-2 text-sm text-primary-foreground">Start Quick Exam</Link>
      </Card>
      <Card>
        <h3 className="font-semibold">Repair Pool</h3>
        {repairPool.map((x) => (
          <p key={x.questionId} className="text-sm">{x.questionId} - severity {x.severity} / wrong {x.wrongCount}</p>
        ))}
        {repairPool.length === 0 && <p className="text-sm">No wrong index yet.</p>}
      </Card>
    </div>
  );
}
