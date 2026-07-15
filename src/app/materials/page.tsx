"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  Flag,
  FolderOpen,
  Gauge,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { notify } from "@/lib/notifications/toast";
import { importStudyMaterial } from "@/lib/materials/importer";
import {
  deleteStudyMaterial,
  listStudyMaterials,
  putStudyMaterial,
  setActiveStudyMaterial,
  updateStudyMaterialProgress,
} from "@/lib/db/repository";
import { newId } from "@/lib/utils/id";
import type { StudyMaterial } from "@/types/studyMaterial";

const formatLabels: Record<StudyMaterial["format"], string> = {
  html: "互動 HTML",
  pdf: "PDF",
  markdown: "Markdown",
  text: "文字",
  json: "JSON",
};

function formatDate(value?: string) {
  if (!value) return "尚未開啟";
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function MaterialViewer({ material }: { material: StudyMaterial }) {
  if (material.format === "html") {
    return (
      <iframe
        className="h-[620px] w-full bg-white"
        key={material.id}
        sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"
        srcDoc={material.sourceContent}
        title={`${material.title}閱讀器`}
      />
    );
  }

  if (material.format === "pdf") {
    return <iframe className="h-[680px] w-full bg-white" src={material.sourceContent} title={`${material.title} PDF`} />;
  }

  return (
    <pre className="max-h-[680px] min-h-[460px] overflow-auto whitespace-pre-wrap bg-white p-6 text-sm leading-7 text-slate-800">
      {material.sourceContent}
    </pre>
  );
}
export default function MaterialsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [isImporting, setIsImporting] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");

  const refresh = useCallback(async (preferredId?: string) => {
    const next = await listStudyMaterials();
    setMaterials(next);
    setSelectedId((current) => {
      if (preferredId && next.some((item) => item.id === preferredId)) return preferredId;
      if (current && next.some((item) => item.id === current)) return current;
      return next.find((item) => item.isActive)?.id ?? next[0]?.id;
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selected = useMemo(
    () => materials.find((material) => material.id === selectedId),
    [materials, selectedId],
  );
  const activeChapter = selected?.chapters.find((chapter) => chapter.id === selected.activeChapterId) ?? selected?.chapters[0];
  const totalChapters = materials.reduce((sum, material) => sum + material.chapters.length, 0);
  const completedChapters = materials.reduce(
    (sum, material) => sum + material.chapters.filter((chapter) => chapter.completed).length,
    0,
  );

  const handleImport = async (files: FileList | null) => {
    if (!files?.length) return;
    setIsImporting(true);
    let latestId: string | undefined;
    try {
      for (const file of Array.from(files)) {
        const material = await importStudyMaterial(file);
        const shouldActivate = materials.length === 0 && !latestId;
        await putStudyMaterial({ ...material, isActive: shouldActivate });
        latestId = material.id;
      }
      await refresh(latestId);
      notify("教材已匯入", `${files.length} 份教材已加入教材庫`);
    } catch (error) {
      notify("教材匯入失敗", error instanceof Error ? error.message : "請確認檔案格式");
    } finally {
      setIsImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const changeProgress = async (chapterId: string, value: number) => {
    if (!selected) return;
    await updateStudyMaterialProgress(selected.id, chapterId, value);
    await refresh(selected.id);
  };

  const addChapter = async () => {
    if (!selected || !newChapterTitle.trim()) return;
    const now = new Date().toISOString();
    const chapters = [
      ...selected.chapters,
      {
        id: newId("chapter"),
        title: newChapterTitle.trim(),
        order: selected.chapters.length,
        progress: 0,
        completed: false,
      },
    ];
    await putStudyMaterial({ ...selected, chapters, updatedAt: now });
    setNewChapterTitle("");
    await refresh(selected.id);
  };

  const openStandalone = () => {
    if (!selected) return;
    if (selected.contentEncoding === "data-url") {
      window.open(selected.sourceContent, "_blank", "noopener,noreferrer");
      return;
    }
    const blob = new Blob([selected.sourceContent], { type: selected.mimeType || "text/plain" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Study Library</p>
          <h2 className="mt-1 text-2xl font-semibold">教材中心</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            匯入教材、選擇目前主線，章節進度會留在這台裝置並跟完整備份一起匯出。
          </p>
        </div>
        <div>
          <Input
            ref={inputRef}
            className="hidden"
            type="file"
            multiple
            accept=".html,.htm,.pdf,.md,.markdown,.txt,.json,text/html,application/pdf,text/plain,application/json"
            onChange={(event) => handleImport(event.target.files)}
          />
          <Button disabled={isImporting} onClick={() => inputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            {isImporting ? "匯入中…" : "匯入教材"}
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
        {[
          ["教材", materials.length],
          ["章節", totalChapters],
          ["已完成", completedChapters],
          ["目前主線", materials.find((item) => item.isActive)?.title ?? "未設定"],
        ].map(([label, value]) => (
          <div className="bg-white px-4 py-3" key={String(label)}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 truncate text-lg font-semibold">{value}</p>
          </div>
        ))}
      </section>

      {materials.length === 0 ? (
        <section className="grid min-h-[430px] place-items-center rounded-lg border border-dashed border-border bg-white/60 p-8 text-center">
          <div className="max-w-md">
            <FolderOpen className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">教材庫還是空的</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              可以先匯入目前的 preview.html。HTML 會自動抓標題與章節，PDF 會保留原檔並讓妳自己建立進度單元。
            </p>
            <Button className="mt-5" onClick={() => inputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />選擇第一份教材
            </Button>
          </div>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">我的教材</h3>
              <span className="text-xs text-muted-foreground">{materials.length} 份</span>
            </div>
            <div className="space-y-2">
              {materials.map((material) => (
                <button
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    material.id === selectedId
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-white/80 hover:border-primary/40"
                  }`}
                  key={material.id}
                  onClick={() => setSelectedId(material.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{material.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatLabels[material.format]} · {material.chapters.length} 章
                      </p>
                    </div>
                    {material.isActive && <Flag className="h-4 w-4 shrink-0 fill-primary text-primary" />}
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${material.progressPercent}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{material.progressPercent}%</span>
                    <span>{formatDate(material.lastOpenedAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {selected && (
            <section className="min-w-0 space-y-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-xl font-semibold">{selected.title}</h3>
                    {selected.isActive && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        <Flag className="mr-1 h-3 w-3" />目前主線
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.sourceFileName}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!selected.isActive && (
                    <Button
                      variant="outline"
                      onClick={async () => {
                        await setActiveStudyMaterial(selected.id);
                        await refresh(selected.id);
                        notify("主線已切換", selected.title);
                      }}
                    >
                      <Flag className="mr-2 h-4 w-4" />設為主線
                    </Button>
                  )}
                  <Button variant="outline" onClick={openStandalone}>
                    <ExternalLink className="mr-2 h-4 w-4" />獨立閱讀
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-700"
                    onClick={async () => {
                      if (!window.confirm(`確定刪除「${selected.title}」與它的進度？`)) return;
                      await deleteStudyMaterial(selected.id);
                      await refresh();
                      notify("教材已刪除");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">刪除教材</span>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">整體進度</span>
                    <strong>{selected.progressPercent}%</strong>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${selected.progressPercent}%` }} />
                  </div>
                </div>
                <Button
                  onClick={() => activeChapter && changeProgress(activeChapter.id, activeChapter.progress + 10)}
                  disabled={!activeChapter || activeChapter.progress >= 100}
                >
                  <ChevronRight className="mr-2 h-4 w-4" />下一步 +10%
                </Button>
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
                <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BookOpen className="h-4 w-4 text-primary" />教材閱讀器
                    </div>
                    <span className="text-xs text-muted-foreground">{formatLabels[selected.format]}</span>
                  </div>
                  <MaterialViewer material={selected} />
                </div>

                <aside className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-semibold">
                        <Gauge className="h-4 w-4 text-primary" />章節進度
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {selected.chapters.filter((chapter) => chapter.completed).length}/{selected.chapters.length}
                      </span>
                    </div>
                    <div className="mt-3 max-h-[570px] space-y-2 overflow-auto pr-1">
                      {selected.chapters.map((chapter) => (
                        <Card
                          className={`space-y-3 p-3 ${chapter.id === selected.activeChapterId ? "border-primary" : ""}`}
                          key={chapter.id}
                        >
                          <button
                            className="flex w-full items-start gap-2 text-left"
                            onClick={() => changeProgress(chapter.id, chapter.progress)}
                          >
                            {chapter.completed ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            ) : (
                              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            )}
                            <span className="min-w-0 flex-1 text-sm font-medium leading-5">{chapter.title}</span>
                            <span className="text-xs text-muted-foreground">{chapter.progress}%</span>
                          </button>
                          <input
                            aria-label={`${chapter.title}進度`}
                            className="w-full accent-emerald-700"
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={chapter.progress}
                            onChange={(event) => changeProgress(chapter.id, Number(event.target.value))}
                          />
                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              size="sm"
                              variant="outline"
                              onClick={() => changeProgress(chapter.id, chapter.progress + 10)}
                              disabled={chapter.progress >= 100}
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" />10%
                            </Button>
                            <Button
                              className="flex-1"
                              size="sm"
                              variant={chapter.completed ? "default" : "outline"}
                              onClick={() => changeProgress(chapter.id, chapter.completed ? 0 : 100)}
                            >
                              <Check className="mr-1 h-3.5 w-3.5" />{chapter.completed ? "重開" : "完成"}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-semibold">新增自己的進度單元</p>
                    <div className="mt-2 flex gap-2">
                      <Input
                        placeholder="例如：第 20–40 頁"
                        value={newChapterTitle}
                        onChange={(event) => setNewChapterTitle(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && addChapter()}
                      />
                      <Button size="sm" onClick={addChapter} disabled={!newChapterTitle.trim()}>
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">新增單元</span>
                      </Button>
                    </div>
                  </div>
                </aside>
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
