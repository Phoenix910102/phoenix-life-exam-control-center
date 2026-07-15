import { create } from "zustand";
import type { BattlefieldAnimationCue } from "../events/animationCues";

type Battlefield3DQueueState = {
  queue: BattlefieldAnimationCue[];
  activeCue?: BattlefieldAnimationCue;
  enqueue: (cues: BattlefieldAnimationCue[]) => void;
  beginNext: () => void;
  completeActive: (cueId: string) => void;
  clear: () => void;
};

export const useBattlefield3DStore = create<Battlefield3DQueueState>((set) => ({
  queue: [],
  activeCue: undefined,
  enqueue: (cues) => set((state) => {
    const known = new Set([state.activeCue?.id, ...state.queue.map((cue) => cue.id)]);
    const incoming = cues.filter((cue) => {
      if (known.has(cue.id)) return false;
      known.add(cue.id);
      return true;
    });
    return {
      queue: [...state.queue, ...incoming].sort((left, right) => right.priority - left.priority),
    };
  }),
  beginNext: () => set((state) => {
    if (state.activeCue || state.queue.length === 0) return state;
    const [activeCue, ...queue] = state.queue;
    return { activeCue, queue };
  }),
  completeActive: (cueId) => set((state) => (
    state.activeCue?.id === cueId ? { activeCue: undefined } : state
  )),
  clear: () => set({ queue: [], activeCue: undefined }),
}));
