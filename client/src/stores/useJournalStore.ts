import { create } from "zustand";

import { initMockData } from "@/src/lib/db";
import type { JournalEntry, Mood, SortBy, Tag } from "@/src/types";

type JournalState = {
  entries: JournalEntry[];
  tags: Tag[];
  selectedTagFilter: string[];
  moodFilter: Mood | null;
  searchQuery: string;
  sortBy: SortBy;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (id: string, patch: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setFilter: (tagIds: string[]) => void;
  setMoodFilter: (mood: Mood | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortBy) => void;
  clearAllEntries: () => void;
};

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  tags: [],
  selectedTagFilter: [],
  moodFilter: null,
  searchQuery: "",
  sortBy: "newest",
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    const { entries, tags } = await initMockData();
    set({ entries, tags, hydrated: true });
  },
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  updateEntry: (id, patch) =>
    set((state) => ({
      entries: state.entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    })),
  deleteEntry: (id) => set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) })),
  toggleFavorite: (id) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry,
      ),
    })),
  setFilter: (tagIds) => set({ selectedTagFilter: tagIds }),
  setMoodFilter: (mood) => set({ moodFilter: mood }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sortBy) => set({ sortBy }),
  clearAllEntries: () => set({ entries: [] }),
}));
