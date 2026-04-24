import { ScrollView, View } from "react-native";

import type { Mood } from "@/src/types";
import { TagChip } from "@/src/components/journal/TagChip";

const moods: Mood[] = ["happy", "sad", "anxious", "grateful", "angry", "neutral", "tired"];

export interface MoodPickerProps {
  selected: Mood | null;
  onSelect: (mood: Mood | null) => void;
}

export function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2">
        <TagChip label="all moods" active={selected === null} onPress={() => onSelect(null)} />
        {moods.map((mood) => (
          <TagChip key={mood} label={mood} active={selected === mood} onPress={() => onSelect(mood)} />
        ))}
      </View>
    </ScrollView>
  );
}
