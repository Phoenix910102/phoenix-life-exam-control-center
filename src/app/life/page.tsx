"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toTaipeiDateKey } from "@/lib/utils/date";
import { upsertDailyLog } from "@/lib/db/repository";
import { notify } from "@/lib/notifications/toast";

export default function LifePage() {
  const [sleepHours, setSleepHours] = useState("7");
  const [waterIntakeMl, setWaterIntakeMl] = useState("1200");
  const [moodTag, setMoodTag] = useState("穩定");
  const [bodyState, setBodyState] = useState("一般");
  const [noteForHelel, setNoteForHelel] = useState("");

  const onSave = async () => {
    await upsertDailyLog(toTaipeiDateKey(), {
      sleepHours: Number(sleepHours),
      waterIntakeMl: Number(waterIntakeMl),
      moodTag,
      bodyState,
      noteForHelel,
    });
    notify("Life log saved", "已寫入今日紀錄");
  };

  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-semibold">Life Logging</h2>
      <Input value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} placeholder="Sleep hours" />
      <Input value={waterIntakeMl} onChange={(e) => setWaterIntakeMl(e.target.value)} placeholder="Water intake ml" />
      <Input value={moodTag} onChange={(e) => setMoodTag(e.target.value)} placeholder="Mood tag" />
      <Input value={bodyState} onChange={(e) => setBodyState(e.target.value)} placeholder="Body state" />
      <Textarea value={noteForHelel} onChange={(e) => setNoteForHelel(e.target.value)} placeholder="noteForHelel" />
      <Button onClick={onSave}>Save Daily Log</Button>
    </Card>
  );
}
