import { endOfMonth, format, startOfMonth, subDays } from "date-fns";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { EmptyState } from "@/src/components/ui";
import { MoodChart, StreakRow, TagStats } from "@/src/components/insights";
import { COLORS } from "@/src/lib/constants";
import { formatDuration } from "@/src/lib/utils";
import { useStreak } from "@/src/hooks";
import { useJournalStore } from "@/src/stores";

export default function InsightsScreen() {
  const entries = useJournalStore((s) => s.entries);
  const [monthOffset, setMonthOffset] = useState(0);

  const selectedMonth = useMemo(() => {
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth() - monthOffset, 1);
  }, [monthOffset]);

  const monthEntries = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return entries.filter((entry) => {
      const created = new Date(entry.createdAt);
      return created >= start && created <= end;
    });
  }, [entries, selectedMonth]);

  const moodData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const dayDate = subDays(new Date(), 6 - i);
      const dayEntries = entries.filter(
        (entry) => format(new Date(entry.createdAt), "yyyy-MM-dd") === format(dayDate, "yyyy-MM-dd"),
      );
      const mood = dayEntries[0]?.mood ?? "neutral";
      return {
        day: format(dayDate, "EEE"),
        value: 16 + dayEntries.length * 12,
        color: COLORS.mood[mood],
      };
    });
  }, [entries]);

  const { hasEntryOnDay, streakCount } = useStreak(entries);

  const tagStats = useMemo(() => {
    const map = new Map<string, number>();
    monthEntries.forEach((entry) => {
      entry.tags.forEach((tag) => {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      });
    });
    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [monthEntries]);

  const totalMs = useMemo(() => entries.reduce((sum, e) => sum + e.durationMs, 0), [entries]);
  const avgMs = useMemo(() => (entries.length ? Math.floor(totalMs / entries.length) : 0), [entries.length, totalMs]);

  if (entries.length < 3) {
    return (
      <View className="flex-1 bg-[#0D0D0F] px-5 pt-5">
        <EmptyState
          title="Not enough data yet"
          description="Record at least 3 entries to unlock insights."
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#0D0D0F] px-5 pt-5" contentContainerStyle={{ paddingBottom: 32 }}>
      <Text className="text-2xl font-bold text-zinc-100">Insights</Text>

      <View className="mt-3 flex-row items-center justify-between rounded-xl border border-[#27272A] bg-[#1A1A1F] p-3">
        <Text className="text-sm text-zinc-200">{format(selectedMonth, "MMMM yyyy")}</Text>
        <View className="flex-row gap-2">
          <Text onPress={() => setMonthOffset((v) => v + 1)} className="rounded-md bg-[#242429] px-3 py-2 text-zinc-200">◀</Text>
          <Text onPress={() => setMonthOffset((v) => Math.max(0, v - 1))} className="rounded-md bg-[#242429] px-3 py-2 text-zinc-200">▶</Text>
        </View>
      </View>

      <View className="mt-4">
        <MoodChart data={moodData} />
      </View>
      <View className="mt-4">
        <StreakRow hasEntryOnDay={hasEntryOnDay} />
      </View>
      <View className="mt-4">
        <TagStats data={tagStats} />
      </View>

      <View className="mt-4 rounded-2xl border border-[#27272A] bg-[#1A1A1F] p-4">
        <Text className="text-base font-semibold text-zinc-100">Stats</Text>
        <Text className="mt-2 text-sm text-zinc-300">Streak: {streakCount} days</Text>
        <Text className="mt-1 text-sm text-zinc-300">Total entries: {entries.length}</Text>
        <Text className="mt-1 text-sm text-zinc-300">Total recording time: {formatDuration(totalMs)}</Text>
        <Text className="mt-1 text-sm text-zinc-300">Average duration: {formatDuration(avgMs)}</Text>
      </View>
    </ScrollView>
  );
}
