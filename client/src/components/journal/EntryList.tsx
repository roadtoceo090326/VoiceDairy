import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";

import { EntryCard } from "@/src/components/journal/EntryCard";
import type { JournalEntry } from "@/src/types";

export interface EntryListProps {
  data: JournalEntry[];
  onItemPress: (id: string) => void;
  onItemLongPress: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export function EntryList({ data, onItemPress, onItemLongPress, onDelete }: EntryListProps) {
  return (
    <FlashList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 120 }}
      overScrollMode="never"
      bounces
      renderItem={({ item }) => (
        <View className="mb-3">
          <EntryCard
            entry={item}
            onPress={() => onItemPress(item.id)}
            onLongPress={() => onItemLongPress(item)}
            onDelete={() => onDelete(item.id)}
          />
        </View>
      )}
    />
  );
}
