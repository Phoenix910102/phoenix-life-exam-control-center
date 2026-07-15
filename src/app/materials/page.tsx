"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CloudDownload,
  ExternalLink,
  FileJson2,
  FileText,
  Flag,
  FolderOpen,
  Gauge,
  GitBranch,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MaterialExperience } from "@/components/materials/MaterialExperience";
import { notify } from "@/lib/notifications/toast";
import { importStudyMaterial } from "@/lib/materials/importer";
import {
  compareSemver,
  getMaterialImportStatus,
  isPhoenixMaterialFile,
  readMaterialPackageFile,
  type MaterialImportStatus,
  type MaterialValidationIssue,
} from "@/lib/materials/packageImporter";
import {
  addLegacyMaterialChapter,
  deleteMaterialBundle,
  importLegacyStudyMaterial,
  importPhoenixMaterialPackage,
  listMaterialBundles,
  openMaterialChapter,
  recordMaterialQuizAttempt,
  setActiveMaterial,
  updateMaterialChapterProgress,
} from "@/lib/db/repository";
import { apiHeaders } from "@/lib/utils/api";
import type { MaterialPackage } from "@/types/materialPackage";
import type { MaterialBundle, MaterialDefinition } from "@/types/materialRecord";
import type { DomainEventReceipt } from "@/types/domainEvent";

const formatLabels: Record<MaterialDefinition["format"], string> = {
  "phoenix-package": "Phoenix 教材包",
  html: "互動 HTML",
  pdf: "PDF",
  markdown: "Markdown",
  text: "文字",
  json: "一般 JSON",
};

const statusLabels: Record<MaterialImportStatus, string> = {
  new: "新教材",
  "same-version": "已有版本",
  upgrade: "可更新",
  downgrade: "較舊版本",
};

const statusStyles: Record<MaterialImportStatus, string> = {
  new: "border-emerald-300 bg-emerald-50 text-emerald-800",
  "same-version": "border-slate-300 bg-slate-50 text-slate-700",
  upgrade: "border-rose-300 bg-rose-50 text-rose-800",
  downgrade: "border-amber-300 bg-amber-50 text-amber-800",
};

type PackageCandidate = {
  package?: MaterialPackage;
  fileName: string;
  status?: MaterialImportStatus;
  errors?: MaterialValidationIssue[];
  source: "local" | "remote";
  remotePath?: string;
};

type RemoteCatalogItem = {
  name: string;
  path: string;
  sha: string;
  size: number;
  package: MaterialPackage;
};

