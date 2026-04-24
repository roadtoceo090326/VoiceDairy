import { Pressable, Text, View } from "react-native";

import { formatDateLabel, formatDuration } from "@/lib/time";
import type { RecordingItem } from "@/types/recording";

type RecordingRowProps = {
  item: RecordingItem;
  isPlaying: boolean;
  onPlayPress: (item: RecordingItem) => void;
  onDeletePress: (id: string) => void;
};

export function RecordingRow({
  item,
  isPlaying,
  onPlayPress,
  onDeletePress,
}: RecordingRowProps) {
  return (
    <View className="mb-3 rounded-2xl border border-slate-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-900">{item.title}</Text>
        <Text className="text-xs uppercase tracking-wide text-slate-500">
          {formatDuration(item.durationMs)}
        </Text>
      </View>
      <Text className="mt-1 text-sm text-slate-500">{formatDateLabel(item.createdAt)}</Text>
      <Text className="mt-3 text-sm leading-5 text-slate-700">
        {item.transcript || "No transcript available."}
      </Text>
      <View className="mt-4 flex-row gap-2">
        <Pressable
          className={`rounded-xl px-4 py-2 ${isPlaying ? "bg-amber-500" : "bg-slate-900"}`}
          onPress={() => onPlayPress(item)}
        >
          <Text className="text-sm font-semibold text-white">
            {isPlaying ? "Stop" : "Play"}
          </Text>
        </Pressable>
        <Pressable
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2"
          onPress={() => onDeletePress(item.id)}
        >
          <Text className="text-sm font-semibold text-red-600">Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}
