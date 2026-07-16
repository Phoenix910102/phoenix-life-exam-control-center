"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  GitCompareArrows,
  GraduationCap,
  ListChecks,
  LibraryBig,
  Home,
  FileQuestion,
  Files,
  Layers3,
  Map,
  ScanSearch,
} from "lucide-react";
import { ChromaKeyCharacters } from "@/components/command-center/ChromaKeyCharacters";
import { CampaignGlossary, CampaignHome, CampaignQuestionBanks, QuickReviewDeck, SourceLibrary } from "@/components/campaign/CampaignCurriculum";
import { ReadingModeToggle } from "@/components/campaign/theme/ReadingModeToggle";
import { useCampaignTheme } from "@/components/campaign/theme/CampaignThemeProvider";
import {
  resolveCampaignModuleSurface,
  type CampaignSurfaceModule,
} from "@/components/campaign/theme/campaign-theme.types";
import {
  PhoenixMaterialBlock,
  PhoenixMaterialRenderer,
} from "@/components/materials/PhoenixMaterialRenderer";
import type { MaterialBlock } from "@/types/materialPackage";
import type { MaterialDefinition, MaterialProgress, MaterialQuizAttempt } from "@/types/materialRecord";
import type { DomainEventReceipt } from "@/types/domainEvent";
import { Battlefield3D } from "./3d/Battlefield3D";
import { FloatingAcademyConsole } from "./FloatingAcademyConsole";
import styles from "./ImmersiveAcademy.module.css";

type Mode = "home" | "battlefield" | "reader" | "lesson" | "duel" | "diagnostic" | "trap-field" | "quiz" | "glossary" | "question-bank" | "source-library" | "quick-review";

type Props = {
  definition: MaterialDefinition;
  progress: MaterialProgress;
  chapterKey: string;
  onChapterSelect: (chapterKey: string) => void | Promise<void>;
  onChapterProgressChange: (chapterKey: string, value: number) => void | Promise<void>;
  onQuizAttempt?: (attempt: MaterialQuizAttempt) => void | Promise<void>;
  battlefieldEventReceipts?: DomainEventReceipt[];
  onBattlefieldEventReceiptsConsumed?: (eventIds: string[]) => void;
  onBattlefieldEventReceipts?: (receipts: DomainEventReceipt[]) => void;
};

const modeDefinitions: Array<{ id: Mode; label: string; icon: typeof BookOpen }> = [
  { id: "home", label: "總覽", icon: Home },
  { id: "battlefield", label: "戰場", icon: Map },
  { id: "reader", label: "閱讀", icon: BookOpen },
  { id: "lesson", label: "上課", icon: GraduationCap },
  { id: "duel", label: "決鬥", icon: GitCompareArrows },
  { id: "diagnostic", label: "診斷", icon: ScanSearch },
  { id: "trap-field", label: "陷阱", icon: AlertTriangle },
  { id: "quiz", label: "測驗", icon: ListChecks },
  { id: "glossary", label: "名詞庫", icon: LibraryBig },
  { id: "question-bank", label: "題庫", icon: FileQuestion },
  { id: "source-library", label: "來源", icon: Files },
  { id: "quick-review", label: "快複習", icon: Layers3 },
];

const modeCopy: Record<Mode, { title: string; description: string }> = {
  home: { title: "戰役課程總覽", description: "從實際 collections 計算章節、詞庫、題庫與今日任務。" },
  battlefield: { title: "戰場總覽", description: "把章節進度、錯題壓力與測驗表現投影成可操作的學習局勢。" },
  reader: { title: "完整閱讀", description: "沿作者安排的節奏閱讀定位、概念、例題與記憶錨點。" },
  lesson: { title: "單點上課", description: "一次只處理一個內容區塊，避免同時展開過多概念。" },
  duel: { title: "概念決鬥", description: "集中處理比較表與容易混淆的角色差異。" },
  diagnostic: { title: "卡點診斷", description: "先命名卡住的層級，再決定要補位置、定義、比較或題幹訊號。" },
  "trap-field": { title: "陷阱雷區", description: "只看題幹訊號、錯誤選項與高風險提醒。" },
  quiz: { title: "章節測驗", description: "完成題目後立即顯示解析，作答紀錄寫入教材進度。" },
  glossary: { title: "完整名詞庫", description: "搜尋、篩選並沿章節、關聯詞與題目往返。" },
  "question-bank": { title: "題庫戰情室", description: "Boss Quiz、Final Exam 與圖片題共用穩定 question key。" },
  "source-library": { title: "來源庫", description: "查看教材引用的官方、研究與技術來源。" },
  "quick-review": { title: "考前快速複習", description: "只展開 A 級核心詞與高頻判題信號。" },
};

