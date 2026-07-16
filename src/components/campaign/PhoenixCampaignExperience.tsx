"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Flag, Library, RefreshCw, ShieldAlert } from "lucide-react";
import { CommandSceneBackdrop } from "@/components/command-shell/CommandSceneBackdrop";
import { CommandShell } from "@/components/command-shell/CommandShell";
import { MaterialExperience } from "@/components/materials/MaterialExperience";
import { Button } from "@/components/ui/button";
import { hasBundledMaterialSource, openCampaignWithBundledSource } from "@/lib/materials/bundledMaterials";
import {
  getMaterialBundle,
  openMaterialChapter,
  recordMaterialQuizAttempt,
  setActiveMaterial,
  updateMaterialChapterProgress,
} from "@/lib/db/repository";
import type { DomainEventReceipt } from "@/types/domainEvent";
import type { MaterialBundle, MaterialQuizAttempt } from "@/types/materialRecord";
import styles from "./campaign.module.css";

type CampaignState = "loading" | "ready" | "missing" | "error";

export function PhoenixCampaignExperience({ slug }: { slug: string }) {
  const [bundle, setBundle] = useState<MaterialBundle>();
  const [state, setState] = useState<CampaignState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [battlefieldEventReceipts, setBattlefieldEventReceipts] = useState<DomainEventReceipt[]>([]);
  const hasBundledSource = hasBundledMaterialSource(slug);

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

  const refresh = useCallback(async () => {
    const next = await getMaterialBundle(slug);
    if (!next) {
      setBundle(undefined);
      setState("missing");
      return undefined;
    }
    setBundle(next);
    setState("ready");
    return next;
  }, [slug]);

  useEffect(() => {
    let active = true;
    setState("loading");
    setErrorMessage("");
    setBattlefieldEventReceipts([]);

    openCampaignWithBundledSource(slug)
      .then((opened) => {
        if (!active) return;
        if (!opened) {
          setState("missing");
          return;
        }
        setBundle({ definition: opened.definition, progress: opened.progress });
        setState("ready");
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(error instanceof Error ? error.message : "教材戰役無法開啟");
        setState("error");
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const activeChapter = useMemo(() => {
    if (!bundle) return undefined;
    return bundle.definition.chapters.find(
      (chapter) => chapter.key === bundle.progress.activeChapterKey,
    ) ?? bundle.definition.chapters[0];
  }, [bundle]);

  const selectChapter = async (chapterKey: string) => {
    if (!bundle) return;
    const result = await openMaterialChapter(bundle.definition.slug, chapterKey);
    if (result) queueBattlefieldEvents(result.eventReceipts);
    await refresh();
  };

  const changeProgress = async (chapterKey: string, value: number) => {
    if (!bundle) return;
    const result = await updateMaterialChapterProgress(bundle.definition.slug, chapterKey, value);
    if (result) queueBattlefieldEvents(result.eventReceipts);
    await refresh();
  };

  const recordQuizAttempt = async (attempt: MaterialQuizAttempt) => {
    if (!bundle) return;
    const result = await recordMaterialQuizAttempt(bundle.definition.slug, attempt);
    if (result) queueBattlefieldEvents(result.eventReceipts);
    await refresh();
  };

  const makeActive = async () => {
    if (!bundle) return;
    await setActiveMaterial(bundle.definition.slug);
    await refresh();
  };

  const campaignIdentity = {
    breadcrumb: "MATERIAL ARCHIVE / CAMPAIGN",
    eyebrow: "PHOENIX",
    title: "CAMPAIGN",
    subtitle: bundle?.definition.title ?? "沉浸式教材戰役",
  };

  if (state !== "ready" || !bundle || !activeChapter) {
    const missing = state === "missing";
    const failed = state === "error";
    return (
      <CommandShell identity={campaignIdentity} scene={<CommandSceneBackdrop variant="quiet" />}>
        <section className={styles.statePanel} data-testid="campaign-state">
          <div className={styles.stateSeal} aria-hidden="true">
            {failed ? <ShieldAlert size={28} /> : missing ? <Library size={28} /> : <RefreshCw className={styles.spinner} size={28} />}
          </div>
          <p className={styles.kicker}>{failed ? "CAMPAIGN INTERRUPTED" : missing ? "CAMPAIGN NOT FOUND" : "CAMPAIGN INITIALIZING"}</p>
          <h1>{failed ? "教材戰役無法開啟" : missing ? "找不到教材戰役" : "正在建立戰役空間"}</h1>
          <p>
            {failed
              ? errorMessage
              : missing
                ? "這份教材尚未匯入本機教材戰役庫。"
                : hasBundledSource
                  ? "正在從內建教材來源建立戰役，並接回這個瀏覽器的本機進度。"
                  : "正在讀取教材內容與妳原本的學習進度。"}
          </p>
          <Link className={styles.returnLink} href="/materials"><ArrowLeft size={16} />返回教材戰役庫</Link>
        </section>
      </CommandShell>
    );
  }

  if (bundle.definition.kind !== "phoenix-package") {
    return (
      <CommandShell identity={campaignIdentity} scene={<CommandSceneBackdrop variant="quiet" />}>
        <section className={styles.statePanel} data-testid="campaign-state">
          <div className={styles.stateSeal} aria-hidden="true"><Library size={28} /></div>
          <p className={styles.kicker}>LEGACY MATERIAL</p>
          <h1>這份教材仍使用一般檔案閱讀器</h1>
          <p>一般 HTML、PDF 與文字教材會繼續保存在教材戰役庫；Phoenix 教材包才會自動套用完整沉浸式戰役。</p>
          <Link className={styles.returnLink} href="/materials"><ArrowLeft size={16} />返回教材戰役庫</Link>
        </section>
      </CommandShell>
    );
  }

  return (
    <CommandShell identity={campaignIdentity} scene={<CommandSceneBackdrop variant="quiet" />}>
      <div className={styles.campaign} data-testid="campaign-experience">
        <header className={styles.commandBar}>
          <div className={styles.commandMeta}>
            <Link href="/materials"><ArrowLeft size={15} />教材戰役庫</Link>
            <span>{bundle.definition.subject}</span>
            <span>v{bundle.definition.version}</span>
            <span>{bundle.definition.chapters.length} 章</span>
          </div>
          <div className={styles.commandActions}>
            {bundle.progress.isActive ? (
              <span className={styles.activeStatus}><Flag size={13} />目前主線</span>
            ) : (
              <Button className={styles.activeButton} size="sm" variant="outline" onClick={makeActive}>
                <Flag className="mr-2 h-3.5 w-3.5" />設為主線
              </Button>
            )}
            <Link className={styles.centerLink} href="/command-center">返回中控台</Link>
          </div>
        </header>

        <div className={styles.experienceFrame}>
          <MaterialExperience
            definition={bundle.definition}
            progress={bundle.progress}
            chapterKey={activeChapter.key}
            battlefieldEventReceipts={battlefieldEventReceipts}
            onBattlefieldEventReceipts={queueBattlefieldEvents}
            onBattlefieldEventReceiptsConsumed={consumeBattlefieldEvents}
            onChapterSelect={selectChapter}
            onChapterProgressChange={changeProgress}
            onQuizAttempt={recordQuizAttempt}
          />
        </div>
      </div>
    </CommandShell>
  );
}
