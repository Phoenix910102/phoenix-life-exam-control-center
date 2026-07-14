"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JIUJIU_SCORE_PAGES } from "@/lib/guzheng/jiujiu-score";
import { cn } from "@/lib/utils/cn";

const AUTO_CUE_MS = 4200;

export function JiujiuScoreReader() {
  const [pageIndex, setPageIndex] = useState(0);
  const [activeCueId, setActiveCueId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const page = JIUJIU_SCORE_PAGES[pageIndex];

  const allCues = useMemo(
    () =>
      JIUJIU_SCORE_PAGES.flatMap((scorePage, scorePageIndex) =>
        scorePage.lyrics.map((cue) => ({ ...cue, pageIndex: scorePageIndex })),
      ),
    [],
  );
  const activeCueIndex = allCues.findIndex((cue) => cue.id === activeCueId);
  const localCueIndex = page.lyrics.findIndex((cue) => cue.id === activeCueId);
  const activeCue = activeCueIndex >= 0 ? allCues[activeCueIndex] : null;
  const previousCue = activeCueIndex > 0 ? allCues[activeCueIndex - 1] : null;
  const nextCue = activeCueIndex >= 0 ? allCues[activeCueIndex + 1] : allCues.find((cue) => cue.pageIndex >= pageIndex);

  const scoreTop = localCueIndex >= 0 ? 4 + (localCueIndex / page.lyrics.length) * 90 : null;
  const scoreHeight = page.lyrics.length > 0 ? Math.min(13, 90 / page.lyrics.length + 2) : 0;
  const scoreBottom = scoreTop === null ? null : Math.max(0, 100 - scoreTop - scoreHeight);

  const selectCueAt = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(allCues.length - 1, index));
    const cue = allCues[boundedIndex];
    if (!cue) return;
    setPageIndex(cue.pageIndex);
    setActiveCueId(cue.id);
  };

  const moveCue = (offset: number) => {
    const fallbackIndex = allCues.findIndex((cue) => cue.pageIndex >= pageIndex);
    const baseIndex = activeCueIndex >= 0 ? activeCueIndex : Math.max(0, fallbackIndex);
    selectCueAt(baseIndex + offset);
  };

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = window.setTimeout(() => {
      const fallbackIndex = allCues.findIndex((cue) => cue.pageIndex >= pageIndex);
      const currentIndex = activeCueIndex >= 0 ? activeCueIndex : Math.max(-1, fallbackIndex - 1);
      if (currentIndex >= allCues.length - 1) {
        setIsAutoPlay(false);
        return;
      }
      const nextAutoCue = allCues[currentIndex + 1];
      if (nextAutoCue) {
        setPageIndex(nextAutoCue.pageIndex);
        setActiveCueId(nextAutoCue.id);
      }
    }, AUTO_CUE_MS);

    return () => window.clearTimeout(timer);
  }, [activeCueId, activeCueIndex, allCues, isAutoPlay, pageIndex]);

  const setPage = (nextPage: number) => {
    const boundedPage = Math.max(0, Math.min(JIUJIU_SCORE_PAGES.length - 1, nextPage));
    setPageIndex(boundedPage);
    setActiveCueId(JIUJIU_SCORE_PAGES[boundedPage].lyrics[0]?.id ?? null);
    setIsAutoPlay(false);
  };

  const toggleAutoPlay = () => {
    if (!isAutoPlay && activeCueIndex < 0) moveCue(0);
    setIsAutoPlay((value) => !value);
  };

  return (
    <section className="overflow-hidden rounded-lg border border-[#6f5728] bg-[#0b110f] text-[#f4ecd9] shadow-[0_18px_55px_rgba(17,24,21,0.22)]">
      <div className="border-b border-[#604b27] bg-[#111b17] px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[#bba976]">第 {pageIndex + 1} / {JIUJIU_SCORE_PAGES.length} 頁</p>
            <h2 className="mt-1 text-lg font-semibold text-[#fff7e5]">{page.title}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="border-[#6f603d] bg-[#18221e] text-[#eadfbf] hover:bg-[#24322b]"
              size="sm"
              variant="outline"
              onClick={toggleAutoPlay}
            >
              {isAutoPlay ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isAutoPlay ? "暫停高亮" : "自動高亮"}
            </Button>
            <Button
              aria-label="縮小譜面"
              className="border-[#6f603d] bg-[#18221e] text-[#eadfbf] hover:bg-[#24322b]"
              size="sm"
              variant="outline"
              disabled={zoom <= 80}
              onClick={() => setZoom((value) => Math.max(80, value - 20))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="inline-flex h-9 min-w-14 items-center justify-center text-sm tabular-nums text-[#d7c796]">{zoom}%</span>
            <Button
              aria-label="放大譜面"
              className="border-[#6f603d] bg-[#18221e] text-[#eadfbf] hover:bg-[#24322b]"
              size="sm"
              variant="outline"
              disabled={zoom >= 220}
              onClick={() => setZoom((value) => Math.min(220, value + 20))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {JIUJIU_SCORE_PAGES.map((scorePage, index) => (
            <button
              key={scorePage.image}
              type="button"
              aria-current={index === pageIndex ? "page" : undefined}
              className={cn(
                "h-9 shrink-0 rounded-md border px-3 text-sm transition",
                index === pageIndex
                  ? "border-[#e3b951] bg-[#3a2c15] text-[#ffe49c] shadow-[inset_0_0_0_1px_rgba(255,227,146,0.18)]"
                  : "border-[#3f4b45] bg-[#131c18] text-[#aebbb4] hover:border-[#786637] hover:text-[#eadfbf]",
              )}
              onClick={() => setPage(index)}
            >
              {index + 1} · {scorePage.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-[70vh] xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0 border-b border-[#604b27] xl:border-b-0 xl:border-r">
          <div className="max-h-[76vh] overflow-auto bg-[#070a09] p-2 sm:p-4">
            <div
              className="relative mx-auto overflow-hidden border border-[#5d5034] bg-black shadow-[0_0_36px_rgba(197,151,51,0.12)]"
              style={{ width: `${zoom}%`, minWidth: zoom > 100 ? "720px" : undefined }}
            >
              <Image
                alt={`九九八十一古箏專用譜 ${page.title}`}
                className="score-base h-auto w-full"
                height={2139}
                priority={pageIndex === 0}
                src={page.image}
                unoptimized
                width={1500}
              />

              {scoreTop !== null && scoreBottom !== null && (
                <>
                  <div
                    className="pointer-events-none absolute inset-x-0 border-y border-[#e8bf57]/70 bg-[#8f681e]/10 shadow-[0_0_24px_rgba(233,190,80,0.18)]"
                    style={{ top: `${scoreTop}%`, height: `${scoreHeight}%` }}
                  />
                  <div
                    key={`gold-${activeCueId}`}
                    className="score-gold-mask pointer-events-none absolute inset-0"
                    style={
                      {
                        "--score-top": `${scoreTop}%`,
                        "--score-bottom": `${scoreBottom}%`,
                      } as React.CSSProperties
                    }
                  >
                    <Image alt="" className="score-gold object-fill" fill src={page.image} unoptimized />
                  </div>
                  <span
                    key={`sweep-${activeCueId}`}
                    className="score-sweep pointer-events-none absolute w-20 bg-[linear-gradient(90deg,transparent,rgba(255,235,155,0.8),transparent)] blur-sm"
                    style={{ top: `${scoreTop}%`, height: `${scoreHeight}%` }}
                  />
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-[#3e4b45] px-4 py-3">
            <Button
              className="border-[#5d684f] bg-[#17201c] text-[#e8debf] hover:bg-[#243029]"
              variant="outline"
              disabled={pageIndex === 0}
              onClick={() => setPage(pageIndex - 1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              上一頁
            </Button>
            <Button
              className="border-[#5d684f] bg-[#17201c] text-[#e8debf] hover:bg-[#243029]"
              variant="outline"
              disabled={pageIndex === JIUJIU_SCORE_PAGES.length - 1}
              onClick={() => setPage(pageIndex + 1)}
            >
              下一頁
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <aside className="flex min-h-[620px] flex-col bg-[#111915]">
          <div className="border-b border-[#3f4c45] px-5 py-4">
            <p className="inline-flex items-center gap-2 text-xs text-[#d2b868]">
              <Sparkles className="h-4 w-4" />
              KTV 歌詞對照
            </p>
            <p className="mt-2 text-sm leading-6 text-[#9eaaa3]">{page.note}</p>
          </div>

          <div className="flex min-h-52 flex-col justify-center border-b border-[#3f4c45] bg-[#0b100e] px-5 py-7 text-center">
            {page.lyrics.length === 0 ? (
              <>
                <p className="text-xl font-semibold text-[#d6c89d]">純前奏</p>
                <p className="mt-2 text-sm text-[#7f8d86]">此頁沒有歌詞</p>
              </>
            ) : activeCue ? (
              <>
                <p className="line-clamp-2 min-h-6 text-sm text-[#66756e]">{previousCue?.text ?? "前奏結束"}</p>
                <p key={activeCue.id} className="karaoke-gold my-5 text-xl font-semibold leading-9 sm:text-2xl">
                  {activeCue.text}
                </p>
                <p className="line-clamp-2 min-h-6 text-sm text-[#7d8a84]">{nextCue?.text ?? "尾奏"}</p>
              </>
            ) : (
              <p className="text-lg text-[#d6c89d]">點選下方歌詞開始高亮</p>
            )}
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
            {page.lyrics.map((cue, index) => (
              <button
                key={cue.id}
                type="button"
                className={cn(
                  "grid w-full grid-cols-[2rem_1fr] gap-2 rounded-md border px-3 py-2 text-left text-sm leading-6 transition",
                  cue.id === activeCueId
                    ? "border-[#d5aa43] bg-[#3a2c16] text-[#ffe7a4] shadow-[0_0_18px_rgba(218,172,67,0.12)]"
                    : "border-[#34413b] bg-[#151f1a] text-[#b6c0ba] hover:border-[#6c5c35] hover:bg-[#1d2822]",
                )}
                onClick={() => {
                  setActiveCueId(cue.id);
                  setIsAutoPlay(false);
                }}
              >
                <span className="text-xs tabular-nums text-[#817b64]">{index + 1}</span>
                <span>{cue.text}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-[#3f4c45] p-4">
            <Button
              className="border-[#5d684f] bg-[#17201c] text-[#e8debf] hover:bg-[#243029]"
              variant="outline"
              disabled={allCues.length === 0 || activeCueIndex === 0}
              onClick={() => {
                moveCue(-1);
                setIsAutoPlay(false);
              }}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              上一句
            </Button>
            <Button
              className="bg-[#bd8b2d] text-[#171006] hover:bg-[#d4a744]"
              disabled={allCues.length === 0 || activeCueIndex === allCues.length - 1}
              onClick={() => {
                moveCue(1);
                setIsAutoPlay(false);
              }}
            >
              下一句
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .score-base {
          filter: invert(1) grayscale(1) brightness(0.68) contrast(1.18);
        }

        .score-gold {
          filter: invert(1) sepia(1) saturate(7) hue-rotate(354deg) brightness(1.45) contrast(1.28);
          mix-blend-mode: screen;
        }

        .score-gold-mask {
          animation: score-gold-reveal ${AUTO_CUE_MS}ms linear forwards;
        }

        .score-sweep {
          animation: score-sweep ${AUTO_CUE_MS}ms linear forwards;
        }

        .karaoke-gold {
          color: transparent;
          background-image: linear-gradient(90deg, #fff0a8 0%, #d6a43e 42%, #fff5c5 58%, #a87320 100%);
          background-size: 220% 100%;
          background-position: 100% 0;
          background-clip: text;
          -webkit-background-clip: text;
          animation: lyric-gold ${AUTO_CUE_MS}ms linear forwards;
          text-shadow: 0 0 18px rgba(230, 181, 69, 0.2);
        }

        @keyframes score-gold-reveal {
          from {
            clip-path: inset(var(--score-top) 100% var(--score-bottom) 0);
          }
          to {
            clip-path: inset(var(--score-top) 0 var(--score-bottom) 0);
          }
        }

        @keyframes score-sweep {
          from {
            left: -5rem;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          to {
            left: calc(100% - 2rem);
            opacity: 0;
          }
        }

        @keyframes lyric-gold {
          from {
            background-position: 100% 0;
          }
          to {
            background-position: 0 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .score-gold-mask,
          .score-sweep,
          .karaoke-gold {
            animation-duration: 1ms;
          }
        }
      `}</style>
    </section>
  );
}
