import type { CoachType, Mood } from "@/src/types";

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const transcriptPool = [
  "I felt pulled in too many directions at work, but finishing one key task made me calmer by evening.",
  "Today was emotionally mixed. I had moments of stress, then felt grounded after talking to my sister.",
  "I noticed anxiety rising before lunch, but a short walk reset my energy and helped me refocus.",
  "I am proud I handled a difficult conversation with more patience than usual and stayed present.",
  "My energy was low in the afternoon, but journaling helped me untangle what I was feeling.",
] as const;

const summaryPool = [
  ["Stress showed up early in the day.", "A reset action improved focus.", "You ended with more clarity."],
  ["Emotions were mixed today.", "Connection helped regulate stress.", "You noticed and adapted well."],
  ["Energy dipped in the afternoon.", "You used reflection as support.", "Mood improved by evening."],
] as const;

const moodPool: Mood[] = ["happy", "sad", "anxious", "grateful", "angry", "neutral", "tired"];
const tagPool = ["gratitude", "work", "family", "health", "growth", "anxiety", "relationships", "creativity"] as const;

export async function mockTranscribe(_audioUri: string): Promise<string> {
  await wait(randomBetween(1500, 2500));
  return transcriptPool[randomBetween(0, transcriptPool.length - 1)];
}

export async function mockRefine(transcript: string): Promise<string> {
  await wait(800);
  return transcript.replace(/\bi\b/g, "I").replace(/\s+/g, " ").trim();
}

export async function mockSummarize(_transcript: string): Promise<string[]> {
  await wait(1000);
  return [...summaryPool[randomBetween(0, summaryPool.length - 1)]];
}

export async function mockInsight(transcript: string, coach: CoachType): Promise<string> {
  await wait(1200);
  if (coach === "therapist") {
    return `You seem to be processing emotional load thoughtfully. A gentle boundary and a brief grounding exercise may help with "${transcript.slice(0, 32)}...".`;
  }
  if (coach === "friend") {
    return `You handled a lot today, honestly. Maybe keep it simple tonight: hydrate, rest, and give yourself credit for showing up.`;
  }
  return `Strong self-awareness today. Pick one tiny action for tomorrow morning and execute it before checking messages.`;
}

export async function mockDetectMood(_transcript: string): Promise<Mood> {
  await wait(500);
  return moodPool[randomBetween(0, moodPool.length - 1)];
}

export async function mockDetectTags(_transcript: string): Promise<string[]> {
  await wait(600);
  const first = tagPool[randomBetween(0, tagPool.length - 1)];
  const second = tagPool[randomBetween(0, tagPool.length - 1)];
  const third = tagPool[randomBetween(0, tagPool.length - 1)];
  return Array.from(new Set([first, second, third])).slice(0, 3);
}
