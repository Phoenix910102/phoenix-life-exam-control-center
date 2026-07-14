import { describe, expect, it } from "vitest";
import {
  DEFAULT_GUZHENG_NOTE,
  findClosestGuzhengNote,
  formatJianpu,
  makeRandomPhrase,
  parseJianpuScore,
} from "@/lib/guzheng/jianpu";

describe("guzheng jianpu helpers", () => {
  it("formats octave markers for text jianpu", () => {
    expect(formatJianpu({ degree: "1", octave: 2 })).toBe("1,,");
    expect(formatJianpu({ degree: "2", octave: 3 })).toBe("2,");
    expect(formatJianpu(DEFAULT_GUZHENG_NOTE)).toBe("1");
    expect(formatJianpu({ degree: "6", octave: 5 })).toBe("6'");
  });

  it("parses imported score text into playable D major pentatonic notes", () => {
    const score = parseJianpuScore("1 2 3 5 | 6 5 3 2\n+1 0 6, 4");

    expect(score.notes.map((item) => item.display)).toEqual(["1", "2", "3", "5", "6", "5", "3", "2", "1'", "6,"]);
    expect(score.segmentCount).toBe(3);
    expect(score.warnings).toContain("「4」不在目前 D 調古箏五聲練習音內");
  });

  it("finds the nearest guzheng note from measured frequency", () => {
    const result = findClosestGuzhengNote(294);

    expect(result.note.pitchName).toBe("D4");
    expect(Math.abs(result.cents)).toBeLessThan(5);
  });

  it("generates a phrase without immediate repeats", () => {
    const phrase = makeRandomPhrase(8);

    expect(phrase).toHaveLength(8);
    phrase.forEach((note, index) => {
      if (index > 0) expect(note.id).not.toBe(phrase[index - 1].id);
    });
  });
});
