import { create } from "zustand";

import type { RecordingState } from "@/src/types";

type RecordingStore = {
  state: RecordingState;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: (payload: { durationMs: number; audioUri: string | null }) => void;
  resetRecording: () => void;
  setProcessing: () => void;
  pushAmplitude: (value: number) => void;
};

const initialState: RecordingState = {
  status: "idle",
  durationMs: 0,
  audioUri: null,
  amplitudes: [],
};

export const useRecordingStore = create<RecordingStore>((set) => ({
  state: initialState,
  startRecording: () =>
    set({
      state: {
        status: "recording",
        durationMs: 0,
        audioUri: null,
        amplitudes: [],
      },
    }),
  pauseRecording: () => set((store) => ({ state: { ...store.state, status: "paused" } })),
  resumeRecording: () => set((store) => ({ state: { ...store.state, status: "recording" } })),
  stopRecording: ({ durationMs, audioUri }) =>
    set((store) => ({
      state: { ...store.state, status: "done", durationMs, audioUri },
    })),
  setProcessing: () => set((store) => ({ state: { ...store.state, status: "processing" } })),
  resetRecording: () => set({ state: initialState }),
  pushAmplitude: (value) =>
    set((store) => ({
      state: {
        ...store.state,
        amplitudes: [...store.state.amplitudes.slice(-39), Math.max(0, Math.min(1, value))],
      },
    })),
}));
