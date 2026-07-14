import { describe, expect, it } from "vitest";
import {
  estimatePitch,
  frequencyToMidi,
  midiToFrequency,
  midiToPitchName,
} from "@/lib/guzheng/pitch-detection";

describe("guzheng pitch detection", () => {
  it("detects a stable A4 sine wave", () => {
    const sampleRate = 48_000;
    const buffer = new Float32Array(2048);
    for (let index = 0; index < buffer.length; index += 1) {
      buffer[index] = Math.sin((2 * Math.PI * 440 * index) / sampleRate) * 0.2;
    }

    const result = estimatePitch(buffer, sampleRate);
    expect(result.frequency).not.toBeNull();
    expect(result.frequency ?? 0).toBeGreaterThan(435);
    expect(result.frequency ?? 0).toBeLessThan(445);
  });

  it("ignores audio below the listening threshold", () => {
    const buffer = new Float32Array(2048).fill(0.0001);
    expect(estimatePitch(buffer, 48_000).frequency).toBeNull();
  });

  it("keeps detecting a softly played note", () => {
    const sampleRate = 48_000;
    const buffer = new Float32Array(2048);
    for (let index = 0; index < buffer.length; index += 1) {
      buffer[index] = Math.sin((2 * Math.PI * 330 * index) / sampleRate) * 0.0015;
    }

    const result = estimatePitch(buffer, sampleRate);
    expect(result.frequency).not.toBeNull();
    expect(result.frequency ?? 0).toBeGreaterThan(325);
    expect(result.frequency ?? 0).toBeLessThan(335);
  });

  it("converts frequencies and MIDI note names", () => {
    expect(frequencyToMidi(440)).toBe(69);
    expect(midiToPitchName(69)).toBe("A4");
    expect(midiToFrequency(69)).toBeCloseTo(440, 5);
  });
});
