"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CirclePause,
  CirclePlay,
  Mic,
  MicOff,
  RotateCcw,
  ScanText,
  Sparkles,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  JIUJIU_ELECTRONIC_PHRASES,
  JIUJIU_FINGER_GUIDE,
  type JiujiuElectronicNote,
} from "@/lib/guzheng/jiujiu-electronic-score";
import {
  ANALYZE_INTERVAL_MS,
  ATTEMPT_RELEASE_MS,
  HIT_COOLDOWN_MS,
  MIN_RMS,
  SUSTAIN_MS,
  TOLERANCE_CENTS,
  estimatePitch,
  frequencyToMidi,
  midiToFrequency,
  midiToPitchName,
} from "@/lib/guzheng/pitch-detection";
import { cn } from "@/lib/utils/cn";

const BASE_NOTE_MS = 760;
const MEASURES_PER_PAGE = 6;
const MEASURES_PER_ROW = 2;
const SPEED_OPTIONS = [
  { label: "慢速", value: 0.72 },
  { label: "練習", value: 0.88 },
  { label: "原速", value: 1 },
] as const;

const SCORE_PAGES = Array.from(
  { length: Math.ceil(JIUJIU_ELECTRONIC_PHRASES.length / MEASURES_PER_PAGE) },
  (_, index) => ({
    index,
    startIndex: index * MEASURES_PER_PAGE,
    phrases: JIUJIU_ELECTRONIC_PHRASES.slice(
      index * MEASURES_PER_PAGE,
      index * MEASURES_PER_PAGE + MEASURES_PER_PAGE,
    ),
  }),
);

type MicPitchStatus = "idle" | "quiet" | "listening" | "reattack" | "correct" | "low" | "high" | "rest";
type ListeningTuning = "D" | "B";

type PracticePitch = {
  midi: number;
  frequency: number;
  pitchName: string;
};

type MicDetection = {
  status: MicPitchStatus;
  frequency: number | null;
  pitchName: string | null;
  centsToTarget: number | null;
  rms: number;
};

const DEGREE_SEMITONE_OFFSET: Record<Exclude<JiujiuElectronicNote["degree"], "0">, number> = {
  "1": 0,
  "2": 2,
  "3": 4,
  "4": 5,
  "5": 7,
  "6": 9,
  "7": 11,
};

const TUNING_ROOT_MIDI: Record<ListeningTuning, number> = {
  D: 62,
  B: 59,
};

function practicePitchFor(note: JiujiuElectronicNote, tuning: ListeningTuning): PracticePitch | null {
  if (note.degree === "0") return null;
  const midi = TUNING_ROOT_MIDI[tuning] + DEGREE_SEMITONE_OFFSET[note.degree] + note.octave * 12;
  return {
    midi,
    frequency: midiToFrequency(midi),
    pitchName: midiToPitchName(midi),
  };
}

function micStatusText(status: MicPitchStatus, isListening: boolean) {
  if (!isListening) return "等待收音";
  if (status === "rest") return "休止，保持拍子";
  if (status === "quiet") return "音量偏小，再靠近一點";
  if (status === "reattack") return "請撥出下一個音";
  if (status === "correct") return "彈對，自動前進";
  if (status === "low") return "音高偏低";
  if (status === "high") return "音高偏高";
  return "正在辨識古箏音高";
}

