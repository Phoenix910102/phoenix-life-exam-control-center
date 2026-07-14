"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toTaipeiDateKey } from "@/lib/utils/date";
import { upsertDailyLog } from "@/lib/db/repository";
import { notify } from "@/lib/notifications/toast";

export default function MedsPage() {
  const [name, setName] = useState("維生素 D");
  const [taken, setTaken] = useState(false);

  const add = async () => {
    await upsertDailyLog(toTaipeiDateKey(), {
      medications: [{ name, timeOfDay: "morning", taken }],
    });
    notify("用藥紀錄已儲存", `${name} / ${taken ? "已服用" : "尚未服用"}`);
  };

  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-semibold">用藥清單</h2>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={taken} onChange={(e) => setTaken(e.target.checked)} /> 已服用
      </label>
      <Button onClick={add}>儲存用藥紀錄</Button>
    </Card>
  );
}
