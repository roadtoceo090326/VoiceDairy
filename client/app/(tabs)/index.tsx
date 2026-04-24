import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { Badge, Card } from "@/src/components/ui";
import { PROMPTS } from "@/src/lib/constants";
import { formatDuration, formatEntryDate } from "@/src/lib/utils";
import { useJournalStore } from "@/src/stores";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const entries = useJournalStore((s) => s.entries);

  const [promptIndex, setPromptIndex] = useState(0);
  const prompt = PROMPTS[promptIndex];

  const recent = useMemo(() => entries.slice(0, 3), [entries]);

  const onShufflePrompt = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
  }, []);

  const onOpenRecording = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/recording");
  }, [router]);

  const onOpenEntry = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push({ pathname: "/entry/[id]", params: { id } } as Href);
    },
    [router],
  );

  const totalDuration = useMemo(() => entries.reduce((acc, e) => acc + e.durationMs, 0), [entries]);

  return (
    <ScrollView
      className="flex-1 bg-[#0D0D0F]"
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
      bounces
      overScrollMode="never"
    >
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-2xl font-bold text-zinc-100">{getGreeting()}, Aryan 👋</Text>
          <Text className="mt-1 text-sm text-zinc-400">Let your voice clear your mind.</Text>
        </View>
        <Badge label="🔥 7-day streak" />
      </View>

      <Card className="mt-5">
        <View className="flex-row items-center justify-between">
          <Badge label="Reflection" />
          <Pressable onPress={onShufflePrompt} className="h-12 w-12 items-center justify-center rounded-xl bg-[#242429]">
            <Ionicons name="shuffle" color="#A78BFA" size={20} />
          </Pressable>
        </View>
        <Text className="mt-3 text-base leading-6 text-zinc-100">{prompt}</Text>
      </Card>

      <View className="mt-8 items-center">
        <Pressable onPress={onOpenRecording} className="h-20 w-20 items-center justify-center rounded-full bg-[#7C6AF7]">
          <Ionicons name="mic" size={32} color="#F4F4F5" />
        </Pressable>
        <Text className="mt-3 text-sm text-zinc-400">Tap to record</Text>
      </View>

      <Text className="mt-8 text-lg font-semibold text-zinc-100">Recent Entries</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
        {recent.map((entry) => (
          <Pressable key={entry.id} onPress={() => void onOpenEntry(entry.id)}>
            <Card className="mr-3 w-64">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-zinc-400">{formatEntryDate(entry.createdAt)}</Text>
                <Text className="text-xs text-violet-300">{formatDuration(entry.durationMs)}</Text>
              </View>
              <Text className="mt-2 text-2xl">{entry.mood === "happy" ? "😊" : entry.mood === "sad" ? "😔" : entry.mood === "anxious" ? "😰" : entry.mood === "grateful" ? "🙏" : entry.mood === "angry" ? "😤" : entry.mood === "tired" ? "😴" : "😐"}</Text>
              <Text className="mt-2 text-sm text-zinc-100" numberOfLines={1}>{entry.transcript}</Text>
            </Card>
          </Pressable>
        ))}
      </ScrollView>

      <View className="mt-8 flex-row gap-3">
        <Card className="flex-1 p-3">
          <Text className="text-lg font-bold text-zinc-100">{entries.length}</Text>
          <Text className="text-xs text-zinc-400">Total Entries</Text>
        </Card>
        <Card className="flex-1 p-3">
          <Text className="text-lg font-bold text-zinc-100">{Math.min(7, entries.length)}</Text>
          <Text className="text-xs text-zinc-400">This Week</Text>
        </Card>
        <Card className="flex-1 p-3">
          <Text className="text-lg font-bold text-zinc-100">{formatDuration(Math.floor(totalDuration / Math.max(entries.length, 1)))}</Text>
          <Text className="text-xs text-zinc-400">Avg Duration</Text>
        </Card>
      </View>
    </ScrollView>
  );
}
