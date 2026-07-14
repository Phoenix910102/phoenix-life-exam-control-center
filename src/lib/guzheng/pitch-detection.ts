export const MIN_RMS = 0.0007;
export const MIN_CORRELATION = 0.3;
export const TOLERANCE_CENTS = 40;
export const SUSTAIN_MS = 70;
export const HIT_COOLDOWN_MS = 240;
export const ANALYZE_INTERVAL_MS = 24;
export const ATTEMPT_RELEASE_MS = 110;

export type PitchEstimate = {
  frequency: number | null;
  rms: number;
};

export function estimatePitch(buffer: Float32Array, sampleRate: number): PitchEstimate {
  let sumSquares = 0;
  for (let i = 0; i < buffer.length; i += 1) sumSquares += buffer[i] * buffer[i];

  const rms = Math.sqrt(sumSquares / buffer.length);
  if (rms < MIN_RMS) return { frequency: null, rms };

  const minLag = Math.floor(sampleRate / 1300);
  const maxLag = Math.min(Math.floor(sampleRate / 60), buffer.length - 1);
  const correlations = new Float32Array(maxLag + 1);
  let bestLag = -1;
  let bestCorrelation = 0;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0;
    let energy = 0;
    const sampleCount = buffer.length - lag;

    for (let i = 0; i < sampleCount; i += 1) {
      const current = buffer[i];
      const shifted = buffer[i + lag];
      correlation += current * shifted;
      energy += current * current + shifted * shifted;
    }

    const normalized = energy > 0 ? (2 * correlation) / energy : 0;
    correlations[lag] = normalized;
    if (normalized > bestCorrelation) {
      bestCorrelation = normalized;
      bestLag = lag;
    }
  }

  if (bestLag <= 0 || bestCorrelation < MIN_CORRELATION) return { frequency: null, rms };

  const strongPeakThreshold = Math.max(MIN_CORRELATION, bestCorrelation * 0.96);
  let selectedLag = bestLag;
  for (let lag = minLag + 1; lag < bestLag; lag += 1) {
    if (
      correlations[lag] >= strongPeakThreshold &&
      correlations[lag] >= correlations[lag - 1] &&
      correlations[lag] >= correlations[lag + 1]
    ) {
      selectedLag = lag;
      break;
    }
  }

  const previous = correlations[selectedLag - 1] ?? correlations[selectedLag];
  const current = correlations[selectedLag];
  const next = correlations[selectedLag + 1] ?? correlations[selectedLag];
  const denominator = previous - 2 * current + next;
  const interpolation = Math.abs(denominator) > 1e-6 ? 0.5 * (previous - next) / denominator : 0;
  const refinedLag = selectedLag + Math.max(-0.5, Math.min(0.5, interpolation));

  return { frequency: sampleRate / refinedLag, rms };
}

export function frequencyToMidi(frequency: number) {
  return Math.round(69 + 12 * Math.log2(frequency / 440));
}

export function midiToFrequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function midiToPitchName(midi: number) {
  const pitchClasses = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const pitchClass = pitchClasses[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${pitchClass}${octave}`;
}
