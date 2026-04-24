import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";

import { EntryList, MoodPicker, TagChip } from "@/src/components/journal";
import { Button, EmptyState, Sheet } from "@/src/components/ui";
import { DEFAULT_TAGS } from "@/src/lib/constants";
import { useJournalStore } from "@/src/stores";
import type { JournalEntry } from "@/src/types";

export default function JournalScreen() {
  const router = useRouter();
  const {
    entries,
    selectedTagFilter,
    moodFilter,
    searchQuery,
    sortBy,
    setFilter,
    setMoodFilter,
    setSearchQuery,
    setSortBy,
    deleteEntry,
    toggleFavorite,
  } = useJournalStore();

  const [queryInput, setQueryInput] = useState(searchQuery);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(queryInput);
    }, 300);

    return () => clearTimeout(timeout);
  }, [queryInput, setSearchQuery]);

  const filteredEntries = useMemo(() => {
    const filtered = entries.filter((entry) => {
      const q = searchQuery.trim().toLowerCase();
      const textMatch =
        !q ||
        entry.transcript.toLowerCase().includes(q) ||
        entry.refinedTranscript.toLowerCase().includes(q);

      const moodMatch = moodFilter ? entry.mood === moodFilter : true;
      const tagsMatch =
        selectedTagFilter.length === 0
          ? true
          : selectedTagFilter.every((tagId) => entry.tags.includes(tagId));

      return textMatch && moodMatch && tagsMatch;
    });

    if (sortBy === "oldest") {
      return [...filtered].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }
    if (sortBy === "longest") {
      return [...filtered].sort((a, b) => b.durationMs - a.durationMs);
    }

    return [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [entries, moodFilter, searchQuery, selectedTagFilter, sortBy]);

  const toggleTag = useCallback(
    (tagId: string) => {
      const exists = selectedTagFilter.includes(tagId);
      const next = exists
        ? selectedTagFilter.filter((id) => id !== tagId)
        : [...selectedTagFilter, tagId];
      setFilter(next);
    },
    [selectedTagFilter, setFilter],
  );

  const onDelete = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Alert.alert("Delete entry", "This action cannot be undone.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteEntry(id),
        },
      ]);
    },
    [deleteEntry],
  );

  const onActionFavorite = useCallback(async () => {
    if (!activeEntry) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(activeEntry.id);
    setActiveEntry(null);
  }, [activeEntry, toggleFavorite]);

  const onActionDelete = useCallback(async () => {
    if (!activeEntry) return;
    setActiveEntry(null);
    await onDelete(activeEntry.id);
  }, [activeEntry, onDelete]);

  return (
    <View className="flex-1 bg-[#0D0D0F] px-5 pt-4">
      <Text className="text-2xl font-bold text-zinc-100">Journal</Text>

      <View className="mt-4 rounded-2xl border border-[#27272A] bg-[#1A1A1F] px-4 py-3">
        <TextInput
          value={queryInput}
          onChangeText={setQueryInput}
          placeholder="Search transcript or refined notes"
          placeholderTextColor="#71717A"
          className="text-zinc-100"
        />
      </View>

      <View className="mt-3 flex-row gap-2">
        <Button label="Newest" onPress={() => setSortBy("newest")} className={sortBy === "newest" ? "border-violet-500" : ""} />
        <Button label="Oldest" onPress={() => setSortBy("oldest")} className={sortBy === "oldest" ? "border-violet-500" : ""} />
        <Button label="Longest" onPress={() => setSortBy("longest")} className={sortBy === "longest" ? "border-violet-500" : ""} />
      </View>

      <View className="mt-3">
        <MoodPicker selected={moodFilter} onSelect={setMoodFilter} />
      </View>

      <ScrollView horizontal className="mt-3" showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {DEFAULT_TAGS.slice(0, 5).map((tag) => (
            <TagChip
              key={tag.id}
              label={tag.label}
              active={selectedTagFilter.includes(tag.id)}
              onPress={() => toggleTag(tag.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View className="mt-4 flex-1">
        {filteredEntries.length === 0 ? (
          <EmptyState
            title="No entries match this filter"
            description="Try clearing filters or search text."
            actionLabel="Reset Filters"
            onAction={() => {
              setFilter([]);
              setMoodFilter(null);
              setQueryInput("");
            }}
          />
        ) : (
          <EntryList
            data={filteredEntries}
            onItemPress={(id) =>
              router.push({ pathname: "/entry/[id]", params: { id } } as Href)
            }
            onItemLongPress={(entry) => setActiveEntry(entry)}
            onDelete={(id) => void onDelete(id)}
          />
        )}
      </View>

      <Sheet visible={Boolean(activeEntry)} onClose={() => setActiveEntry(null)}>
        <Text className="text-lg font-semibold text-zinc-100">Entry Actions</Text>
        <View className="mt-4 gap-2">
          <Button
            label="Play"
            onPress={() => {
              if (!activeEntry) return;
              setActiveEntry(null);
              router.push({ pathname: "/entry/[id]", params: { id: activeEntry.id } } as Href);
            }}
          />
          <Button label="Edit Tags" onPress={() => setActiveEntry(null)} />
          <Button label="Toggle Favorite" onPress={() => void onActionFavorite()} />
          <Button label="Delete" variant="danger" onPress={() => void onActionDelete()} />
        </View>
      </Sheet>
    </View>
  );
}
