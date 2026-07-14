"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpenText,
  FileText,
  Mic,
  MicOff,
  Music2,
  RotateCcw,
  Shuffle,
  SkipForward,
  Upload,
  Waves,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_GUZHENG_NOTE,
  GUZHENG_NOTES,
  type GuzhengNote,
  type ParsedJianpuNote,
  findClosestGuzhengNote,
  formatJianpu,
  makeRandomPhrase,
  parseJianpuScore,
  pickRandomGuzhengNote,
} from "@/lib/guzheng/jianpu";
import {
  ANALYZE_INTERVAL_MS,
  ATTEMPT_RELEASE_MS,
  HIT_COOLDOWN_MS,
  MIN_RMS,
  SUSTAIN_MS,
  TOLERANCE_CENTS,
  estimatePitch,
} from "@/lib/guzheng/pitch-detection";
import { cn } from "@/lib/utils/cn";

type PracticeMode = "single" | "phrase" | "import";
type PitchStatus = "idle" | "quiet" | "listening" | "correct" | "low" | "high";

type DetectionState = {
  status: PitchStatus;
  frequency: number | null;
  rms: number;
  closest: GuzhengNote | null;
  centsToTarget: number | null;
};

const DEFAULT_IMPORT_TEXT = "1 2 3 5 | 6 5 3 2\n+1 6 5 3 | 2 1";

const initialPhrase = ["1-4", "2-4", "3-4", "5-4", "6-4", "5-4"]
  .map((id) => GUZHENG_NOTES.find((note) => note.id === id))
  .filter((note): note is GuzhengNote => Boolean(note));

function statusText(detection: DetectionState, isListening: boolean, hasTarget: boolean) {
  if (!hasTarget) return "段落完成";
  if (!isListening) return "等待收音";
  if (detection.status === "quiet") return "音量偏小";
  if (detection.status === "correct") return "彈對";
  if (detection.status === "low") return "偏低";
  if (detection.status === "high") return "偏高";
  return "聽音中";
}

function JianpuGlyph({ note, className }: { note: GuzhengNote; className?: string }) {
  const octaveShift = note.octave - 4;

  return (
    <span className={cn("inline-grid min-w-10 place-items-center leading-none", className)} aria-label={formatJianpu(note)}>
      <span className="h-4 text-xs font-semibold text-amber-600">{octaveShift > 0 ? "•".repeat(octaveShift) : ""}</span>
      <span className="font-serif text-[1em] font-bold tabular-nums">{note.degree}</span>
      <span className="h-4 text-xs font-semibold text-amber-600">{octaveShift < 0 ? "•".repeat(Math.abs(octaveShift)) : ""}</span>
    </span>
  );
}

function NoteTile({
  item,
  active,
  done,
}: {
  item: Pick<ParsedJianpuNote, "id" | "note" | "display">;
  active: boolean;
  done: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-14 min-w-11 items-center justify-center rounded-md border px-2 text-2xl transition",
        active && "border-amber-500 bg-amber-100 text-amber-950 shadow-sm",
        done && !active && "border-emerald-300 bg-emerald-50 text-emerald-800",
        !active && !done && "border-border bg-white/85 text-foreground",
      )}
      title={`${item.display} · ${item.note.pitchName}`}
    >
      <JianpuGlyph note={item.note} />
    </span>
  );
}

