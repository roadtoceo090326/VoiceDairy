import * as FileSystem from "expo-file-system/legacy";

import type { RecordingItem } from "@/types/recording";

const STORAGE_FILE_URI = `${FileSystem.documentDirectory}recordings.json`;

function isRecordingItem(value: unknown): value is RecordingItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<RecordingItem>;

  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.uri === "string" &&
    typeof item.durationMs === "number" &&
    typeof item.createdAt === "string" &&
    (typeof item.transcript === "string" || typeof item.transcript === "undefined")
  );
}

export async function getRecordings(): Promise<RecordingItem[]> {
  const info = await FileSystem.getInfoAsync(STORAGE_FILE_URI);
  if (!info.exists) {
    return [];
  }

  try {
    const raw = await FileSystem.readAsStringAsync(STORAGE_FILE_URI);
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isRecordingItem).map((item) => ({
      ...item,
      transcript: item.transcript ?? "",
    }));
  } catch {
    return [];
  }
}

export async function saveRecordings(items: RecordingItem[]): Promise<void> {
  await FileSystem.writeAsStringAsync(
    STORAGE_FILE_URI,
    JSON.stringify(items, null, 2),
  );
}

export async function addRecording(item: RecordingItem): Promise<RecordingItem[]> {
  const current = await getRecordings();
  const next = [item, ...current];
  await saveRecordings(next);
  return next;
}

export async function removeRecording(id: string): Promise<RecordingItem[]> {
  const current = await getRecordings();
  const next = current.filter((item) => item.id !== id);
  await saveRecordings(next);
  return next;
}
