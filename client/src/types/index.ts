export type Mood =
  | "happy"
  | "sad"
  | "anxious"
  | "grateful"
  | "angry"
  | "neutral"
  | "tired";

export type CoachType = "therapist" | "friend" | "coach";

export interface Tag {
  id: string;
  label: string;
  color: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  audioUri: string;
  durationMs: number;
  transcript: string;
  refinedTranscript: string;
  summary: string[];
  aiInsight: string;
  mood: Mood;
  tags: string[];
  isFavorite: boolean;
  isProcessing: boolean;
}

export interface RecordingState {
  status: "idle" | "recording" | "paused" | "processing" | "done";
  durationMs: number;
  audioUri: string | null;
  amplitudes: number[];
}

export interface AppSettings {
  coachType: CoachType;
  reminderEnabled: boolean;
  reminderTime: string;
  theme: "dark" | "warm" | "pure";
  appLockEnabled: boolean;
}

export type SortBy = "newest" | "oldest" | "longest";
