import { create } from "zustand";

import { DEFAULT_SETTINGS } from "@/src/lib/constants";
import type { AppSettings, CoachType } from "@/src/types";

type SettingsStore = {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  toggleReminder: (enabled: boolean) => void;
  setCoach: (coachType: CoachType) => void;
  setTheme: (theme: AppSettings["theme"]) => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: DEFAULT_SETTINGS,
  updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
  toggleReminder: (enabled) =>
    set((state) => ({ settings: { ...state.settings, reminderEnabled: enabled } })),
  setCoach: (coachType) => set((state) => ({ settings: { ...state.settings, coachType } })),
  setTheme: (theme) => set((state) => ({ settings: { ...state.settings, theme } })),
}));
