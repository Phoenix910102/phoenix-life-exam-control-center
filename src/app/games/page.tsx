"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addGameSession } from "@/lib/db/repository";
import { newId } from "@/lib/utils/id";
import { toTaipeiDateKey } from "@/lib/utils/date";
import { refreshTodayGameSummary } from "@/lib/games/updateDailyGameSummary";

export default function GamesPage() {
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusInterruption, setFocusInterruption] = useState(0);
  const focusInterruptionRef = useRef(0);
  const focusRunRef = useRef(false);
  const [tapRunning, setTapRunning] = useState(false);
  const [missed, setMissed] = useState(0);
  const [deviation, setDeviation] = useState(0);
  const [generatedAt, setGeneratedAt] = useState("");
  const tapStartRef = useRef<number>(0);
  const tapMissedRef = useRef(0);
  const tapDeviationRef = useRef(0);
  const tapCountRef = useRef(0);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden && focusRunRef.current) {
        focusInterruptionRef.current += 1;
        setFocusInterruption(focusInterruptionRef.current);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const finishFocusBet = async (quit: boolean) => {
    const session = {
      sessionId: newId("game"),
      gameType: "focus_bet" as const,
      dateTimeStart: new Date(Date.now() - 60000).toISOString(),
      dateTimeEnd: new Date().toISOString(),
      durationSec: 60,
      quit,
      metrics: {
        success: !quit && focusInterruptionRef.current === 0,
        interruptions: focusInterruptionRef.current,
      },
    };
    await addGameSession(session);
    await refreshTodayGameSummary(toTaipeiDateKey());
    setGeneratedAt(new Date().toLocaleTimeString());
    setFocusRunning(false);
    setFocusInterruption(0);
    focusInterruptionRef.current = 0;
    focusRunRef.current = false;
  };

  const startFocusBet = () => {
    focusRunRef.current = true;
    setFocusRunning(true);
    setFocusInterruption(0);
    focusInterruptionRef.current = 0;
    setTimeout(() => {
      if (focusRunRef.current) finishFocusBet(false);
    }, 60000);
  };

  const startTapLock = () => {
    setTapRunning(true);
    setMissed(0);
    setDeviation(0);
    tapStartRef.current = Date.now();
    tapMissedRef.current = 0;
    tapDeviationRef.current = 0;
    tapCountRef.current = 0;
  };

  const onTap = async () => {
    if (!tapRunning) return;
    const elapsed = Date.now() - tapStartRef.current;
    const target = 1500;
    const dev = Math.abs(elapsed - target);
    tapCountRef.current += 1;
    tapDeviationRef.current =
      (tapDeviationRef.current * (tapCountRef.current - 1) + dev) / tapCountRef.current;
    if (dev > 500) tapMissedRef.current += 1;
    setDeviation(tapDeviationRef.current);
    setMissed(tapMissedRef.current);

    if (elapsed > 15000) {
      const session = {
        sessionId: newId("game"),
        gameType: "tap_lock" as const,
        dateTimeStart: new Date(Date.now() - elapsed).toISOString(),
        dateTimeEnd: new Date().toISOString(),
        durationSec: Math.round(elapsed / 1000),
        quit: false,
        metrics: {
          missed: tapMissedRef.current,
          avgDeviationMs: Math.round(tapDeviationRef.current),
        },
      };
      await addGameSession(session);
      await refreshTodayGameSummary(toTaipeiDateKey());
      setTapRunning(false);
      setGeneratedAt(new Date().toLocaleTimeString());
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <motion.div whileHover={{ rotateY: 4 }} transition={{ duration: 0.25 }}>
        <Card className="space-y-2">
          <h3 className="font-semibold">專注賭注（60 秒）</h3>
          <p className="text-sm">離開頁面或主動放棄即失敗。</p>
          {!focusRunning ? <Button onClick={startFocusBet}>開始</Button> : <Button variant="outline" onClick={() => finishFocusBet(true)}>放棄</Button>}
          <p className="text-xs">中斷次數：{focusInterruption}</p>
        </Card>
      </motion.div>

      <motion.div animate={{ boxShadow: ["0 0 0px #059669", "0 0 18px #34d399", "0 0 0px #059669"] }} transition={{ repeat: Infinity, duration: 2 }}>
        <Card className="space-y-2">
          <h3 className="font-semibold">節拍鎖定（15-30 秒）</h3>
          <p className="text-sm">依節拍點擊卡片。</p>
          {!tapRunning ? <Button onClick={startTapLock}>開始</Button> : <Button onClick={onTap}>點擊</Button>}
          <p className="text-xs">錯過：{missed}，平均偏差 ms：{Math.round(deviation)}</p>
        </Card>
      </motion.div>

      <Card className="md:col-span-2">
        <p className="text-sm">指數更新時間：{generatedAt || "-"}</p>
      </Card>
    </div>
  );
}