export function JiujiuElectronicScore() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [noteIndex, setNoteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.72);
  const [listeningTuning, setListeningTuning] = useState<ListeningTuning>("D");
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState("");
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timedHits, setTimedHits] = useState(0);
  const [totalResponseMs, setTotalResponseMs] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastCorrect, setLastCorrect] = useState("");
  const [detection, setDetection] = useState<MicDetection>({
    status: "idle",
    frequency: null,
    pitchName: null,
    centsToTarget: null,
    rms: 0,
  });
  const phrase = JIUJIU_ELECTRONIC_PHRASES[phraseIndex];
  const activeNote = phrase.notes[noteIndex];
  const activeNoteMs = (BASE_NOTE_MS * activeNote.duration) / speed;
  const scorePage = SCORE_PAGES[Math.floor(phraseIndex / MEASURES_PER_PAGE)];
  const targetPitch = useMemo(
    () => practicePitchFor(activeNote, listeningTuning),
    [activeNote, listeningTuning],
  );

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastAnalyzeRef = useRef(0);
  const correctSinceRef = useRef<number | null>(null);
  const lastHitAtRef = useRef(0);
  const targetStartedAtRef = useRef(0);
  const quietSinceRef = useRef<number | null>(null);
  const previousRmsRef = useRef(0);
  const needsFreshAttackRef = useRef(true);
  const targetRef = useRef<PracticePitch | null>(targetPitch);
  const positionRef = useRef({ phraseIndex, noteIndex });
  const attemptCandidateRef = useRef<{ pitchId: number; since: number; counted: boolean } | null>(null);
  const stopListeningRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    positionRef.current = { phraseIndex, noteIndex };
  }, [noteIndex, phraseIndex]);

  useEffect(() => {
    targetRef.current = targetPitch;
    correctSinceRef.current = null;
    attemptCandidateRef.current = null;
    quietSinceRef.current = null;
    needsFreshAttackRef.current = Boolean(targetPitch);
    targetStartedAtRef.current = performance.now();
    setDetection((current) => ({
      ...current,
      status: activeNote.degree === "0" ? "rest" : isListening ? "reattack" : "idle",
      centsToTarget: null,
    }));
  }, [activeNote.degree, isListening, targetPitch]);

  const advanceFromMic = useCallback((countHit: boolean) => {
    const currentPosition = positionRef.current;
    const currentPhrase = JIUJIU_ELECTRONIC_PHRASES[currentPosition.phraseIndex];
    const currentNote = currentPhrase.notes[currentPosition.noteIndex];
    const currentTarget = targetRef.current;

    if (countHit && currentTarget) {
      const responseMs = targetStartedAtRef.current > 0 ? performance.now() - targetStartedAtRef.current : 0;
      setHits((current) => current + 1);
      setStreak((current) => current + 1);
      setLastCorrect(`${currentNote.degree}${currentNote.octave > 0 ? "′" : ""} · ${currentTarget.pitchName}`);
      if (responseMs > 0) {
        setTimedHits((current) => current + 1);
        setTotalResponseMs((current) => current + responseMs);
      }
    }

    targetRef.current = null;
    needsFreshAttackRef.current = true;
    correctSinceRef.current = null;
    attemptCandidateRef.current = null;

    if (currentPosition.noteIndex < currentPhrase.notes.length - 1) {
      const nextPosition = { ...currentPosition, noteIndex: currentPosition.noteIndex + 1 };
      positionRef.current = nextPosition;
      setNoteIndex(nextPosition.noteIndex);
      return;
    }

    if (currentPosition.phraseIndex < JIUJIU_ELECTRONIC_PHRASES.length - 1) {
      const nextPosition = { phraseIndex: currentPosition.phraseIndex + 1, noteIndex: 0 };
      positionRef.current = nextPosition;
      setPhraseIndex(nextPosition.phraseIndex);
      setNoteIndex(0);
      return;
    }

    setLastCorrect("全段完成");
    window.setTimeout(() => stopListeningRef.current(), 180);
  }, []);

  const analyzeMicrophone = useCallback(() => {
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
      const previousRms = previousRmsRef.current;
      const attackDetected =
        pitch.rms >= MIN_RMS &&
        (previousRms < MIN_RMS || pitch.rms > previousRms * 1.04 + 0.00004);
      previousRmsRef.current = pitch.rms;

      if (!pitch.frequency) {
        correctSinceRef.current = null;
        quietSinceRef.current ??= now;
        if (now - quietSinceRef.current >= ATTEMPT_RELEASE_MS) {
          attemptCandidateRef.current = null;
        }
        setDetection({
          status: pitch.rms < MIN_RMS ? "quiet" : "listening",
          frequency: null,
          pitchName: null,
          centsToTarget: null,
          rms: pitch.rms,
        });
      } else if (!target) {
        setDetection({
          status: "rest",
          frequency: pitch.frequency,
          pitchName: midiToPitchName(frequencyToMidi(pitch.frequency)),
          centsToTarget: null,
          rms: pitch.rms,
        });
      } else if (needsFreshAttackRef.current && !attackDetected) {
        correctSinceRef.current = null;
        setDetection({
          status: "reattack",
          frequency: pitch.frequency,
          pitchName: midiToPitchName(frequencyToMidi(pitch.frequency)),
          centsToTarget: Math.round(1200 * Math.log2(pitch.frequency / target.frequency)),
          rms: pitch.rms,
        });
      } else {
        needsFreshAttackRef.current = false;
        quietSinceRef.current = null;

        const detectedMidi = frequencyToMidi(pitch.frequency);
        const centsToTarget = Math.round(1200 * Math.log2(pitch.frequency / target.frequency));
        const isCorrect = Math.abs(centsToTarget) <= TOLERANCE_CENTS;
        const candidate = attemptCandidateRef.current;

        if (!candidate || candidate.pitchId !== detectedMidi) {
          attemptCandidateRef.current = { pitchId: detectedMidi, since: now, counted: false };
        } else if (!candidate.counted && now - candidate.since >= SUSTAIN_MS) {
          candidate.counted = true;
          setAttempts((current) => current + 1);
          if (!isCorrect) setStreak(0);
        }

        setDetection({
          status: isCorrect ? "correct" : centsToTarget < 0 ? "low" : "high",
          frequency: pitch.frequency,
          pitchName: midiToPitchName(detectedMidi),
          centsToTarget,
          rms: pitch.rms,
        });

        if (isCorrect) {
          correctSinceRef.current ??= now;
          if (
            now - correctSinceRef.current >= SUSTAIN_MS &&
            now - lastHitAtRef.current >= HIT_COOLDOWN_MS
          ) {
            lastHitAtRef.current = now;
            advanceFromMic(true);
          }
        } else {
          correctSinceRef.current = null;
        }
      }
    }

    frameRef.current = requestAnimationFrame(analyzeMicrophone);
  }, [advanceFromMic]);

  const stopListening = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    gainRef.current = null;
    bufferRef.current = null;
    correctSinceRef.current = null;
    attemptCandidateRef.current = null;
    quietSinceRef.current = null;
    previousRmsRef.current = 0;
    setIsListening(false);
    setDetection((current) => ({ ...current, status: "idle", centsToTarget: null }));
  }, []);

  stopListeningRef.current = stopListening;

  const startListening = useCallback(async () => {
    setMicError("");
    setIsPlaying(false);

    if (!window.isSecureContext) {
      setMicError("手機麥克風需要 HTTPS，請使用目前的安全網址開啟。");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError("這個瀏覽器無法使用麥克風，請改用 Safari 或 Chrome。");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const AudioContextConstructor =
        window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextConstructor) {
        stream.getTracks().forEach((track) => track.stop());
        setMicError("這個瀏覽器沒有提供音訊分析功能。");
        return;
      }

      const audioContext = new AudioContextConstructor({ latencyHint: "interactive" });
      const analyser = audioContext.createAnalyser();
      const gain = audioContext.createGain();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0;
      gain.gain.value = 2.6;
      audioContext.createMediaStreamSource(stream).connect(gain).connect(analyser);
      await audioContext.resume();

      streamRef.current = stream;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      gainRef.current = gain;
      targetStartedAtRef.current = performance.now();
      needsFreshAttackRef.current = Boolean(targetRef.current);
      previousRmsRef.current = 0;
      attemptCandidateRef.current = null;
      quietSinceRef.current = null;
      setIsListening(true);
      setDetection((current) => ({
        ...current,
        status: targetRef.current ? "reattack" : "rest",
        frequency: null,
        pitchName: null,
        centsToTarget: null,
      }));
      frameRef.current = requestAnimationFrame(analyzeMicrophone);
    } catch (error) {
      if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError")) {
        setMicError("麥克風權限被拒絕，請在瀏覽器的網站設定中允許麥克風。");
      } else {
        setMicError(error instanceof Error ? error.message : "無法啟動麥克風，請重新整理後再試一次。");
      }
    }
  }, [analyzeMicrophone]);

  useEffect(() => stopListening, [stopListening]);

  useEffect(() => {
    if (!isListening || activeNote.degree !== "0") return;
    const timer = window.setTimeout(() => advanceFromMic(false), activeNoteMs);
    return () => window.clearTimeout(timer);
  }, [activeNote.degree, activeNoteMs, advanceFromMic, isListening]);

  useEffect(() => {
    if (!isPlaying || isListening) return;

    const timer = window.setTimeout(() => {
      if (noteIndex < phrase.notes.length - 1) {
        setNoteIndex((current) => current + 1);
        return;
      }

      if (phraseIndex < JIUJIU_ELECTRONIC_PHRASES.length - 1) {
        setPhraseIndex((current) => current + 1);
        setNoteIndex(0);
        return;
      }

      setIsPlaying(false);
    }, activeNoteMs);

    return () => window.clearTimeout(timer);
  }, [activeNoteMs, isListening, isPlaying, noteIndex, phrase.notes.length, phraseIndex]);

  const selectPhrase = (index: number) => {
    const nextIndex = Math.max(0, Math.min(JIUJIU_ELECTRONIC_PHRASES.length - 1, index));
    setPhraseIndex(nextIndex);
    setNoteIndex(0);
    setIsPlaying(false);
  };

  const moveNote = (offset: number) => {
    if (offset < 0 && noteIndex === 0 && phraseIndex > 0) {
      const previousPhraseIndex = phraseIndex - 1;
      setPhraseIndex(previousPhraseIndex);
      setNoteIndex(JIUJIU_ELECTRONIC_PHRASES[previousPhraseIndex].notes.length - 1);
    } else if (offset > 0 && noteIndex === phrase.notes.length - 1 && phraseIndex < JIUJIU_ELECTRONIC_PHRASES.length - 1) {
      setPhraseIndex((current) => current + 1);
      setNoteIndex(0);
    } else {
      setNoteIndex((current) => Math.max(0, Math.min(phrase.notes.length - 1, current + offset)));
    }
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isListening) stopListening();
    const isAtEnd =
      phraseIndex === JIUJIU_ELECTRONIC_PHRASES.length - 1 && noteIndex === phrase.notes.length - 1;
    if (!isPlaying && isAtEnd) {
      setPhraseIndex(0);
      setNoteIndex(0);
    }
    setIsPlaying((current) => !current);
  };

  const resetPractice = () => {
    setNoteIndex(0);
    setIsPlaying(false);
    setHits(0);
    setAttempts(0);
    setTimedHits(0);
    setTotalResponseMs(0);
    setStreak(0);
    setLastCorrect("");
    targetStartedAtRef.current = performance.now();
    attemptCandidateRef.current = null;
    needsFreshAttackRef.current = Boolean(targetPitch);
  };

  const accuracy = attempts > 0 ? Math.round((hits / attempts) * 100) : null;
  const averageResponseSeconds = timedHits > 0 ? totalResponseMs / timedHits / 1000 : null;
  const inputStrength = Math.min(100, Math.round((detection.rms / 0.04) * 100));
  const centsLabel = detection.centsToTarget === null ? "--" : `${detection.centsToTarget > 0 ? "+" : ""}${detection.centsToTarget}`;

  return (
    <section
      className="overflow-hidden rounded-lg border border-[#745d31] bg-[#0c1210] text-[#f7ecd5] shadow-[0_18px_55px_rgba(20,27,23,0.24)]"
      style={{ "--electronic-note-ms": `${activeNoteMs}ms` } as React.CSSProperties}
    >
      <header className="border-b border-[#594727] bg-[#121b17] px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-medium text-[#d9b458]">
              <ScanText className="h-4 w-4" />
              OCR 定位 · 人工校對主旋律
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#fff7e7]">主歌第一課 · 電子簡譜</h2>
            <p className="mt-1 text-sm leading-6 text-[#aab6af]">
              每個音下方依序顯示歌詞與新手指法；燙金游標代表現在要彈的音。
            </p>
          </div>

          <div className="inline-flex rounded-md border border-[#4a574f] bg-[#0d1411] p-1" aria-label="播放速度">
            {SPEED_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "h-8 rounded px-3 text-xs transition",
                  speed === option.value
                    ? "bg-[#b88831] text-[#160f05]"
                    : "text-[#aeb9b3] hover:bg-[#202b25] hover:text-[#f2e6ca]",
                )}
                onClick={() => setSpeed(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {SCORE_PAGES.map((page) => (
            <button
              key={page.index}
              type="button"
              aria-current={scorePage.index === page.index ? "step" : undefined}
              className={cn(
                "h-10 shrink-0 rounded-md border px-3 text-sm transition",
                scorePage.index === page.index
                  ? "border-[#e2b952] bg-[#3b2d17] text-[#ffe8a6] shadow-[inset_0_0_0_1px_rgba(255,231,161,0.16)]"
                  : "border-[#3c4942] bg-[#121a16] text-[#aeb9b3] hover:border-[#756337] hover:text-[#ede1c5]",
              )}
              onClick={() => selectPhrase(page.startIndex)}
            >
              <span className="mr-2 text-xs tabular-nums text-[#8e876d]">
                {String(page.startIndex + 1).padStart(2, "0")}–
                {String(page.startIndex + page.phrases.length).padStart(2, "0")}
              </span>
              {page.phrases[0]?.title} · {page.phrases.at(-1)?.title}
            </button>
          ))}
        </div>
      </header>

      <div className="border-b border-[#3d4943] bg-[#080c0a] px-4 py-5 text-center sm:px-8">
        <p className="text-xs text-[#827b65]">每頁六小節 · 每行兩小節</p>
        <div className="mt-3 space-y-1 text-lg font-semibold leading-8 sm:text-xl" aria-live="polite">
          {Array.from({ length: Math.ceil(scorePage.phrases.length / MEASURES_PER_ROW) }, (_, rowIndex) =>
            scorePage.phrases.slice(rowIndex * MEASURES_PER_ROW, rowIndex * MEASURES_PER_ROW + MEASURES_PER_ROW),
          ).map((rowPhrases, rowIndex) => (
            <div key={rowIndex} className="min-h-8">
              {rowPhrases.map((linePhrase, phraseOffset) => {
                const pagePhraseOffset = rowIndex * MEASURES_PER_ROW + phraseOffset;
                const linePhraseIndex = scorePage.startIndex + pagePhraseOffset;
                return (
                  <span key={linePhrase.id}>
                    {phraseOffset > 0 && <span className="px-3 text-[#544f42]">｜</span>}
                    {linePhrase.notes.map((note, lineNoteIndex) => {
                      const isActive = linePhraseIndex === phraseIndex && lineNoteIndex === noteIndex;
                      const isComplete =
                        linePhraseIndex < phraseIndex ||
                        (linePhraseIndex === phraseIndex && lineNoteIndex < noteIndex);
                      return (
                        <span
                          key={note.id}
                          className={cn(
                            "px-0.5",
                            isActive && "electronic-lyric-gold",
                            !isActive && (isComplete ? "text-[#716e62]" : "text-[#b4b0a1]"),
                          )}
                        >
                          {note.lyric || (isActive ? "　" : "")}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-[#3d4943] bg-[#101815] p-3 sm:p-5">
        <div className="grid gap-3 md:grid-cols-2">
          {scorePage.phrases.map((measure, measureOffset) => {
            const measureIndex = scorePage.startIndex + measureOffset;
            const isCurrentMeasure = measureIndex === phraseIndex;
            return (
              <div
                key={measure.id}
                className={cn(
                  "overflow-hidden rounded-md border bg-[#111a16] transition",
                  isCurrentMeasure
                    ? "border-[#b88c35] shadow-[0_0_20px_rgba(209,165,62,0.1)]"
                    : "border-[#34413a]",
                )}
              >
                <div className="flex items-center justify-between border-b border-[#34413a] px-2.5 py-1.5 text-[11px]">
                  <span className="tabular-nums text-[#8f8568]">小節 {String(measureIndex + 1).padStart(2, "0")}</span>
                  <span className={isCurrentMeasure ? "text-[#d9b45a]" : "text-[#78857e]"}>{measure.title}</span>
                </div>
                <div
                  className="grid gap-1 p-2"
                  style={{ gridTemplateColumns: `repeat(${measure.notes.length}, minmax(0, 1fr))` }}
                >
                  {measure.notes.map((note, measureNoteIndex) => {
                    const isActive = measureIndex === phraseIndex && measureNoteIndex === noteIndex;
                    const isComplete =
                      measureIndex < phraseIndex ||
                      (measureIndex === phraseIndex && measureNoteIndex < noteIndex);
                    return (
                      <button
                        key={note.id}
                        type="button"
                        aria-label={`${note.degree === "0" ? "休止" : `${note.degree} 音`}，${note.lyric || "無歌詞"}，${note.finger}`}
                        className={cn(
                          "electronic-note relative grid h-28 min-w-0 grid-rows-[0.7rem_2.4rem_1.35rem_1.35rem] place-items-center overflow-hidden rounded border px-0.5 py-1.5 transition",
                          isActive
                            ? "electronic-note-active border-[#f0c55c] bg-[#332713] shadow-[0_0_20px_rgba(221,173,62,0.2)]"
                            : isComplete
                              ? "border-[#51452d] bg-[#171b16] text-[#817a68]"
                              : "border-[#334038] bg-[#151f1a] text-[#d7d1c0] hover:border-[#716039]",
                        )}
                        onClick={() => {
                          setPhraseIndex(measureIndex);
                          setNoteIndex(measureNoteIndex);
                          setIsPlaying(false);
                        }}
                      >
                        <span
                          className={cn("text-[10px] leading-none", note.octave === 1 ? "opacity-100" : "opacity-0")}
                          aria-hidden="true"
                        >
                          ·
                        </span>
                        <span className={cn("text-3xl font-semibold leading-none", isActive && "electronic-note-gold")}>
                          {note.degree}
                        </span>
                        <span className={cn("max-w-full truncate text-[11px]", isActive ? "text-[#ffe4a0]" : "text-[#c9c3b2]")}>
                          {note.lyric || "　"}
                        </span>
                        <span
                          className={cn(
                            "inline-flex max-w-full items-center justify-center rounded border px-1 py-0.5 text-[9px]",
                            isActive
                              ? "border-[#d6a93e] bg-[#6d4e17] text-[#fff0b4]"
                              : "border-[#465149] bg-[#111814] text-[#9eaaa3]",
                          )}
                        >
                          {note.finger}
                        </span>
                        {isActive && <span key={`sweep-${note.id}`} className="electronic-note-sweep" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="border-b border-[#3d4943] px-4 py-5 lg:border-b-0 lg:border-r sm:px-5">
          <p className="text-xs text-[#8d988f]">現在的指法</p>
          <div className="mt-2 flex items-start gap-3">
            <span className="inline-flex h-10 min-w-14 items-center justify-center rounded-md border border-[#c79a37] bg-[#4c3818] px-3 font-semibold text-[#ffe8a5]">
              {activeNote.finger}
            </span>
            <p className="text-sm leading-7 text-[#d5d7cf]">{JIUJIU_FINGER_GUIDE[activeNote.finger]}</p>
          </div>
          <p className="mt-4 border-l-2 border-[#a47c2f] pl-3 text-sm leading-6 text-[#aeb7b1]">{phrase.practiceTip}</p>
        </div>

        <div className="flex flex-col justify-between gap-4 bg-[#0e1612] px-4 py-5 sm:px-5">
          <div>
            <p className="inline-flex items-center gap-2 text-xs text-[#cfaf5e]">
              <Sparkles className="h-4 w-4" />
              第 {scorePage.index + 1} / {SCORE_PAGES.length} 頁 · {scorePage.phrases.length} 小節
            </p>
            <p className="mt-2 text-sm text-[#99a69f]">
              本頁歌詞：{scorePage.phrases.map((item) => item.lyric).join("｜")}
            </p>
            <p className="mt-1 text-xs text-[#6f7d75]">
              目前第 {phraseIndex + 1} 小節 · 第 {noteIndex + 1} / {phrase.notes.length} 音
            </p>
          </div>

          <div className="overflow-hidden rounded-md border border-[#3f5148] bg-[#0a100d]">
            <div className="flex items-center justify-between gap-3 border-b border-[#304039] px-3 py-2">
              <span className="text-[11px] text-[#829088]">收音調性</span>
              <div className="inline-flex rounded border border-[#3c4a43] bg-[#111914] p-0.5" aria-label="收音調性">
                {(["D", "B"] as const).map((tuning) => (
                  <button
                    key={tuning}
                    type="button"
                    className={cn(
                      "h-7 rounded px-2 text-[11px] transition",
                      listeningTuning === tuning
                        ? "bg-[#6b4d1c] text-[#ffe4a0]"
                        : "text-[#8f9b94] hover:bg-[#202b25]",
                    )}
                    onClick={() => setListeningTuning(tuning)}
                  >
                    {tuning === "D" ? "D 調標準古箏" : "B 調原譜"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-[#304039] px-3 py-2.5">
              <p
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-medium",
                  detection.status === "correct" ? "text-[#78d6a9]" : "text-[#dbc37d]",
                )}
                aria-live="polite"
              >
                {detection.status === "correct" ? <CircleCheck className="h-4 w-4" /> : <Waves className="h-4 w-4" />}
                {micStatusText(detection.status, isListening)}
              </p>
              <span className="inline-flex items-center gap-2 text-[10px] text-[#6f7d75]">
                高靈敏 2.6× · 低延遲
                <span className={cn("h-2 w-2 rounded-full", isListening ? "animate-pulse bg-[#57c88d]" : "bg-[#46524c]")} />
              </span>
            </div>

            <div className="grid grid-cols-2 divide-x divide-[#304039] border-b border-[#304039]">
              <div className="px-3 py-3">
                <p className="text-[11px] text-[#74827b]">目標音</p>
                <p className="mt-1 text-sm font-semibold text-[#f1dfad]">
                  {activeNote.degree === "0" ? "休止" : `${activeNote.degree}${activeNote.octave > 0 ? "′" : ""} · ${targetPitch?.pitchName}`}
                </p>
              </div>
              <div className="px-3 py-3">
                <p className="text-[11px] text-[#74827b]">收到的音</p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-[#d6ded9]">
                  {detection.pitchName ?? "--"}
                  {detection.frequency ? ` · ${detection.frequency.toFixed(1)} Hz` : ""}
                </p>
              </div>
            </div>

            <div className="px-3 py-3">
              <div className="flex items-center justify-between text-[11px] text-[#829088]">
                <span>收音強度</span>
                <span className="tabular-nums">偏差 {centsLabel} cents</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#26332d]">
                <span
                  className={cn(
                    "block h-full rounded-full transition-[width] duration-75",
                    detection.status === "correct" ? "bg-[#55c98b]" : "bg-[#c79a39]",
                  )}
                  style={{ width: `${inputStrength}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-[#304039] border-t border-[#304039] text-center">
              <div className="px-2 py-2.5">
                <p className="text-[11px] text-[#74827b]">準確率</p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-[#e6d8b3]">{accuracy === null ? "--" : `${accuracy}%`}</p>
              </div>
              <div className="px-2 py-2.5">
                <p className="text-[11px] text-[#74827b]">平均速度</p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-[#e6d8b3]">
                  {averageResponseSeconds === null ? "--" : `${averageResponseSeconds.toFixed(1)} 秒`}
                </p>
              </div>
              <div className="px-2 py-2.5">
                <p className="text-[11px] text-[#74827b]">連續彈對</p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-[#e6d8b3]">{streak}</p>
              </div>
            </div>

            {lastCorrect && (
              <p className="border-t border-[#304039] px-3 py-2 text-xs text-[#82caa5]">
                上一音：{lastCorrect} · {hits}/{attempts} 次判定
              </p>
            )}
          </div>

          {micError && (
            <p className="rounded-md border border-[#854b41] bg-[#2b1715] px-3 py-2 text-xs leading-5 text-[#f0b2a8]">
              {micError}
            </p>
          )}

          <Button
            className={cn(
              "w-full",
              isListening
                ? "bg-[#873f34] text-[#fff4ed] hover:bg-[#9a4a3d]"
                : "bg-[#278960] text-white hover:bg-[#329d70]",
            )}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {isListening ? "停止收音" : "開始收音並自動判定"}
          </Button>

          <div className="grid grid-cols-[2.75rem_1fr_2.75rem_2.75rem] gap-2">
            <Button
              title="上一音"
              aria-label="上一音"
              className="border-[#59645d] bg-[#17211c] text-[#e8debf] hover:bg-[#253129]"
              variant="outline"
              disabled={phraseIndex === 0 && noteIndex === 0}
              onClick={() => moveNote(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button className="bg-[#bc8a2f] text-[#160f05] hover:bg-[#d7aa4c]" onClick={togglePlayback}>
              {isPlaying ? <CirclePause className="mr-2 h-4 w-4" /> : <CirclePlay className="mr-2 h-4 w-4" />}
              {isPlaying ? "暫停" : "播放高亮"}
            </Button>
            <Button
              title="下一音"
              aria-label="下一音"
              className="border-[#59645d] bg-[#17211c] text-[#e8debf] hover:bg-[#253129]"
              variant="outline"
              disabled={
                phraseIndex === JIUJIU_ELECTRONIC_PHRASES.length - 1 && noteIndex === phrase.notes.length - 1
              }
              onClick={() => moveNote(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              title="重練本段"
              aria-label="重練本段"
              className="border-[#59645d] bg-[#17211c] text-[#e8debf] hover:bg-[#253129]"
              variant="outline"
              onClick={resetPractice}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#594727] bg-[#171f1b] px-4 py-3 text-xs leading-5 text-[#8f9b94] sm:px-5">
        本電子譜以你上傳的印刷簡譜做 OCR 定位，再人工核對主旋律。下方指法為新手練習建議，不冒充原手寫譜的編配標記。
      </footer>

      <style jsx global>{`
        .electronic-note-active {
          isolation: isolate;
        }

        .electronic-note > * {
          position: relative;
          z-index: 1;
        }

        .electronic-note-gold,
        .electronic-lyric-gold {
          color: transparent;
          background-image: linear-gradient(90deg, #fff6c8 0%, #c88b25 32%, #fff0a3 54%, #9a6419 100%);
          background-size: 220% 100%;
          background-position: 100% 0;
          background-clip: text;
          -webkit-background-clip: text;
          animation: electronic-gold-flow var(--electronic-note-ms, 760ms) linear forwards;
          text-shadow: 0 0 18px rgba(238, 190, 77, 0.2);
        }

        .electronic-note-sweep {
          position: absolute;
          inset-block: 0;
          left: -2.75rem;
          z-index: 0;
          width: 2.75rem;
          background: linear-gradient(90deg, transparent, rgba(255, 229, 147, 0.22), transparent);
          animation: electronic-note-sweep var(--electronic-note-ms, 760ms) linear forwards;
          transform: skewX(-10deg);
        }

        @keyframes electronic-gold-flow {
          from {
            background-position: 100% 0;
          }
          to {
            background-position: 0 0;
          }
        }

        @keyframes electronic-note-sweep {
          from {
            left: -2.75rem;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          to {
            left: 100%;
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .electronic-note-gold,
          .electronic-lyric-gold,
          .electronic-note-sweep {
            animation-duration: 1ms;
          }
        }
      `}</style>
    </section>
  );
}
