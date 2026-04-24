import { useMemo } from "react";
import { startOfDay, subDays, isSameDay } from "date-fns";

import type { JournalEntry } from "@/src/types";

export function useStreak(entries: JournalEntry[]) {
  return useMemo(() => {
    const today = startOfDay(new Date());
    const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

    const hasEntryOnDay = days.map((day) =>
      entries.some((entry) => isSameDay(new Date(entry.createdAt), day)),
    );

    let count = 0;
    for (let i = hasEntryOnDay.length - 1; i >= 0; i -= 1) {
      if (!hasEntryOnDay[i]) break;
      count += 1;
    }

    return { hasEntryOnDay, streakCount: count };
  }, [entries]);
}