type RemoteCatalog = {
  items: RemoteCatalogItem[];
  invalidItems: Array<{ name: string; path: string; errors: MaterialValidationIssue[] }>;
  source?: { repo: string; branch: string; path: string };
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

function LegacyMaterialViewer({ definition }: { definition: MaterialDefinition }) {
  if (definition.format === "html") {
    return (
      <iframe
        className="h-[620px] w-full bg-white"
        key={definition.slug}
        sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"
        srcDoc={definition.sourceContent}
        title={`${definition.title}閱讀器`}
      />
    );
  }
  if (definition.format === "pdf") {
    return <iframe className="h-[680px] w-full bg-white" src={definition.sourceContent} title={`${definition.title} PDF`} />;
  }
  return (
    <pre className="max-h-[680px] min-h-[460px] overflow-auto whitespace-pre-wrap bg-white p-6 text-sm leading-7 text-slate-800">
      {definition.sourceContent}
    </pre>
  );
}

function PackagePreview({
  candidate,
  setAsActive,
  allowDowngrade,
  isImporting,
  onSetAsActive,
  onAllowDowngrade,
  onCancel,
  onConfirm,
}: {
  candidate: PackageCandidate;
  setAsActive: boolean;
  allowDowngrade: boolean;
  isImporting: boolean;
  onSetAsActive: (value: boolean) => void;
  onAllowDowngrade: (value: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!candidate.package || !candidate.status) {
    return (
      <section className="border border-rose-300 bg-rose-50/70 p-5">
        <h3 className="font-semibold text-rose-950">教材包驗證失敗</h3>
        <p className="mt-1 text-sm text-rose-800">{candidate.fileName}</p>
        <ul className="mt-4 space-y-2 text-sm text-rose-900">
          {(candidate.errors ?? []).map((error, index) => (
            <li className="border-l-2 border-rose-400 pl-3" key={`${error.path}-${index}`}>
              <strong>{error.path}</strong>：{error.message}
            </li>
          ))}
        </ul>
        <Button className="mt-4" variant="outline" onClick={onCancel}>關閉</Button>
      </section>
    );
  }

  const material = candidate.package;
  const estimatedMinutes = material.chapters.reduce((sum, chapter) => sum + chapter.estimatedMinutes, 0);
  const downgradeBlocked = candidate.status === "downgrade" && !allowDowngrade;
  const sameVersion = candidate.status === "same-version";

  return (
    <section className="overflow-hidden border border-violet-200 bg-[linear-gradient(120deg,rgba(255,247,250,0.96),rgba(247,243,255,0.96))] shadow-sm">
      <div className="grid gap-5 border-b border-violet-200 px-5 py-5 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`border px-2 py-1 text-xs font-semibold ${statusStyles[candidate.status]}`}>{statusLabels[candidate.status]}</span>
            <span className="text-xs font-medium text-violet-700">{material.schema}</span>
            {candidate.source === "remote" && <span className="text-xs text-slate-500">GitHub 收件匣</span>}
          </div>
          <h3 className="mt-3 font-serif text-2xl font-semibold text-violet-950">{material.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{material.description}</p>
        </div>
        <div className="border-l-2 border-rose-700 pl-4 text-sm">
          <p className="font-semibold text-rose-950">v{material.version}</p>
          <p className="mt-1 text-slate-600">{material.subject}</p>
        </div>
      </div>
      <div className="grid gap-px bg-violet-200 sm:grid-cols-4">
        {[
          ["考試", material.exam?.name ?? "未指定"],
          ["章節", `${material.chapters.length} 章`],
          ["預估時間", `${estimatedMinutes} 分鐘`],
          ["製作者", material.generator?.name ?? "未標示"],
        ].map(([label, value]) => (
          <div className="bg-white/80 px-4 py-3" key={label}>
            <p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-violet-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="px-5 py-5">
        <div className="flex flex-wrap gap-2">
          {material.tags.map((tag) => <span className="border border-violet-200 bg-white/70 px-2 py-1 text-xs text-violet-800" key={tag}>{tag}</span>)}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input checked={setAsActive} className="accent-violet-800" onChange={(event) => onSetAsActive(event.target.checked)} type="checkbox" />
            匯入後設為目前主線
          </label>
          {candidate.status === "downgrade" && (
            <label className="flex items-center gap-2 text-amber-900">
              <input checked={allowDowngrade} className="accent-amber-700" onChange={(event) => onAllowDowngrade(event.target.checked)} type="checkbox" />
              我確認要以較舊版本覆蓋內容；既有章節進度仍會保留
            </label>
          )}
        </div>
        {sameVersion && <p className="mt-4 text-sm text-slate-600">同一 slug 與 version 已存在，不會建立重複教材。</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button disabled={isImporting || sameVersion || downgradeBlocked} onClick={onConfirm}>
            {candidate.source === "remote" ? <CloudDownload className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            {candidate.source === "remote" ? "同步 Rékaí 製作的教材" : candidate.status === "upgrade" ? "確認更新教材" : "確認匯入教材"}
          </Button>
          <Button variant="outline" onClick={onCancel}>取消</Button>
        </div>
      </div>
    </section>
  );
}

export default function MaterialsPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const packageInputRef = useRef<HTMLInputElement>(null);
  const legacyInputRef = useRef<HTMLInputElement>(null);
  const [bundles, setBundles] = useState<MaterialBundle[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>();
  const [candidate, setCandidate] = useState<PackageCandidate>();
  const [isImporting, setIsImporting] = useState(false);
  const [setAsActive, setSetAsActive] = useState(false);
  const [allowDowngrade, setAllowDowngrade] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [remoteCatalog, setRemoteCatalog] = useState<RemoteCatalog>();
  const [remoteMessage, setRemoteMessage] = useState<string>();
  const [isCheckingRemote, setIsCheckingRemote] = useState(false);
  const [battlefieldEventReceipts, setBattlefieldEventReceipts] = useState<DomainEventReceipt[]>([]);

  const queueBattlefieldEvents = useCallback((receipts: DomainEventReceipt[]) => {
    setBattlefieldEventReceipts((current) => {
      const known = new Set(current.map((receipt) => receipt.event.id));
      return current.concat(receipts.filter((receipt) => !known.has(receipt.event.id)));
    });
  }, []);

  const consumeBattlefieldEvents = useCallback((eventIds: string[]) => {
    const consumed = new Set(eventIds);
    setBattlefieldEventReceipts((current) => current.filter((receipt) => !consumed.has(receipt.event.id)));
  }, []);

  const refresh = useCallback(async (preferredSlug?: string) => {
    const next = await listMaterialBundles();
    setBundles(next);
    setSelectedSlug((current) => {
      if (preferredSlug && next.some((item) => item.definition.slug === preferredSlug)) return preferredSlug;
      if (current && next.some((item) => item.definition.slug === current)) return current;
      return next.find((item) => item.progress.isActive)?.definition.slug ?? next[0]?.definition.slug;
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selected = useMemo(
    () => bundles.find((bundle) => bundle.definition.slug === selectedSlug),
    [bundles, selectedSlug],
  );
  const activeChapter = selected?.definition.chapters.find(
    (chapter) => chapter.key === selected.progress.activeChapterKey,
  ) ?? selected?.definition.chapters[0];
  const totalChapters = bundles.reduce((sum, bundle) => sum + bundle.definition.chapters.length, 0);
  const completedChapters = bundles.reduce((sum, bundle) => sum + bundle.progress.completedChapterKeys.length, 0);
  const activeMaterial = bundles.find((bundle) => bundle.progress.isActive);
  const isImmersive = selected?.definition.presentation?.layout === "immersive-academy";

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setBattlefieldEventReceipts([]);
  }, [selectedSlug]);

  const preparePackage = async (file: File, source: PackageCandidate["source"] = "local", remotePath?: string) => {
    const result = await readMaterialPackageFile(file);
    if (!result.success) {
      setCandidate({ fileName: file.name, errors: result.errors, source, remotePath });
      return;
    }
    const existing = bundles.find((item) => item.definition.slug === result.package.slug)?.definition;
    setCandidate({
      package: result.package,
      fileName: file.name,
      status: getMaterialImportStatus(result.package, existing),
      source,
      remotePath,
    });
    setSetAsActive(!activeMaterial);
    setAllowDowngrade(false);
  };

  const handleLegacyImport = async (files: FileList | null) => {
    if (!files?.length) return;
    setIsImporting(true);
    let latestSlug: string | undefined;
    try {
      for (const file of Array.from(files)) {
        if (isPhoenixMaterialFile(file.name)) {
          await preparePackage(file);
          continue;
        }
        const material = await importStudyMaterial(file);
        const shouldActivate = !activeMaterial && !latestSlug;
        const converted = await importLegacyStudyMaterial({ ...material, isActive: shouldActivate });
        latestSlug = converted.definition.slug;
      }
      await refresh(latestSlug);
      notify("一般教材已匯入", `${files.length} 個檔案已處理`);
    } catch (error) {
      notify("教材匯入失敗", error instanceof Error ? error.message : "請確認檔案格式");
    } finally {
      setIsImporting(false);
      if (legacyInputRef.current) legacyInputRef.current.value = "";
    }
  };

  const confirmPackageImport = async () => {
    if (!candidate?.package || !candidate.status) return;
    setIsImporting(true);
    try {
      let material = candidate.package;
      let fileName = candidate.fileName;
      if (candidate.source === "remote") {
        const response = await fetch("/api/materials/remote/sync", {
          method: "POST",
          headers: apiHeaders(),
          body: JSON.stringify({
            paths: [candidate.remotePath],
            localMaterials: bundles.map((item) => ({ slug: item.definition.slug, version: item.definition.version })),
          }),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.message ?? "遠端教材同步失敗");
        material = body.items[0].package as MaterialPackage;
        fileName = body.items[0].name as string;
      }
      const result = await importPhoenixMaterialPackage(material, fileName, {
        allowDowngrade,
        setActive: setAsActive,
      });
      await refresh(result.definition.slug);
      setCandidate(undefined);
      notify(candidate.status === "upgrade" ? "教材已更新" : "Phoenix 教材已匯入", `${material.title} v${material.version}`);
    } catch (error) {
      notify("Phoenix 教材匯入失敗", error instanceof Error ? error.message : "教材包無法寫入");
    } finally {
      setIsImporting(false);
      if (packageInputRef.current) packageInputRef.current.value = "";
    }
  };

  const checkRemoteInbox = async () => {
    setIsCheckingRemote(true);
    setRemoteMessage(undefined);
    try {
      const response = await fetch("/api/materials/remote", { headers: apiHeaders() });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? "GitHub 教材收件匣讀取失敗");
      setRemoteCatalog(body as RemoteCatalog);
      if (body.items.length === 0) setRemoteMessage("收件匣目前沒有 Phoenix 教材包。");
    } catch (error) {
      setRemoteCatalog(undefined);
      setRemoteMessage(error instanceof Error ? error.message : "GitHub 教材收件匣讀取失敗");
    } finally {
      setIsCheckingRemote(false);
    }
  };

  const previewExamplePackage = async () => {
    try {
      const response = await fetch("/api/materials/example", { headers: apiHeaders() });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? "範例教材讀取失敗");
      const material = body.package as MaterialPackage;
      const existing = bundles.find((bundle) => bundle.definition.slug === material.slug)?.definition;
      setCandidate({
        package: material,
        fileName: body.fileName as string,
        status: getMaterialImportStatus(material, existing),
        source: "local",
      });
      setSetAsActive(!activeMaterial);
      setAllowDowngrade(false);
    } catch (error) {
      notify("範例教材讀取失敗", error instanceof Error ? error.message : "請稍後再試");
    }
  };

  const selectRemoteCandidate = (item: RemoteCatalogItem) => {
    const existing = bundles.find((bundle) => bundle.definition.slug === item.package.slug)?.definition;
    setCandidate({
      package: item.package,
      fileName: item.name,
      status: getMaterialImportStatus(item.package, existing),
      source: "remote",
      remotePath: item.path,
    });
    setSetAsActive(!activeMaterial);
    setAllowDowngrade(false);
  };

  const changeProgress = async (chapterKey: string, value: number) => {
    if (!selected) return;
    const result = await updateMaterialChapterProgress(selected.definition.slug, chapterKey, value);
    if (result) queueBattlefieldEvents(result.eventReceipts);
    await refresh(selected.definition.slug);
  };

  const selectChapter = async (chapterKey: string) => {
    if (!selected) return;
    const result = await openMaterialChapter(selected.definition.slug, chapterKey);
    if (result) queueBattlefieldEvents(result.eventReceipts);
    await refresh(selected.definition.slug);
  };

  const addChapter = async () => {
    if (!selected || selected.definition.kind !== "legacy" || !newChapterTitle.trim()) return;
    await addLegacyMaterialChapter(selected.definition.slug, newChapterTitle);
    setNewChapterTitle("");
    await refresh(selected.definition.slug);
  };

  const openStandalone = () => {
    const sourceContent = selected?.definition.sourceContent;
    if (!selected || !sourceContent) return;
    const definition = selected.definition;
    if (definition.contentEncoding === "data-url") {
      window.open(sourceContent, "_blank", "noopener,noreferrer");
      return;
    }
    const blob = new Blob([sourceContent], { type: definition.mimeType || "text/plain" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <main className="space-y-7" data-hydrated={isHydrated} data-testid="materials-page">
      <section className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Phoenix × Rékaí Material Protocol</p>
          <h2 className="mt-1 text-2xl font-semibold">教材協議與教材收件匣</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            一般檔案繼續留在本機；Rékaí 製作的版本化教材會先驗證、預覽，再依 slug 更新內容並保留章節進度。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={previewExamplePackage}>
            <Sparkles className="mr-2 h-4 w-4" />預覽 3D 範例
          </Button>
          <Button variant="outline" onClick={() => window.open("/legacy/criminal-law-general-principles/", "_blank", "noopener,noreferrer")}>
            <ExternalLink className="mr-2 h-4 w-4" />罪責玫瑰原型
          </Button>
          <Button variant="outline" onClick={checkRemoteInbox} disabled={isCheckingRemote}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isCheckingRemote ? "animate-spin" : ""}`} />
            檢查 GitHub 收件匣
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div
          className="border border-violet-300 bg-[linear-gradient(135deg,rgba(255,247,250,0.9),rgba(245,243,255,0.9))] p-5 transition hover:border-violet-500"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file) preparePackage(file);
          }}
        >
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center bg-violet-950 text-white"><Sparkles className="h-5 w-5" /></div>
            <div>
              <h3 className="font-semibold text-violet-950">匯入 Phoenix 教材包</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">拖放或選擇 <code>.phoenix-material.json</code>，先驗證與預覽，不會立刻寫入。</p>
            </div>
          </div>
          <Input
            ref={packageInputRef}
            className="hidden"
            type="file"
            accept=".phoenix-material.json,application/json"
            onChange={(event) => event.target.files?.[0] && preparePackage(event.target.files[0])}
          />
          <Button className="mt-4" onClick={() => packageInputRef.current?.click()}>
            <FileJson2 className="mr-2 h-4 w-4" />選擇 Phoenix 教材包
          </Button>
        </div>

        <div className="border border-slate-300 bg-white/70 p-5 transition hover:border-slate-500">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center bg-slate-800 text-white"><Upload className="h-5 w-5" /></div>
            <div>
              <h3 className="font-semibold text-slate-900">匯入一般檔案</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">保留既有 HTML、PDF、Markdown、TXT 與一般 JSON 匯入流程。</p>
            </div>
          </div>
          <Input
            ref={legacyInputRef}
            className="hidden"
            type="file"
            multiple
            accept=".html,.htm,.pdf,.md,.markdown,.txt,.json,text/html,application/pdf,text/plain,application/json"
            onChange={(event) => handleLegacyImport(event.target.files)}
          />
          <Button className="mt-4" variant="outline" disabled={isImporting} onClick={() => legacyInputRef.current?.click()}>
            <FolderOpen className="mr-2 h-4 w-4" />選擇一般教材
          </Button>
        </div>
      </section>

      {candidate && (
        <PackagePreview
          candidate={candidate}
          setAsActive={setAsActive}
          allowDowngrade={allowDowngrade}
          isImporting={isImporting}
          onSetAsActive={setSetAsActive}
          onAllowDowngrade={setAllowDowngrade}
          onCancel={() => setCandidate(undefined)}
          onConfirm={confirmPackageImport}
        />
      )}

      {(remoteCatalog || remoteMessage) && (
        <section className="border-y border-violet-200 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-violet-950"><GitBranch className="h-4 w-4" />Rékaí 教材收件匣</h3>
              {remoteCatalog?.source && <p className="mt-1 text-xs text-slate-500">{remoteCatalog.source.repo} · {remoteCatalog.source.branch} · {remoteCatalog.source.path}</p>}
            </div>
            {remoteCatalog?.invalidItems.length ? <span className="text-xs text-rose-700">{remoteCatalog.invalidItems.length} 份檔案未通過驗證</span> : null}
          </div>
          {remoteMessage && <p className="mt-3 border-l-2 border-amber-400 pl-3 text-sm text-amber-900">{remoteMessage}</p>}
          {remoteCatalog && remoteCatalog.items.length > 0 && (
            <div className="mt-4 divide-y divide-violet-100 border-y border-violet-200">
              {remoteCatalog.items.map((item) => {
                const existing = bundles.find((bundle) => bundle.definition.slug === item.package.slug)?.definition;
                const status = getMaterialImportStatus(item.package, existing);
                return (
                  <div className="grid gap-3 bg-white/60 px-4 py-4 md:grid-cols-[1fr_auto_auto] md:items-center" key={item.path}>
                    <div>
                      <p className="font-medium text-violet-950">{item.package.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.package.subject} · v{item.package.version} · {item.package.chapters.length} 章</p>
                    </div>
                    <span className={`w-fit border px-2 py-1 text-xs font-semibold ${statusStyles[status]}`}>{statusLabels[status]}</span>
                    <Button size="sm" variant="outline" onClick={() => selectRemoteCandidate(item)}>預覽</Button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
        {[
          ["教材", bundles.length],
          ["章節", totalChapters],
          ["已完成", completedChapters],
          ["目前主線", activeMaterial?.definition.title ?? "未設定"],
        ].map(([label, value]) => (
          <div className="bg-white px-4 py-3" key={String(label)}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 truncate text-lg font-semibold">{value}</p>
          </div>
        ))}
      </section>

      {bundles.length === 0 ? (
        <section className="grid min-h-[360px] place-items-center border border-dashed border-border bg-white/60 p-8 text-center">
          <div className="max-w-md">
            <FolderOpen className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">教材收件匣還是空的</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">可以匯入 preview.html，也可以先試用 repository 內的梯度下降 Phoenix 範例教材。</p>
            <Button className="mt-4" variant="outline" onClick={previewExamplePackage}>
              <Sparkles className="mr-2 h-4 w-4" />預覽內建範例
            </Button>
          </div>
        </section>
      ) : (
        <div className={isImmersive ? "grid gap-6" : "grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)]"}>
          <aside className={isImmersive ? "grid gap-3 border-b border-border pb-5 md:grid-cols-[150px_minmax(0,1fr)]" : "space-y-3"}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">我的教材</h3><span className="text-xs text-muted-foreground">{bundles.length} 份</span>
            </div>
            <div className={isImmersive ? "grid gap-2 md:grid-cols-2 xl:grid-cols-3" : "space-y-2"}>
              {bundles.map((bundle) => {
                const { definition, progress } = bundle;
                const remoteUpdate = remoteCatalog?.items.find(
                  (item) => item.package.slug === definition.slug && compareSemver(item.package.version, definition.version) > 0,
                );
                return (
                  <button
                    className={`w-full border p-3 text-left transition ${definition.slug === selectedSlug ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-white/80 hover:border-primary/40"}`}
                    key={definition.slug}
                    onClick={() => setSelectedSlug(definition.slug)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{definition.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{definition.subject} · v{definition.version}</p>
                      </div>
                      {progress.isActive && <Flag className="h-4 w-4 shrink-0 fill-primary text-primary" />}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {definition.kind === "phoenix-package" && <span className="bg-violet-950 px-1.5 py-0.5 text-[10px] font-semibold text-white">Rékaí 製作</span>}
                      {remoteUpdate && <span className="bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-800">新版 v{remoteUpdate.package.version}</span>}
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${progress.overallProgress}%` }} /></div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{progress.overallProgress}%</span><span>{formatDate(progress.lastOpenedAt)}</span></div>
                  </button>
                );
              })}
            </div>
          </aside>

          {selected && activeChapter && (
            <section className="min-w-0 space-y-5">
              <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-xl font-semibold">{selected.definition.title}</h3>
                    {selected.progress.isActive && <span className="inline-flex items-center bg-primary/10 px-2 py-1 text-xs font-medium text-primary"><Flag className="mr-1 h-3 w-3" />目前主線</span>}
                    {selected.definition.kind === "phoenix-package" && <span className="inline-flex items-center bg-violet-950 px-2 py-1 text-xs font-medium text-white"><Sparkles className="mr-1 h-3 w-3" />Rékaí 製作</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{formatLabels[selected.definition.format]} · {selected.definition.sourceFileName}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!selected.progress.isActive && <Button variant="outline" onClick={async () => { await setActiveMaterial(selected.definition.slug); await refresh(selected.definition.slug); notify("主線已切換", selected.definition.title); }}><Flag className="mr-2 h-4 w-4" />設為主線</Button>}
                  {selected.definition.kind === "legacy" && <Button variant="outline" onClick={openStandalone}><ExternalLink className="mr-2 h-4 w-4" />獨立閱讀</Button>}
                  <Button variant="outline" className="text-red-700" onClick={async () => { if (!window.confirm(`確定刪除「${selected.definition.title}」與它的進度？`)) return; await deleteMaterialBundle(selected.definition.slug); await refresh(); notify("教材已刪除"); }}>
                    <Trash2 className="h-4 w-4" /><span className="sr-only">刪除教材</span>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                <div>
                  <div className="flex items-center justify-between text-sm"><span className="font-medium">整體進度</span><strong>{selected.progress.overallProgress}%</strong></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${selected.progress.overallProgress}%` }} /></div>
                </div>
                <Button onClick={() => changeProgress(activeChapter.key, (selected.progress.chapterProgress[activeChapter.key] ?? 0) + 10)} disabled={(selected.progress.chapterProgress[activeChapter.key] ?? 0) >= 100}>
                  <ChevronRight className="mr-2 h-4 w-4" />下一步 +10%
                </Button>
              </div>

              <div className={isImmersive ? "block" : "grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"}>
                <div className="overflow-hidden border border-border bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium"><BookOpen className="h-4 w-4 text-primary" />教材閱讀器</div>
                    <span className="text-xs text-muted-foreground">{formatLabels[selected.definition.format]}</span>
                  </div>
                  {selected.definition.kind === "phoenix-package" ? (
                    <MaterialExperience
                      key={`${selected.definition.slug}-${activeChapter.key}`}
                      definition={selected.definition}
                      progress={selected.progress}
                      chapterKey={activeChapter.key}
                      battlefieldEventReceipts={battlefieldEventReceipts}
                      onBattlefieldEventReceipts={queueBattlefieldEvents}
                      onBattlefieldEventReceiptsConsumed={consumeBattlefieldEvents}
                      onChapterSelect={selectChapter}
                      onChapterProgressChange={changeProgress}
                      onQuizAttempt={async (attempt) => {
                        const result = await recordMaterialQuizAttempt(selected.definition.slug, attempt);
                        if (result) queueBattlefieldEvents(result.eventReceipts);
                        await refresh(selected.definition.slug);
                      }}
                    />
                  ) : <LegacyMaterialViewer definition={selected.definition} />}
                </div>

                {!isImmersive && <aside className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-semibold"><Gauge className="h-4 w-4 text-primary" />章節進度</h4>
                      <span className="text-xs text-muted-foreground">{selected.progress.completedChapterKeys.length}/{selected.definition.chapters.length}</span>
                    </div>
                    <div className="mt-3 max-h-[650px] space-y-2 overflow-auto pr-1">
                      {selected.definition.chapters.map((chapter) => {
                        const progress = selected.progress.chapterProgress[chapter.key] ?? 0;
                        return (
                          <Card className={`space-y-3 p-3 ${chapter.key === activeChapter.key ? "border-primary" : ""}`} key={chapter.key}>
                            <button className="flex w-full items-start gap-2 text-left" onClick={() => changeProgress(chapter.key, progress)}>
                              {progress >= 100 ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
                              <span className="min-w-0 flex-1 text-sm font-medium leading-5">{chapter.title}</span><span className="text-xs text-muted-foreground">{progress}%</span>
                            </button>
                            {selected.definition.kind === "phoenix-package" && <p className="line-clamp-2 text-xs leading-5 text-slate-500">{chapter.summary} · {chapter.estimatedMinutes} 分鐘</p>}
                            <input aria-label={`${chapter.title}進度`} className="w-full accent-emerald-700" type="range" min="0" max="100" step="10" value={progress} onChange={(event) => changeProgress(chapter.key, Number(event.target.value))} />
                            <div className="flex gap-2">
                              <Button className="flex-1" size="sm" variant="outline" onClick={() => changeProgress(chapter.key, progress + 10)} disabled={progress >= 100}><Plus className="mr-1 h-3.5 w-3.5" />10%</Button>
                              <Button className="flex-1" size="sm" variant={progress >= 100 ? "default" : "outline"} onClick={() => changeProgress(chapter.key, progress >= 100 ? 0 : 100)}><Check className="mr-1 h-3.5 w-3.5" />{progress >= 100 ? "重開" : "完成"}</Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {selected.definition.kind === "legacy" && (
                    <div className="border-t border-border pt-4">
                      <p className="text-sm font-semibold">新增自己的進度單元</p>
                      <div className="mt-2 flex gap-2">
                        <Input placeholder="例如：第 20–40 頁" value={newChapterTitle} onChange={(event) => setNewChapterTitle(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addChapter()} />
                        <Button size="sm" onClick={addChapter} disabled={!newChapterTitle.trim()}><Plus className="h-4 w-4" /><span className="sr-only">新增單元</span></Button>
                      </div>
                    </div>
                  )}
                </aside>}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
