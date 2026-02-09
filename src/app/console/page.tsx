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
        <h2 className="text-lg font-semibold">1) Test Helel API</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <select className="h-10 rounded border border-border bg-white px-3" value={helelTrigger} onChange={(e) => setHelelTrigger(e.target.value)}>
            <option value="task_publish">task_publish</option>
            <option value="task_nudge">task_nudge</option>
            <option value="study_prompt">study_prompt</option>
            <option value="life_prompt">life_prompt</option>
          </select>
          <select className="h-10 rounded border border-border bg-white px-3" value={helelIntensity} onChange={(e) => setHelelIntensity(e.target.value)}>
            <option value="gentle">gentle</option>
            <option value="standard">standard</option>
            <option value="strict">strict</option>
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
        <Button onClick={callHelel}>Send</Button>
        <p className="text-sm">{helelOutput}</p>
      </Card>

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold">2) Quick add Task</h2>
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
              notify("Task inserted", data.helel?.message ?? "done");
            }
          }}
        >
          Insert Task
        </Button>
      </Card>

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold">3) Quick add Question</h2>
        <Input value={qSubject} onChange={(e) => setQSubject(e.target.value)} placeholder="subject" />
        <Input value={qTopic} onChange={(e) => setQTopic(e.target.value)} placeholder="topic" />
        <Textarea value={qStem} onChange={(e) => setQStem(e.target.value)} placeholder="stem" />
        <Textarea value={qOptions} onChange={(e) => setQOptions(e.target.value)} placeholder="one option per line" />
        <Input value={qAnswer} onChange={(e) => setQAnswer(e.target.value)} placeholder="answer" />
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
                notify("Question inserted", data.question.questionId);
              }
            }}
          >
            Insert Structured
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
                notify("Raw parsed + inserted", data.warnings?.join("; ") ?? "done");
              }
            }}
          >
            Parse Raw + Insert
          </Button>
        </div>
        <Textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="raw text parser" />
      </Card>

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold">4) Inbox batch import</h2>
        <Textarea value={inboxText} onChange={(e) => setInboxText(e.target.value)} placeholder="paste text" />
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
              notify("Preview ready", `questions=${(data.questions ?? []).length}`);
            }}
          >
            Preview Parse
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await bulkUpsertQuestions(inboxPreview);
              notify("Bulk insert complete", `${inboxPreview.length} items`);
            }}
          >
            Confirm Insert
          </Button>
        </div>
        <div className="max-h-52 overflow-auto rounded border border-border p-2 text-sm">
          {inboxPreview.map((q) => <p key={q.questionId}>{q.questionId} | {q.subject} | {q.topic}</p>)}
          {inboxPreview.length === 0 && <p>No preview yet.</p>}
        </div>
      </Card>
    </div>
  );
}
