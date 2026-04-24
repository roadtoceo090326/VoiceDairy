import { Text, View } from "react-native";
import { Swipeable, RectButton } from "react-native-gesture-handler";

import { Card } from "@/src/components/ui";
import { formatDuration, relativeTime } from "@/src/lib/utils";
import type { JournalEntry } from "@/src/types";

export interface EntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
  onLongPress: () => void;
  onDelete: () => void;
}

export function EntryCard({ entry, onPress, onLongPress, onDelete }: EntryCardProps) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <RectButton style={{ justifyContent: "center", alignItems: "center", width: 88, backgroundColor: "#F87171", borderRadius: 14 }} onPress={onDelete}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Delete</Text>
        </RectButton>
      )}
    >
      <Card>
        <RectButton onPress={onPress} onLongPress={onLongPress}>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-zinc-400">{relativeTime(entry.createdAt)}</Text>
            <Text className="text-xs font-semibold text-violet-300">{formatDuration(entry.durationMs)}</Text>
          </View>
          <Text className="mt-2 text-sm text-zinc-100" numberOfLines={2}>
            {entry.refinedTranscript || entry.transcript}
          </Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {entry.tags.slice(0, 3).map((tag) => (
              <View key={`${entry.id}-${tag}`} className="rounded-full bg-[#242429] px-3 py-1">
                <Text className="text-xs text-zinc-300">#{tag}</Text>
              </View>
            ))}
          </View>
        </RectButton>
      </Card>
    </Swipeable>
  );
}
