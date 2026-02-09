"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/db/useStore";
import { notify } from "@/lib/notifications/toast";
import { buildFullBackup, buildSnapshot } from "@/lib/export/builders";
import { downloadJson } from "@/lib/export/download";
import { bulkUpsertQuestions } from "@/lib/db/repository";
import { questionSchema } from "@/types/question";
import { newId } from "@/lib/utils/id";
import { apiHeaders } from "@/lib/utils/api";

export default function SettingsPage() {
  const { settings, loadSettings, saveSettings } = useAppStore();
  const [models, setModels] = useState<Array<{ id: string; label: string }>>([]);
  const [generatedAt, setGeneratedAt] = useState("");
  const [helelPreview, setHelelPreview] = useState("");

  useEffect(() => {
    loadSettings();
    (async () => {
      const res = await fetch("/api/models", { headers: apiHeaders() });
      const data = await res.json();
      setModels(data.models ?? []);
    })();
  }, [loadSettings]);

  const onImportJsonl = async (file: File) => {
    const text = await file.text();
    const lines = text.split("\n").map((x) => x.trim()).filter(Boolean);
    const parsed = lines.map((line) => {
      const raw = JSON.parse(line);
      return questionSchema.parse({ ...raw, questionId: raw.questionId ?? newId("q") });
    });
    await bulkUpsertQuestions(parsed);
    notify("Question bank imported", `${parsed.length} questions`);
  };

  if (!settings) return <Card>Loading settings...</Card>;

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Models</h2>
        <label className="text-sm">Helel model</label>
        <select
          className="h-10 rounded border border-border bg-white px-3 text-sm"
          value={settings.models.helelModel}
          onChange={(e) => saveSettings({ models: { ...settings.models, helelModel: e.target.value } })}
        >
          {models.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>

        <label className="text-sm">Parser model</label>
        <select
          className="h-10 rounded border border-border bg-white px-3 text-sm"
          value={settings.models.parserModel}
          onChange={(e) => saveSettings({ models: { ...settings.models, parserModel: e.target.value } })}
        >
          {models.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>

        <Button
          onClick={async () => {
            const resp = await fetch("/api/helel", {
              method: "POST",
              headers: apiHeaders(),
              body: JSON.stringify({
                trigger: "life_prompt",
                intensity: settings.notifications.intensity,
                model: settings.models.helelModel,
                userStateSummary: "測試模型回覆",
              }),
            });
            const data = await resp.json();
            setHelelPreview(`${data.message ?? ""} ${data.cta ?? ""}`.trim());
          }}
        >
          Test
        </Button>
        <p className="text-sm">{helelPreview}</p>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Question Bank Import (JSONL)</h2>
        <Input type="file" accept=".jsonl,.txt" onChange={(e) => e.target.files?.[0] && onImportJsonl(e.target.files[0])} />
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Export</h2>
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              const x = await buildSnapshot();
              downloadJson(x.filename, x.data);
              setGeneratedAt(new Date().toLocaleString());
            }}
          >
            Download Snapshot
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const x = await buildFullBackup();
              downloadJson(x.filename, x.data);
              setGeneratedAt(new Date().toLocaleString());
            }}
          >
            Download Full Backup
          </Button>
        </div>
        <p className="text-sm">generated at: {generatedAt || "-"}</p>
      </Card>
    </div>
  );
}
