import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

import { DEFAULT_TAGS, MOCK_ENTRIES } from "@/src/lib/constants";
import type { JournalEntry, Tag } from "@/src/types";

export async function initMockData(): Promise<{ entries: JournalEntry[]; tags: Tag[] }> {
  return { entries: MOCK_ENTRIES, tags: DEFAULT_TAGS };
}

export async function exportEntriesAsText(entries: JournalEntry[]): Promise<void> {
  const content = entries
    .map((entry) => {
      return [
        `Date: ${entry.createdAt}`,
        `Duration: ${entry.durationMs}ms`,
        `Mood: ${entry.mood}`,
        `Transcript: ${entry.transcript}`,
        `Refined: ${entry.refinedTranscript}`,
        `Insight: ${entry.aiInsight}`,
        "",
      ].join("\n");
    })
    .join("\n");

  const uri = `${FileSystem.cacheDirectory}voice-journal-export.txt`;
  await FileSystem.writeAsStringAsync(uri, content || "No entries");

  const available = await Sharing.isAvailableAsync();
  if (available) {
    await Sharing.shareAsync(uri, {
      mimeType: "text/plain",
      dialogTitle: "Export Journal",
      UTI: "public.plain-text",
    });
  }
}