function SequenceStrip({
  items,
  activeIndex,
}: {
  items: ParsedJianpuNote[];
  activeIndex: number;
}) {
  const activeSegment = items[activeIndex]?.segmentIndex ?? -1;
  const segments = Array.from({ length: Math.max(0, ...items.map((item) => item.segmentIndex)) + 1 }, (_, index) =>
    items.filter((item) => item.segmentIndex === index),
  ).filter((segment) => segment.length > 0);

  if (items.length === 0) {
    return <div className="rounded-lg border border-dashed border-border bg-white/70 p-4 text-sm text-muted-foreground">尚未載入音符</div>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {segments.map((segment) => (
        <div
          key={segment[0].segmentIndex}
          className={cn(
            "flex flex-wrap gap-2 rounded-lg border p-2 transition",
            segment[0].segmentIndex === activeSegment ? "border-amber-400 bg-amber-50" : "border-border bg-white/75",
          )}
        >
          {segment.map((item) => (
            <NoteTile key={item.id} item={item} active={item.noteIndex === activeIndex} done={item.noteIndex < activeIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}

function StringBoard({ target, detected }: { target: GuzhengNote | null; detected: GuzhengNote | null }) {
  const minMidi = GUZHENG_NOTES[0].midi;
  const maxMidi = GUZHENG_NOTES[GUZHENG_NOTES.length - 1].midi;
  const targetTop = target ? 85 - ((target.midi - minMidi) / (maxMidi - minMidi)) * 70 : 50;
  const detectedTop = detected ? 85 - ((detected.midi - minMidi) / (maxMidi - minMidi)) * 70 : null;

  return (
    <div className="relative h-64 overflow-hidden rounded-lg border border-emerald-900/15 bg-[linear-gradient(100deg,#f7d8a9_0%,#bf7f3f_42%,#7a3f24_100%)]">
      <div className="absolute inset-x-4 inset-y-7 rounded-full bg-white/10 blur-sm" />
      {Array.from({ length: 9 }, (_, index) => (
        <span
          key={index}
          className="absolute left-5 right-5 h-px bg-amber-50/80 shadow-[0_1px_2px_rgba(44,25,12,0.45)]"
          style={{ top: `${13 + index * 9}%` }}
        />
      ))}
      <span className="absolute bottom-0 left-16 top-0 w-4 skew-x-[-8deg] bg-zinc-900/35" />
      <span className="absolute bottom-0 right-20 top-0 w-3 skew-x-[10deg] bg-amber-100/45" />
      {detectedTop !== null && (
        <span
          className="absolute right-6 h-3 w-3 -translate-y-1/2 rounded-full border border-white bg-sky-500 shadow-sm"
          style={{ top: `${detectedTop}%` }}
          title={detected?.pitchName}
        />
      )}
      {target && (
        <span
          className="absolute left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200 bg-white/92 text-4xl text-amber-950 shadow-lg"
          style={{ top: `${targetTop}%` }}
        >
          <JianpuGlyph note={target} />
        </span>
      )}
    </div>
  );
}

function makePhraseItems(notes: GuzhengNote[]) {
  return notes.map((note, index) => ({
    id: `phrase-${index}-${note.id}`,
    raw: formatJianpu(note),
    display: formatJianpu(note),
    note,
    segmentIndex: Math.floor(index / 4),
    noteIndex: index,
  }));
}

export default function GuzhengPage() {
  const [mode, setMode] = useState<PracticeMode>("single");
  const [singleTarget, setSingleTarget] = useState<GuzhengNote>(DEFAULT_GUZHENG_NOTE);
  const [phraseLength, setPhraseLength] = useState(6);
  const [phraseNotes, setPhraseNotes] = useState<GuzhengNote[]>(initialPhrase);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [importText, setImportText] = useState(DEFAULT_IMPORT_TEXT);
  const [importedNotes, setImportedNotes] = useState<ParsedJianpuNote[]>(() => parseJianpuScore(DEFAULT_IMPORT_TEXT).notes);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [importIndex, setImportIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState("");
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timedHits, setTimedHits] = useState(0);
  const [totalResponseMs, setTotalResponseMs] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastHit, setLastHit] = useState("");
  const [detection, setDetection] = useState<DetectionState>({
    status: "idle",
    frequency: null,
    rms: 0,
    closest: null,
    centsToTarget: null,
  });

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastAnalyzeRef = useRef(0);
  const correctSinceRef = useRef<number | null>(null);
  const lastHitAtRef = useRef(0);
  const targetStartedAtRef = useRef(0);
  const attemptCandidateRef = useRef<{ noteId: string; since: number; counted: boolean } | null>(null);
  const quietSinceRef = useRef<number | null>(null);
  const targetRef = useRef<GuzhengNote | null>(singleTarget);
  const modeRef = useRef<PracticeMode>(mode);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const phraseItems = useMemo(() => makePhraseItems(phraseNotes), [phraseNotes]);
  const sequenceItems = mode === "phrase" ? phraseItems : mode === "import" ? importedNotes : [];
  const activeIndex = mode === "phrase" ? phraseIndex : mode === "import" ? importIndex : 0;
  const currentTarget =
    mode === "single"
      ? singleTarget
      : mode === "phrase"
        ? phraseNotes[phraseIndex] ?? null
        : importedNotes[importIndex]?.note ?? null;

  useEffect(() => {
    setSingleTarget(pickRandomGuzhengNote());
    setPhraseNotes(makeRandomPhrase(6));
  }, []);

  useEffect(() => {
    targetRef.current = currentTarget;
    correctSinceRef.current = null;
    targetStartedAtRef.current = performance.now();
    attemptCandidateRef.current = null;
    quietSinceRef.current = null;
  }, [currentTarget]);

  useEffect(() => {
    modeRef.current = mode;
    correctSinceRef.current = null;
  }, [mode]);

  const advanceTarget = useCallback((countHit: boolean) => {
    const target = targetRef.current;
    if (countHit && target) {
      const responseMs = targetStartedAtRef.current > 0 ? performance.now() - targetStartedAtRef.current : 0;
      setHits((value) => value + 1);
      if (responseMs > 0) {
        setTimedHits((value) => value + 1);
        setTotalResponseMs((value) => value + responseMs);
      }
      setStreak((value) => value + 1);
      setLastHit(`${formatJianpu(target)} · ${target.pitchName}`);
    }

    if (modeRef.current === "single") {
      setSingleTarget((previous) => pickRandomGuzhengNote(previous.id));
      return;
    }

    if (modeRef.current === "phrase") {
      setPhraseIndex((index) => Math.min(index + 1, phraseNotes.length));
      return;
    }

    setImportIndex((index) => Math.min(index + 1, importedNotes.length));
  }, [importedNotes.length, phraseNotes.length]);

  const analyze = useCallback(() => {
    const analyser = analyserRef.current;
    const audioContext = audioContextRef.current;

    if (!analyser || !audioContext) return;

    const now = performance.now();
    if (now - lastAnalyzeRef.current >= ANALYZE_INTERVAL_MS) {
      lastAnalyzeRef.current = now;
      if (!bufferRef.current || bufferRef.current.length !== analyser.fftSize) {
        bufferRef.current = new Float32Array(analyser.fftSize);
      }

      const timeDomainData = bufferRef.current;
      analyser.getFloatTimeDomainData(timeDomainData);
      const pitch = estimatePitch(timeDomainData, audioContext.sampleRate);
      const target = targetRef.current;

      if (!pitch.frequency) {
        correctSinceRef.current = null;
        quietSinceRef.current ??= now;
        if (now - quietSinceRef.current >= ATTEMPT_RELEASE_MS) {
          attemptCandidateRef.current = null;
        }
        setDetection({
          status: pitch.rms < MIN_RMS ? "quiet" : "listening",
          frequency: null,
          rms: pitch.rms,
          closest: null,
          centsToTarget: null,
        });
      } else if (target) {
        const closest = findClosestGuzhengNote(pitch.frequency);
        const centsToTarget = Math.round(1200 * Math.log2(pitch.frequency / target.frequency));
        const isCorrect = Math.abs(centsToTarget) <= TOLERANCE_CENTS;
        const candidate = attemptCandidateRef.current;

        quietSinceRef.current = null;
        if (!candidate || candidate.noteId !== closest.note.id) {
          attemptCandidateRef.current = { noteId: closest.note.id, since: now, counted: false };
        } else if (!candidate.counted && now - candidate.since >= SUSTAIN_MS) {
          candidate.counted = true;
          setAttempts((value) => value + 1);
          if (!isCorrect) setStreak(0);
        }

        setDetection({
          status: isCorrect ? "correct" : centsToTarget < 0 ? "low" : "high",
          frequency: pitch.frequency,
          rms: pitch.rms,
          closest: closest.note,
          centsToTarget,
        });

        if (isCorrect) {
          correctSinceRef.current ??= now;
          if (now - correctSinceRef.current >= SUSTAIN_MS && now - lastHitAtRef.current >= HIT_COOLDOWN_MS) {
            lastHitAtRef.current = now;
            correctSinceRef.current = null;
            advanceTarget(true);
          }
        } else {
          correctSinceRef.current = null;
        }
      } else {
        setDetection({
          status: "idle",
          frequency: pitch.frequency,
          rms: pitch.rms,
          closest: findClosestGuzhengNote(pitch.frequency).note,
          centsToTarget: null,
        });
      }
    }

    frameRef.current = requestAnimationFrame(analyze);
  }, [advanceTarget]);

  const stopListening = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    bufferRef.current = null;
    correctSinceRef.current = null;
    attemptCandidateRef.current = null;
    quietSinceRef.current = null;
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    setMicError("");

    if (!window.isSecureContext) {
      setMicError("手機麥克風需要 HTTPS。請改用安全網址，並在 Safari 開啟，不要使用 ChatGPT 內建瀏覽器。");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError("這個瀏覽器無法使用麥克風。請改用 Safari 或 Chrome 開啟安全網址。");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const AudioContextConstructor =
        window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextConstructor) {
        stream.getTracks().forEach((track) => track.stop());
        setMicError("這個瀏覽器沒有提供音訊分析。");
        return;
      }

      const audioContext = new AudioContextConstructor();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.08;
      audioContext.createMediaStreamSource(stream).connect(analyser);

      streamRef.current = stream;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      targetStartedAtRef.current = performance.now();
      attemptCandidateRef.current = null;
      quietSinceRef.current = null;
      setIsListening(true);
      frameRef.current = requestAnimationFrame(analyze);
    } catch (error) {
      if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError")) {
        setMicError("麥克風權限被拒絕。請到瀏覽器網站設定允許麥克風後再試一次。");
      } else {
        setMicError(error instanceof Error ? error.message : "無法啟動麥克風，請重新整理後再試一次。");
      }
    }
  }, [analyze]);

  useEffect(() => stopListening, [stopListening]);

  const regeneratePhrase = () => {
    setMode("phrase");
    setPhraseNotes(makeRandomPhrase(phraseLength));
    setPhraseIndex(0);
    setStreak(0);
  };

  const loadImportedScore = (text = importText) => {
    const parsed = parseJianpuScore(text);
    setImportedNotes(parsed.notes);
    setImportWarnings(parsed.warnings);
    setImportIndex(0);
    setMode("import");
    setStreak(0);
  };

  const resetCurrentMode = () => {
    correctSinceRef.current = null;
    attemptCandidateRef.current = null;
    quietSinceRef.current = null;
    targetStartedAtRef.current = performance.now();
    setHits(0);
    setAttempts(0);
    setTimedHits(0);
    setTotalResponseMs(0);
    setStreak(0);
    if (mode === "single") {
      setSingleTarget(pickRandomGuzhengNote(singleTarget.id));
    } else if (mode === "phrase") {
      setPhraseIndex(0);
    } else {
      setImportIndex(0);
    }
  };

  const onFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setImportText(text);
    loadImportedScore(text);
    event.target.value = "";
  };

  const displayTarget = currentTarget ?? DEFAULT_GUZHENG_NOTE;
  const completed = mode !== "single" && sequenceItems.length > 0 && activeIndex >= sequenceItems.length;
  const progressText =
    mode === "single"
      ? "隨機單音"
      : `${Math.min(activeIndex, sequenceItems.length)} / ${sequenceItems.length}`;
  const modeLabel = mode === "single" ? "單音" : mode === "phrase" ? "短句" : "匯入";
  const strength = Math.min(100, Math.round((detection.rms / 0.04) * 100));
  const accuracy = attempts > 0 ? Math.round((hits / attempts) * 100) : null;
  const averageResponseSeconds = timedHits > 0 ? totalResponseMs / timedHits / 1000 : null;

  const skipTarget = () => {
    setAttempts((value) => value + 1);
    setStreak(0);
    advanceTarget(false);
  };

  return (
    <main className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-emerald-900/15 bg-white/95 p-0">
          <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
            <div className="space-y-5 p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">古箏 D 調</p>
                  <h2 className="text-2xl font-semibold">簡譜聽音練習</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link className={cn(buttonVariants({ variant: "outline", size: "sm" }))} href="/guzheng/jiujiu">
                    <BookOpenText className="mr-2 h-4 w-4" />
                    九九八十一專用譜
                  </Link>
                  <span className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm">
                    <Music2 className="h-4 w-4" />
                    {modeLabel}
                  </span>
                </div>
              </div>

              <StringBoard target={currentTarget} detected={detection.closest} />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div className="rounded-lg border border-border bg-white p-3">
                  <p className="text-xs text-muted-foreground">進度</p>
                  <p className="mt-1 text-lg font-semibold">{completed ? "完成" : progressText}</p>
                </div>
                <div className="rounded-lg border border-border bg-white p-3">
                  <p className="text-xs text-muted-foreground">答對 / 嘗試</p>
                  <p className="mt-1 text-lg font-semibold">{hits} / {attempts}</p>
                </div>
                <div className="rounded-lg border border-border bg-white p-3">
                  <p className="text-xs text-muted-foreground">連續</p>
                  <p className="mt-1 text-lg font-semibold">{streak}</p>
                </div>
                <div className="rounded-lg border border-border bg-white p-3">
                  <p className="text-xs text-muted-foreground">準確率</p>
                  <p className="mt-1 text-lg font-semibold">{accuracy === null ? "--" : `${accuracy}%`}</p>
                </div>
                <div className="rounded-lg border border-border bg-white p-3">
                  <p className="text-xs text-muted-foreground">平均速度</p>
                  <p className="mt-1 text-lg font-semibold">
                    {averageResponseSeconds === null ? "--" : `${averageResponseSeconds.toFixed(1)} 秒`}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-[#f8f4eb] p-4 lg:border-l lg:border-t-0">
              <div className="flex min-h-full flex-col justify-between gap-5">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">目前目標</p>
                  {completed ? (
                    <div className="mt-6 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-8 text-2xl font-semibold text-emerald-900">
                      已完成
                    </div>
                  ) : (
                    <div className="mt-3 text-[7rem] text-amber-950">
                      <JianpuGlyph note={displayTarget} />
                    </div>
                  )}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <span className="rounded-md bg-white/80 px-2 py-1.5">{displayTarget.registerLabel}</span>
                    <span className="rounded-md bg-white/80 px-2 py-1.5">{displayTarget.pitchName}</span>
                    <span className="rounded-md bg-white/80 px-2 py-1.5">{displayTarget.frequency} Hz</span>
                    <span className="rounded-md bg-white/80 px-2 py-1.5">±{TOLERANCE_CENTS} cents</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className={cn(
                      "rounded-lg border p-3",
                      detection.status === "correct" && "border-emerald-400 bg-emerald-50",
                      (detection.status === "high" || detection.status === "low") && "border-amber-400 bg-amber-50",
                      detection.status !== "correct" &&
                        detection.status !== "high" &&
                        detection.status !== "low" &&
                        "border-border bg-white/80",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold">
                        <Waves className="h-4 w-4" />
                        {statusText(detection, isListening, Boolean(currentTarget))}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {detection.frequency ? `${Math.round(detection.frequency)} Hz` : "--"}
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
                      <span className="block h-full rounded-full bg-sky-500" style={{ width: `${strength}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {detection.closest ? `${formatJianpu(detection.closest)} · ${detection.closest.pitchName}` : "尚未偵測到穩定音高"}
                      {detection.centsToTarget !== null ? ` · ${detection.centsToTarget > 0 ? "+" : ""}${detection.centsToTarget} cents` : ""}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={isListening ? stopListening : startListening}>
                      {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                      {isListening ? "停止收音" : "開始收音"}
                    </Button>
                    <Button variant="outline" onClick={skipTarget}>
                      <SkipForward className="mr-2 h-4 w-4" />
                      下一音
                    </Button>
                  </div>
                  {micError && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{micError}</p>}
                  {lastHit && <p className="text-xs text-muted-foreground">最近答對：{lastHit}</p>}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["single", "單音"],
                  ["phrase", "短句"],
                  ["import", "匯入"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={mode === value}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm font-medium transition",
                    mode === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:bg-muted",
                  )}
                  onClick={() => setMode(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={resetCurrentMode}>
                <RotateCcw className="mr-2 h-4 w-4" />
                重置
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setMode("single");
                  setSingleTarget((previous) => pickRandomGuzhengNote(previous.id));
                }}
              >
                <Shuffle className="mr-2 h-4 w-4" />
                隨機
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">短句簡譜</h3>
                <p className="text-sm text-muted-foreground">長度 {phraseLength}</p>
              </div>
              <Button size="sm" onClick={regeneratePhrase}>
                <Shuffle className="mr-2 h-4 w-4" />
                產生
              </Button>
            </div>
            <input
              aria-label="短句長度"
              className="w-full accent-emerald-700"
              max={10}
              min={3}
              onChange={(event) => setPhraseLength(Number(event.target.value))}
              type="range"
              value={phraseLength}
            />
            <SequenceStrip items={phraseItems} activeIndex={phraseIndex} />
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">匯入樂譜</h3>
                <p className="text-sm text-muted-foreground">支援 1 2 3 5 6、| 分段、+ 高音、逗號低音</p>
              </div>
              <input ref={fileInputRef} className="hidden" type="file" accept=".txt,.md,.csv,text/*" onChange={onFileSelected} />
              <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <FileText className="mr-2 h-4 w-4" />
                檔案
              </Button>
            </div>
            <Textarea value={importText} onChange={(event) => setImportText(event.target.value)} />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => loadImportedScore()}>
                <Upload className="mr-2 h-4 w-4" />
                載入
              </Button>
              <Button variant="outline" onClick={() => setImportText(DEFAULT_IMPORT_TEXT)}>
                範例
              </Button>
            </div>
            {importWarnings.length > 0 && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {importWarnings.slice(0, 3).map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            )}
            <SequenceStrip items={importedNotes} activeIndex={importIndex} />
          </Card>
        </div>
      </section>
    </main>
  );
}
