export type JianpuDegree = "1" | "2" | "3" | "5" | "6";

export type GuzhengNote = {
  id: string;
  degree: JianpuDegree;
  octave: number;
  midi: number;
  frequency: number;
  pitchName: string;
  registerLabel: string;
};

export type ParsedJianpuNote = {
  id: string;
  raw: string;
  display: string;
  note: GuzhengNote;
  segmentIndex: number;
  noteIndex: number;
};

export type ParsedJianpuScore = {
  notes: ParsedJianpuNote[];
  segmentCount: number;
  warnings: string[];
};

const degreeToPitch = {
  "1": { name: "D", semitone: 2 },
  "2": { name: "E", semitone: 4 },
  "3": { name: "F#", semitone: 6 },
  "5": { name: "A", semitone: 9 },
  "6": { name: "B", semitone: 11 },
} satisfies Record<JianpuDegree, { name: string; semitone: number }>;

const dMajorPentatonicPattern: JianpuDegree[] = ["1", "2", "3", "5", "6"];

function midiToFrequency(midi: number) {
  return Number((440 * 2 ** ((midi - 69) / 12)).toFixed(2));
}

function pitchNameFor(degree: JianpuDegree, octave: number) {
  return `${degreeToPitch[degree].name}${octave}`;
}

function registerLabelFor(octave: number) {
  if (octave <= 2) return "倍低音";
  if (octave === 3) return "低音";
  if (octave === 4) return "中音";
  if (octave === 5) return "高音";
  return "倍高音";
}

function midiFor(degree: JianpuDegree, octave: number) {
  return 12 * (octave + 1) + degreeToPitch[degree].semitone;
}

function makeNote(degree: JianpuDegree, octave: number): GuzhengNote {
  const midi = midiFor(degree, octave);

  return {
    id: `${degree}-${octave}`,
    degree,
    octave,
    midi,
    frequency: midiToFrequency(midi),
    pitchName: pitchNameFor(degree, octave),
    registerLabel: registerLabelFor(octave),
  };
}

export const GUZHENG_NOTES: GuzhengNote[] = [
  ...dMajorPentatonicPattern.flatMap((degree) => makeNote(degree, 2)),
  ...dMajorPentatonicPattern.flatMap((degree) => makeNote(degree, 3)),
  ...dMajorPentatonicPattern.flatMap((degree) => makeNote(degree, 4)),
  ...dMajorPentatonicPattern.flatMap((degree) => makeNote(degree, 5)),
  makeNote("1", 6),
];

export const DEFAULT_GUZHENG_NOTE = GUZHENG_NOTES.find((note) => note.id === "1-4") ?? GUZHENG_NOTES[0];

export function formatJianpu(note: Pick<GuzhengNote, "degree" | "octave">) {
  const shift = note.octave - 4;
  if (shift > 0) return `${note.degree}${"'".repeat(shift)}`;
  if (shift < 0) return `${note.degree}${",".repeat(Math.abs(shift))}`;
  return note.degree;
}

export function findClosestGuzhengNote(frequency: number) {
  return GUZHENG_NOTES.reduce(
    (best, note) => {
      const cents = Math.round(1200 * Math.log2(frequency / note.frequency));
      const absCents = Math.abs(cents);
      return absCents < best.absCents ? { note, cents, absCents } : best;
    },
    { note: GUZHENG_NOTES[0], cents: Infinity, absCents: Infinity },
  );
}

export function pickRandomGuzhengNote(
  previousId?: string,
  range: GuzhengNote[] = GUZHENG_NOTES.slice(5, 21),
) {
  const candidates = range.filter((note) => note.id !== previousId);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? range[0] ?? GUZHENG_NOTES[0];
}

export function makeRandomPhrase(length = 6) {
  const phrase: GuzhengNote[] = [];

  for (let i = 0; i < length; i += 1) {
    phrase.push(pickRandomGuzhengNote(phrase.at(-1)?.id, GUZHENG_NOTES.slice(8, 20)));
  }

  return phrase;
}

function parseOctaveShift(prefix: string, suffix: string) {
  const highMarks = (prefix.match(/[+^]/g)?.length ?? 0) + (suffix.match(/['′’]/g)?.length ?? 0);
  const lowMarks = (prefix.match(/[-_]/g)?.length ?? 0) + (suffix.match(/,/g)?.length ?? 0);
  return highMarks - lowMarks;
}

function resolveNote(degree: JianpuDegree, octave: number) {
  return GUZHENG_NOTES.find((note) => note.degree === degree && note.octave === octave) ?? null;
}

export function parseJianpuScore(input: string): ParsedJianpuScore {
  const notes: ParsedJianpuNote[] = [];
  const warnings: string[] = [];
  let segmentIndex = 0;

  const tokens = input
    .replace(/[｜]/g, "|")
    .replace(/[，、；:：]/g, " ")
    .replace(/\r?\n/g, " | ")
    .split(/(\|)|\s+/)
    .map((token) => token?.trim() ?? "")
    .filter(Boolean);

  tokens.forEach((token) => {
    if (token === "|") {
      if (notes.length > 0) segmentIndex += 1;
      return;
    }

    if (/^0[-–—]*$/.test(token)) return;

    const match = token.match(/^([+\-_^]*)([1-7])([,'′’]*)(?:[-–—.]*\d*)?$/);
    if (!match) {
      warnings.push(`略過無法解析的記號「${token}」`);
      return;
    }

    const [, prefix, degreeRaw, suffix] = match;
    if (!["1", "2", "3", "5", "6"].includes(degreeRaw)) {
      warnings.push(`「${degreeRaw}」不在目前 D 調古箏五聲練習音內`);
      return;
    }

    const degree = degreeRaw as JianpuDegree;
    const octave = 4 + parseOctaveShift(prefix, suffix);
    const note = resolveNote(degree, octave);
    if (!note) {
      warnings.push(`「${token}」超出目前 21 弦 D 調音域`);
      return;
    }

    notes.push({
      id: `${notes.length}-${note.id}`,
      raw: token,
      display: formatJianpu(note),
      note,
      segmentIndex,
      noteIndex: notes.length,
    });
  });

  return {
    notes,
    segmentCount: notes.length === 0 ? 0 : Math.max(...notes.map((note) => note.segmentIndex)) + 1,
    warnings,
  };
}