const blockerOptions = [
  ["position", "名詞沒有位置感", "先回到 position 區塊，把它放回完整流程，再談定義。"],
  ["definition", "定義太抽象", "改用一個具體例子，要求自己說出它負責做什麼。"],
  ["comparison", "兩個概念混在一起", "進入決鬥模式，只比角色、題幹訊號與排除規則。"],
  ["signal", "看不出題幹在問什麼", "先圈出動詞、限制詞與否定詞，再套用 exam-signal。"],
  ["overload", "內容太多，工作記憶過載", "切到上課模式，一次只處理一個 block，完成後再前進。"],
] as const;

function filterBlocks(blocks: MaterialBlock[], mode: Mode) {
  if (mode === "duel") return blocks.filter((block) => block.type === "comparison" || block.type === "confusion");
  if (mode === "trap-field") {
    return blocks.filter((block) => block.type === "exam-signal" || (block.type === "callout" && block.tone !== "info"));
  }
  if (mode === "quiz") return blocks.filter((block) => block.type === "quiz");
  return blocks;
}

export function ImmersiveAcademy({
  definition,
  progress,
  chapterKey,
  onChapterSelect,
  onChapterProgressChange,
  onQuizAttempt,
  battlefieldEventReceipts,
  onBattlefieldEventReceiptsConsumed,
  onBattlefieldEventReceipts,
}: Props) {
  const { mode: readingMode, setMode: setReadingMode } = useCampaignTheme();
  const modules = Array.from(new Set([
    "battlefield",
    "achievements",
    "floating-console",
    ...(definition.presentation?.modules ?? modeDefinitions.map((mode) => mode.id)),
  ]));
  const availableModes = modeDefinitions.filter((mode) => modules.includes(mode.id));
  const [mode, setMode] = useState<Mode>(definition.collections ? "home" : "reader");
  const [questionBankKind, setQuestionBankKind] = useState<"boss" | "final">("boss");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [blocker, setBlocker] = useState<(typeof blockerOptions)[number][0]>("position");
  const chapter = definition.chapters.find((item) => item.key === chapterKey) ?? definition.chapters[0];
  const chapterIndex = definition.chapters.findIndex((item) => item.key === chapter.key);
  const selectedBlocker = blockerOptions.find((item) => item[0] === blocker) ?? blockerOptions[0];
  const filtered = useMemo(() => filterBlocks(chapter.blocks, mode), [chapter.blocks, mode]);
  const currentLesson = chapter.blocks[Math.min(lessonIndex, chapter.blocks.length - 1)];
  const chapterProgress = progress.chapterProgress[chapter.key] ?? 0;
  const moduleSurface = resolveCampaignModuleSurface(
    mode as CampaignSurfaceModule,
    readingMode,
    definition.presentation?.moduleSurfaces,
  );

  useEffect(() => {
    if (readingMode !== "immersive" && !["home", "reader", "glossary", "question-bank", "source-library", "quick-review"].includes(mode)) {
      setMode("reader");
      setLessonIndex(0);
    }
  }, [mode, readingMode]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setLessonIndex(0);
  };

  return (
    <section
      className={styles.shell}
      data-display-mode={readingMode}
      data-theme={definition.presentation?.shellTheme ?? definition.presentation?.theme ?? "criminal-rose"}
    >
      <header className={styles.masthead}>
        <div>
          <p className={styles.eyebrow}>Phoenix Immersive Academy / {definition.subject}</p>
          <h2 className={styles.title}>{definition.title}</h2>
          <p className={styles.description}>{definition.description}</p>
        </div>
        <div className={styles.mastheadControls}>
          <ReadingModeToggle />
          <div className={styles.seal}>
            <strong>{progress.overallProgress}%</strong>
            <span>主線控制率 · v{definition.version}</span>
          </div>
        </div>
      </header>

      {modules.includes("roadmap") && (
        <nav className={styles.roadmap} aria-label="教材章節路線圖">
          {definition.chapters.map((item, index) => {
            const value = progress.chapterProgress[item.key] ?? 0;
            return (
              <button
                className={`${styles.roadNode} ${item.key === chapter.key ? styles.roadNodeActive : ""} ${value >= 100 ? styles.roadNodeComplete : ""}`}
                key={item.key}
                onClick={() => onChapterSelect(item.key)}
                type="button"
              >
                <span className={styles.chapterNo}>{String(index + 1).padStart(2, "0")} / {value}%</span>
                <strong>{item.title}</strong>
                <span className={styles.roadProgress}><i style={{ width: `${value}%` }} /></span>
              </button>
            );
          })}
        </nav>
      )}

      <div className={`${styles.workbench} ${readingMode !== "immersive" && !definition.collections ? styles.workbenchReading : ""} ${mode === "battlefield" ? styles.workbenchBattlefield : ""}`}>
        {(readingMode === "immersive" || definition.collections) && (
          <nav className={styles.rail} aria-label="教材模式">
            {availableModes.map(({ id, label, icon: Icon }) => (
              <button
                aria-current={mode === id ? "page" : undefined}
                className={`${styles.modeButton} ${mode === id ? styles.modeButtonActive : ""}`}
                key={id}
                onClick={() => switchMode(id)}
                title={`${label}模式`}
                type="button"
              >
                <Icon aria-hidden="true" size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        )}

        <div
          className={`${styles.content} campaign-module-surface`}
          data-module-surface={moduleSurface}
          data-module={mode}
        >
          <div className={`${styles.modeHeader} campaign-reading-intro`}>
            <div>
              <p className={styles.modeHint}>{modeCopy[mode].title}</p>
              <h3>{chapter.title}</h3>
              <p>{modeCopy[mode].description}</p>
            </div>
            {mode === "lesson" && (
              <div className={styles.lessonNav}>
                <button disabled={lessonIndex === 0} onClick={() => setLessonIndex((value) => Math.max(0, value - 1))} title="上一個內容區塊" type="button">
                  <ChevronLeft size={18} />
                </button>
                <button disabled={lessonIndex >= chapter.blocks.length - 1} onClick={() => setLessonIndex((value) => Math.min(chapter.blocks.length - 1, value + 1))} title="下一個內容區塊" type="button">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            {readingMode !== "immersive" && (
              <button
                className={styles.immersiveAction}
                onClick={() => {
                  setReadingMode("immersive");
                  switchMode("lesson");
                }}
                type="button"
              >
                <GraduationCap size={16} />進入上課／沉浸模式
              </button>
            )}
          </div>

          <div className={`${styles.modeContent} campaign-module-body ${mode === "reader" ? "campaign-reading-stage" : ""}`}>
            {mode === "home" && <CampaignHome definition={definition} progress={progress} chapterKey={chapter.key} onChapterSelect={onChapterSelect} onQuizAttempt={onQuizAttempt} onMode={(next, bankKind) => { if (bankKind) setQuestionBankKind(bankKind); switchMode(next as Mode); }} />}
            {mode === "battlefield" && (
              <Battlefield3D
                definition={definition}
                eventReceipts={battlefieldEventReceipts}
                onEventReceiptsConsumed={onBattlefieldEventReceiptsConsumed}
                progress={progress}
                onChapterSelect={onChapterSelect}
              />
            )}
            {mode === "reader" && (
              <PhoenixMaterialRenderer definition={definition} chapterKey={chapter.key} onQuizAttempt={onQuizAttempt} />
            )}
            {mode === "lesson" && currentLesson && (
              <PhoenixMaterialBlock
                block={currentLesson}
                blockIndex={lessonIndex}
                chapterKey={chapter.key}
                definition={definition}
                onChapterSelect={onChapterSelect}
                onQuizAttempt={onQuizAttempt}
              />
            )}
            {(mode === "duel" || mode === "trap-field" || mode === "quiz") && (
              filtered.length > 0
                ? filtered.map((block) => {
                    const index = chapter.blocks.indexOf(block);
                    return (
                      <PhoenixMaterialBlock
                        block={block}
                        blockIndex={index}
                        chapterKey={chapter.key}
                        definition={definition}
                        onChapterSelect={onChapterSelect}
                        key={block.key ?? `${block.type}-${index}`}
                        onQuizAttempt={onQuizAttempt}
                      />
                    );
                  })
                : <p className={styles.empty}>本章尚未配置這個模式需要的內容 block。</p>
            )}
            {mode === "diagnostic" && (
              <div className={styles.diagnostic}>
                <div className={styles.diagnosticChoices}>
                  {blockerOptions.map(([id, label]) => (
                    <button className={blocker === id ? styles.diagnosticActive : ""} key={id} onClick={() => setBlocker(id)} type="button">
                      {label}
                    </button>
                  ))}
                </div>
                <div className={styles.diagnosticResult}>
                  <Crosshair size={22} />
                  <p className={styles.intelLabel}>診斷結果</p>
                  <h4>{selectedBlocker[1]}</h4>
                  <p>{selectedBlocker[2]}</p>
                </div>
              </div>
            )}
            {mode === "glossary" && <CampaignGlossary definition={definition} progress={progress} chapterKey={chapter.key} onChapterSelect={onChapterSelect} onQuizAttempt={onQuizAttempt} />}
            {mode === "question-bank" && <CampaignQuestionBanks key={questionBankKind} definition={definition} progress={progress} chapterKey={chapter.key} initialKind={questionBankKind} onChapterSelect={onChapterSelect} onQuizAttempt={onQuizAttempt} />}
            {mode === "source-library" && <SourceLibrary definition={definition} />}
            {mode === "quick-review" && <QuickReviewDeck definition={definition} />}
          </div>
        </div>

        <aside className={`${styles.intel} ${mode === "battlefield" ? styles.intelBattlefield : ""}`}>
          <div className={styles.characterPresence} aria-hidden="true">
            <ChromaKeyCharacters variant="campaign" />
          </div>
          <section className={styles.intelSection}>
            <p className={styles.intelLabel}>當前章節</p>
            <strong>{String(chapterIndex + 1).padStart(2, "0")} · {chapterProgress}%</strong>
            <p>{chapter.summary}</p>
            <input
              aria-label={`${chapter.title}進度`}
              className={styles.progressInput}
              max="100"
              min="0"
              onChange={(event) => onChapterProgressChange(chapter.key, Number(event.target.value))}
              step="10"
              type="range"
              value={chapterProgress}
            />
          </section>
          <section className={styles.intelSection}>
            <p className={styles.intelLabel}>本章目標</p>
            <ul>{chapter.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
          </section>
          <section className={styles.intelSection}>
            <p className={styles.intelLabel}>閱讀節奏</p>
            <p>約 {chapter.estimatedMinutes} 分鐘 · {chapter.blocks.length} 個內容節點</p>
          </section>
        </aside>
      </div>
      {readingMode === "immersive" && modules.includes("floating-console") && (
        <FloatingAcademyConsole
          chapterTitle={chapter.title}
          onEventReceipts={onBattlefieldEventReceipts}
          overallProgress={progress.overallProgress}
        />
      )}
    </section>
  );
}
