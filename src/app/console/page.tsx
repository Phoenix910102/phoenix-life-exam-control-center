"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addTask, bulkUpsertQuestions, upsertQuestion } from "@/lib/db/repository";
import { notify } from "@/lib/notifications/toast";
import { apiHeaders } from "@/lib/utils/api";
import { useAppStore } from "@/lib/db/useStore";

export default function ConsolePage() {
  const { settings, loadSettings } = useAppStore();
  const [models, setModels] = useState<Array<{ id: string; label: string }>>([]);

  const [helelTrigger, setHelelTrigger] = useState("task_publish");
  const [helelIntensity, setHelelIntensity] = useState("standard");
  const [helelSummary, setHelelSummary] = useState("今天效率偏低");
  const [helelOutput, setHelelOutput] = useState("");
  const [helelModel, setHelelModel] = useState("gpt-5.2");

  const [taskTitle, setTaskTitle] = useState("讀藥理 30 分鐘");

  const [qSubject, setQSubject] = useState("護理");
  const [qTopic, setQTopic] = useState("藥理");
  const [qStem, setQStem] = useState("下列何者為...?");
  const [qOptions, setQOptions] = useState("A\nB\nC\nD");
  const [qAnswer, setQAnswer] = useState("A");
  const [rawText, setRawText] = useState("");

  const [inboxText, setInboxText] = useState("");
  const [inboxPreview, setInboxPreview] = useState<any[]>([]);

  useEffect(() => {
    loadSettings();
    (async () => {
      const resp = await fetch("/api/models", { headers: apiHeaders() });
      const data = await resp.json();
      setModels(data.models ?? []);
    })();
  }, [loadSettings]);

  useEffect(() => {
    if (settings?.models.helelModel) setHelelModel(settings.models.helelModel);
  }, [settings]);

  const callHelel = async () => {
    const resp = await fetch("/api/helel", {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({
        trigger: helelTrigger,
        intensity: helelIntensity,
        model: helelModel,
        userStateSummary: helelSummary,
      }),
    });
    const data = await resp.json();
    setHelelOutput(`${data.message ?? ""} ${data.cta ?? ""}`.trim());
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-2">
        <h2 className="text-lg font-semibold">1. 測試 Helel API</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <select className="h-10 rounded border border-border bg-white px-3" value={helelTrigger} onChange={(e) => setHelelTrigger(e.target.value)}>
            <option value="task_publish">任務發布</option>
            <option value="task_nudge">任務提醒</option>
            <option value="study_prompt">讀書提示</option>
            <option value="life_prompt">生活提示</option>
          </select>
          <select className="h-10 rounded border border-border bg-white px-3" value={helelIntensity} onChange={(e) => setHelelIntensity(e.target.value)}>
            <option value="gentle">溫柔</option>
            <option value="standard">標準</option>
            <option value="strict">嚴格</option>
          </select>
        </div>
        <select
          className="h-10 rounded border border-border bg-white px-3"
          value={helelModel}
          onChange={(e) => setHelelModel(e.target.value)}
        >
          {models.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
        <Textarea value={helelSummary} onChange={(e) => setHelelSummary(e.target.value)} />
        <Button onClick={callHelel}>送出</Button>
        <p className="text-sm">{helelOutput}</p>
      </Card>

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold">2. 快速新增任務</h2>
        <Input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
        <Button
          onClick={async () => {
            const resp = await fetch("/api/ingest/task", {
              method: "POST",
              headers: apiHeaders(),
              body: JSON.stringify({
                title: taskTitle,
                category: "study",
                withHelelLine: true,
                model: helelModel,
              }),
            });
            const data = await resp.json();
            if (data.task) {
              await addTask(data.task);
              notify("任務已新增", data.helel?.message ?? "完成");
            }
          }}
        >
          新增任務
        </Button>
      </Card>

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold">3. 快速新增題目</h2>
        <Input value={qSubject} onChange={(e) => setQSubject(e.target.value)} placeholder="科目" />
        <Input value={qTopic} onChange={(e) => setQTopic(e.target.value)} placeholder="主題" />
        <Textarea value={qStem} onChange={(e) => setQStem(e.target.value)} placeholder="題幹" />
        <Textarea value={qOptions} onChange={(e) => setQOptions(e.target.value)} placeholder="每行一個選項" />
        <Input value={qAnswer} onChange={(e) => setQAnswer(e.target.value)} placeholder="答案" />
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              const resp = await fetch("/api/ingest/question", {
                method: "POST",
                headers: apiHeaders(),
                body: JSON.stringify({
                  mode: "structured",
                  questionDraft: {
                    subject: qSubject,
                    topic: qTopic,
                    type: "single",
                    stem: qStem,
                    options: qOptions.split("\n").filter(Boolean),
                    answer: qAnswer || null,
                    explanation: null,
                  },
                }),
              });
              const data = await resp.json();
              if (data.question) {
                await upsertQuestion(data.question);
                notify("題目已新增", data.question.questionId);
              }
            }}
          >
            新增結構化題目
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const resp = await fetch("/api/ingest/question", {
                method: "POST",
                headers: apiHeaders(),
                body: JSON.stringify({ mode: "raw", rawText, model: settings?.models.parserModel ?? "gpt-5.2" }),
              });
              const data = await resp.json();
              if (data.question) {
                await upsertQuestion(data.question);
                notify("原始文字已解析並新增", data.warnings?.join("; ") ?? "完成");
              }
            }}
          >
            解析原始文字並新增
          </Button>
        </div>
        <Textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="貼上原始題目文字" />
      </Card>

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold">4. 批次匯入題目</h2>
        <Textarea value={inboxText} onChange={(e) => setInboxText(e.target.value)} placeholder="貼上題目文字" />
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              const resp = await fetch("/api/ingest/question-inbox", {
                method: "POST",
                headers: apiHeaders(),
                body: JSON.stringify({ text: inboxText, format: "auto", model: settings?.models.parserModel ?? "gpt-5.2" }),
              });
              const data = await resp.json();
              setInboxPreview(data.questions ?? []);
              notify("預覽完成", `題數=${(data.questions ?? []).length}`);
            }}
          >
            預覽解析
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await bulkUpsertQuestions(inboxPreview);
              notify("批次新增完成", `${inboxPreview.length} 題`);
            }}
          >
            確認新增
          </Button>
        </div>
        <div className="max-h-52 overflow-auto rounded border border-border p-2 text-sm">
          {inboxPreview.map((q) => <p key={q.questionId}>{q.questionId} | {q.subject} | {q.topic}</p>)}
          {inboxPreview.length === 0 && <p>尚未產生預覽。</p>}
        </div>
      </Card>
    </div>
  );
}
