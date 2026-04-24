import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Badge, Button, Card, useToast } from "@/src/components/ui";
import { useAudioPlayer } from "@/src/hooks";
import { exportEntriesAsText } from "@/src/lib/db";
import { formatDuration, formatEntryDate } from "@/src/lib/utils";
import { useJournalStore } from "@/src/stores";

const tabs = ["Transcript", "Refined", "Summary", "AI Insight"] as const;

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const entry = useJournalStore((s) => s.entries.find((item) => item.id === id));
  const deleteEntry = useJournalStore((s) => s.deleteEntry);
  const toggleFavorite = useJournalStore((s) => s.toggleFavorite);
  const setFilter = useJournalStore((s) => s.setFilter);

  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Transcript");
  const [progressWidth, setProgressWidth] = useState(280);
  const tabX = useSharedValue(0);

  const { isPlaying, positionMs, durationMs, play, pause, seekTo } = useAudioPlayer(entry?.audioUri ?? "");

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabX.value }],
  }));

  const onTabPress = useCallback((index: number, tab: (typeof tabs)[number]) => {
    tabX.value = withSpring(index * 92);
    setActiveTab(tab);
  }, [tabX]);

  const onToggleFavorite = useCallback(async () => {
    if (!entry) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(entry.id);
  }, [entry, toggleFavorite]);

  const onDelete = useCallback(() => {
    if (!entry) return;
    Alert.alert("Delete entry", "This entry will be permanently removed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          deleteEntry(entry.id);
          router.back();
        },
      },
    ]);
  }, [deleteEntry, entry, router]);

  const onShare = useCallback(async () => {
    if (!entry) return;
    await exportEntriesAsText([entry]);
  }, [entry]);

  const onSeek = useCallback(
    async (x: number, width: number) => {
      if (durationMs <= 0) return;
      const ratio = Math.max(0, Math.min(1, x / width));
      await seekTo(durationMs * ratio);
    },
    [durationMs, seekTo],
  );

  const tabContent = useMemo(() => {
    if (!entry) return null;
    if (entry.isProcessing) {
      return (
        <View className="gap-3">
          <View className="h-4 w-3/4 rounded bg-[#242429]" />
          <View className="h-4 w-full rounded bg-[#242429]" />
          <View className="h-4 w-5/6 rounded bg-[#242429]" />
        </View>
      );
    }

    if (activeTab === "Transcript") {
      return (
        <Pressable onPress={() => showToast("Transcript copied")}> 
          <Text className="text-sm leading-6 text-zinc-100">{entry.transcript}</Text>
        </Pressable>
      );
    }
    if (activeTab === "Refined") {
      return <Text className="text-sm leading-6 text-zinc-100">{entry.refinedTranscript}</Text>;
    }
    if (activeTab === "Summary") {
      return (
        <View className="gap-2">
          {entry.summary.map((line) => (
            <View key={line} className="flex-row items-start">
              <Ionicons name="checkmark-circle" size={16} color="#4ADE80" style={{ marginTop: 2 }} />
              <Text className="ml-2 flex-1 text-sm leading-6 text-zinc-100">{line}</Text>
            </View>
          ))}
        </View>
      );
    }
    return (
      <View className="rounded-xl border border-[#27272A] bg-[#242429] p-3">
        <Badge label="🧠 Therapist mode" />
        <Text className="mt-2 text-sm leading-6 text-zinc-100">{entry.aiInsight}</Text>
      </View>
    );
  }, [activeTab, entry, showToast]);

  if (!entry) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0D0D0F] px-6">
        <Text className="text-zinc-300">Entry not found.</Text>
        <Button label="Back" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  const progress = durationMs > 0 ? (positionMs / durationMs) * 100 : 0;

  return (
    <ScrollView className="flex-1 bg-[#0D0D0F] px-5 pt-5" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="h-12 w-12 items-center justify-center rounded-xl bg-[#1A1A1F]">
          <Ionicons name="chevron-back" size={20} color="#F4F4F5" />
        </Pressable>
        <Text className="text-sm text-zinc-400">{formatEntryDate(entry.createdAt)}</Text>
      </View>

      <Card className="mt-5">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => {
              if (isPlaying) {
                void pause();
              } else {
                void play();
              }
            }}
            className="h-12 w-12 items-center justify-center rounded-full bg-[#7C6AF7]"
          >
            <Ionicons name={isPlaying ? "pause" : "play"} color="#fff" size={20} />
          </Pressable>
          <View className="ml-3 flex-1">
            <Pressable
              className="h-2 rounded-full bg-[#242429]"
              onLayout={(event) => setProgressWidth(event.nativeEvent.layout.width)}
              onPress={(evt) => {
                const { locationX } = evt.nativeEvent;
                void onSeek(locationX, progressWidth);
              }}
            >
              <View className="h-2 rounded-full bg-[#A78BFA]" style={{ width: `${progress}%` }} />
            </Pressable>
            <Text className="mt-2 text-xs text-zinc-400">{formatDuration(positionMs)} / {formatDuration(durationMs || entry.durationMs)}</Text>
          </View>
        </View>
      </Card>

      <View className="mt-5">
        <View className="flex-row">
          {tabs.map((tab, index) => (
            <Pressable key={tab} onPress={() => onTabPress(index, tab)} className="w-[92px] py-2">
              <Text className={`text-center text-sm ${activeTab === tab ? "text-violet-300" : "text-zinc-500"}`}>{tab}</Text>
            </Pressable>
          ))}
        </View>
        <Animated.View className="h-[2px] w-[92px] bg-[#7C6AF7]" style={underlineStyle} />
      </View>

      <Card className="mt-4">{tabContent}</Card>

      <View className="mt-4 flex-row flex-wrap gap-2">
        <Badge label={`Mood: ${entry.mood}`} />
        {entry.tags.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => {
              setFilter([tag]);
              router.replace("/(tabs)/journal");
            }}
          >
            <Badge label={`#${tag}`} />
          </Pressable>
        ))}
      </View>

      <View className="mt-5 flex-row gap-2">
        <Button label="Share" onPress={() => void onShare()} className="flex-1" />
        <Button label="Delete" variant="danger" onPress={onDelete} className="flex-1" />
        <Button label={entry.isFavorite ? "★" : "☆"} onPress={() => void onToggleFavorite()} className="w-16" />
      </View>
    </ScrollView>
  );
}
