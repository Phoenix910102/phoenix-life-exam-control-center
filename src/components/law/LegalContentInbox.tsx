"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileJson2,
  RefreshCw,
  ScanSearch,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { CommandSceneBackdrop } from "@/components/command-shell/CommandSceneBackdrop";
import { CommandShell } from "@/components/command-shell/CommandShell";
import {
  exampleLegalContentPatch,
  parseAndAnalyzeLegalContentPatch,
  type ContentPatchAnalysis,
} from "@/lib/law/contentPatch";
import styles from "@/app/law/law.module.css";

const DRAFT_KEY = "phoenix.legal.content-patch-draft.v1";

const operationLabels: Record<string, string> = {
  "question.add": "新增題目",
  "question.revise": "修訂題目",
  "question.retire": "退役題目",
  "answer-revision.add": "新增答案版本",
  "lesson-block.add": "新增教材區塊",
  "lesson-block.revise": "修訂教材區塊",
  "term.add": "新增名詞",
  "source.add": "新增來源",
  "link.add": "建立關聯",
  "link.remove": "移除關聯",
};

function targetOf(operation: Record<string, unknown>) {
  const value = operation.value as Record<string, unknown> | undefined;
  return String(operation.key ?? operation.questionKey ?? operation.blockKey ?? value?.key ?? value?.from ?? "未識別");
}

export function LegalContentInbox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [analysis, setAnalysis] = useState<ContentPatchAnalysis>();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(window.localStorage.getItem(DRAFT_KEY) ?? "");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(DRAFT_KEY, draft);
  }, [draft, hydrated]);

  const formattedExample = useMemo(() => JSON.stringify(exampleLegalContentPatch, null, 2), []);

  function validate() {
    setAnalysis(parseAndAnalyzeLegalContentPatch(draft));
  }

  function loadExample() {
    setDraft(formattedExample);
    setAnalysis(parseAndAnalyzeLegalContentPatch(formattedExample));
  }

  async function readFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setDraft(text);
    setAnalysis(parseAndAnalyzeLegalContentPatch(text));
    event.target.value = "";
  }

  function downloadPatch() {
    if (!analysis?.patch) return;
    const blob = new Blob([`${JSON.stringify(analysis.patch, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${analysis.patch.patchId}.phoenix-content-patch.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const statusLabel = analysis?.status === "ready" ? "可進入待審" : analysis?.status === "conflict" ? "存在衝突" : analysis ? "驗證失敗" : "尚未掃描";

  return (
    <CommandShell
      identity={{
        eyebrow: "LEGAL CONTENT INBOX",
        title: "司律內容收件匣",
        subtitle: "Patch 驗證、差異預覽與版本交接",
        breadcrumb: "LAW OPERATIONS / CONTENT INBOX",
      }}
      scene={<CommandSceneBackdrop variant="quiet" />}
      hud={<div className={styles.hud}><span>PATCH SCHEMA</span><strong>v1</strong><i>{statusLabel}</i></div>}
    >
      <div className={styles.inbox}>
        <div className={styles.inboxTopline}>
          <Link href="/law"><ArrowLeft size={16} />返回司律主線</Link>
          <p>草稿保存在這個瀏覽器；正式內容尚未被修改。</p>
        </div>

        <section className={styles.inboxLayout}>
          <div className={styles.editorPanel}>
            <div className={styles.panelHeading}>
              <div><span>PATCH SOURCE</span><h1>增量內容草稿</h1></div>
              <FileJson2 size={24} />
            </div>
            <textarea
              aria-label="Phoenix Content Patch JSON"
              onChange={(event) => { setDraft(event.target.value); setAnalysis(undefined); }}
              placeholder="貼上 Chat 產生的 phoenix.content-patch.v1 JSON"
              spellCheck={false}
              value={draft}
            />
            <div className={styles.editorActions}>
              <button onClick={validate} type="button"><ScanSearch size={16} />驗證 Patch</button>
              <button onClick={() => inputRef.current?.click()} type="button"><Upload size={16} />選擇檔案</button>
              <button onClick={loadExample} type="button"><RefreshCw size={16} />載入範例</button>
              <input accept=".json,.phoenix-content-patch.json,application/json" className={styles.hiddenInput} onChange={readFile} ref={inputRef} type="file" />
            </div>
          </div>

          <aside className={styles.previewPanel} data-status={analysis?.status ?? "idle"}>
            <div className={styles.previewSeal}>
              {analysis?.status === "ready" ? <CheckCircle2 /> : analysis?.status === "conflict" ? <ShieldAlert /> : <AlertTriangle />}
            </div>
            <span className={styles.previewKicker}>VALIDATION REPORT</span>
            <h2>{statusLabel}</h2>
            {analysis?.patch ? (
              <>
                <p>{analysis.patch.summary}</p>
                <dl>
                  <div><dt>Patch</dt><dd>{analysis.patch.patchId}</dd></div>
                  <div><dt>科目</dt><dd>{analysis.patch.target.subjectKey}</dd></div>
                  <div><dt>基準版本</dt><dd>{analysis.patch.target.baseVersion ?? "未指定"}</dd></div>
                  <div><dt>操作數</dt><dd>{analysis.counts.total}</dd></div>
                </dl>
                <button className={styles.downloadAction} disabled={analysis.status !== "ready"} onClick={downloadPatch} type="button">
                  <Download size={16} />匯出待審 Patch
                </button>
              </>
            ) : (
              <p>載入 Patch 後，這裡會顯示目標版本、操作範圍、來源缺口與衝突。</p>
            )}
          </aside>
        </section>

        {analysis ? (
          <section className={styles.analysisBand}>
            <div className={styles.analysisStats}>
              <div><small>ADD</small><strong>{analysis.counts.add}</strong></div>
              <div><small>REVISE</small><strong>{analysis.counts.revise}</strong></div>
              <div><small>RETIRE</small><strong>{analysis.counts.retire}</strong></div>
              <div><small>LINK</small><strong>{analysis.counts.link}</strong></div>
            </div>

            {analysis.issues.length > 0 ? (
              <div className={styles.issueList}>
                {analysis.issues.map((issue, index) => (
                  <article data-severity={issue.severity} key={`${issue.path}-${index}`}>
                    <b>{issue.severity}</b><code>{issue.path}</code><p>{issue.message}</p>
                  </article>
                ))}
              </div>
            ) : null}

            {analysis.patch ? (
              <div className={styles.operationList}>
                <div className={styles.sectionHeading}>
                  <div><span>DIFF PREVIEW</span><h2>操作明細</h2></div>
                  <p>只有列出的資源會被變更。</p>
                </div>
                {analysis.patch.operations.map((operation, index) => (
                  <article key={`${operation.op}-${index}`}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <span><strong>{operationLabels[operation.op]}</strong><code>{targetOf(operation as unknown as Record<string, unknown>)}</code></span>
                    <em>{operation.op}</em>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </CommandShell>
  );
}
