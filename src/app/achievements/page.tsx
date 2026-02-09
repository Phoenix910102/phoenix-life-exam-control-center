"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db/client";
import { runAchievementChecks } from "@/lib/achievements/rules";

export default function AchievementsPage() {
  const [items, setItems] = useState<Array<{ id: string; unlockedAt: string }>>([]);

  useEffect(() => {
    (async () => {
      await runAchievementChecks();
      setItems(await db.achievements.toArray());
    })();
  }, []);

  return (
    <Card className="space-y-2">
      <h2 className="text-lg font-semibold">Achievements</h2>
      {items.map((a) => <p key={a.id} className="text-sm">{a.id} @ {a.unlockedAt}</p>)}
      {items.length === 0 && <p className="text-sm">No achievements yet.</p>}
    </Card>
  );
}
