import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

import { Button, Card, Sheet, useToast } from "@/src/components/ui";
import { useNotifications } from "@/src/hooks";
import { exportEntriesAsText } from "@/src/lib/db";
import { useJournalStore, useSettingsStore } from "@/src/stores";

const coachOptions = [
  { id: "therapist", label: "🧠 Therapist" },
  { id: "friend", label: "👥 Friend" },
  { id: "coach", label: "🚀 Life Coach" },
] as const;

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const mins = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

export default function SettingsScreen() {
  const { showToast } = useToast();
  const { scheduleReminder, cancelReminder } = useNotifications();

  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const toggleReminder = useSettingsStore((s) => s.toggleReminder);
  const setCoach = useSettingsStore((s) => s.setCoach);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const entries = useJournalStore((s) => s.entries);
  const clearAllEntries = useJournalStore((s) => s.clearAllEntries);

  const [pickerOpen, setPickerOpen] = useState(false);

  const [hour, minute] = useMemo(() => settings.reminderTime.split(":"), [settings.reminderTime]);

  const onToggleReminder = useCallback(
    async (enabled: boolean) => {
      toggleReminder(enabled);
      if (enabled) {
        await scheduleReminder(settings.reminderTime);
        showToast("Daily reminder scheduled");
      } else {
        await cancelReminder();
        showToast("Reminder cancelled");
      }
    },
    [cancelReminder, scheduleReminder, settings.reminderTime, showToast, toggleReminder],
  );

  const onSaveTime = useCallback(
    async (nextTime: string) => {
      updateSettings({ reminderTime: nextTime });
      if (settings.reminderEnabled) {
        await scheduleReminder(nextTime);
      }
      showToast(`Reminder time set to ${nextTime}`);
      setPickerOpen(false);
    },
    [scheduleReminder, settings.reminderEnabled, showToast, updateSettings],
  );

  const onExport = useCallback(async () => {
    await exportEntriesAsText(entries);
  }, [entries]);

  const onDeleteAll = useCallback(() => {
    Alert.alert("Delete all entries", "This will remove every journal entry.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Continue",
        style: "destructive",
        onPress: () => {
          Alert.alert("Final confirmation", "This action cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete all",
              style: "destructive",
              onPress: async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                clearAllEntries();
                showToast("All entries deleted");
              },
            },
          ]);
        },
      },
    ]);
  }, [clearAllEntries, showToast]);

  return (
    <ScrollView className="flex-1 bg-[#0D0D0F] px-5 pt-5" contentContainerStyle={{ paddingBottom: 34 }}>
      <Text className="text-2xl font-bold text-zinc-100">Settings</Text>

      <Card className="mt-5">
        <Text className="text-base font-semibold text-zinc-100">Daily Reminder</Text>
        <View className="mt-3 flex-row gap-2">
          <Button
            label={settings.reminderEnabled ? "Disable" : "Enable"}
            onPress={() => void onToggleReminder(!settings.reminderEnabled)}
            variant={settings.reminderEnabled ? "success" : "secondary"}
          />
          <Button label={`Time: ${settings.reminderTime}`} onPress={() => setPickerOpen(true)} />
        </View>
      </Card>

      <Card className="mt-4">
        <Text className="text-base font-semibold text-zinc-100">AI Coach</Text>
        <View className="mt-3 gap-2">
          {coachOptions.map((coach) => (
            <Button
              key={coach.id}
              label={coach.label}
              onPress={() => setCoach(coach.id)}
              className={settings.coachType === coach.id ? "border-violet-500" : ""}
            />
          ))}
        </View>
      </Card>

      <Card className="mt-4">
        <Text className="text-base font-semibold text-zinc-100">Theme</Text>
        <View className="mt-3 flex-row gap-2">
          <Button label="Dark" onPress={() => setTheme("dark")} className={settings.theme === "dark" ? "border-violet-500" : ""} />
          <Button label="Warm" onPress={() => setTheme("warm")} className={settings.theme === "warm" ? "border-violet-500" : ""} />
          <Button label="Pure" onPress={() => setTheme("pure")} className={settings.theme === "pure" ? "border-violet-500" : ""} />
        </View>
      </Card>

      <Card className="mt-4">
        <Text className="text-base font-semibold text-zinc-100">App Lock</Text>
        <Button
          label={settings.appLockEnabled ? "Disable PIN Lock" : "Enable PIN Lock"}
          onPress={() => updateSettings({ appLockEnabled: !settings.appLockEnabled })}
          className="mt-3"
        />
      </Card>

      <Card className="mt-4">
        <Button label="Export transcripts" onPress={() => void onExport()} />
      </Card>

      <Card className="mt-4">
        <Text className="text-base font-semibold text-red-400">Danger Zone</Text>
        <Button label="Delete all entries" variant="danger" onPress={onDeleteAll} className="mt-3" />
      </Card>

      <Sheet visible={pickerOpen} onClose={() => setPickerOpen(false)}>
        <Text className="text-lg font-semibold text-zinc-100">Select Reminder Time</Text>
        <View className="mt-4 flex-row gap-2">
          <ScrollView className="h-44 flex-1 rounded-xl bg-[#242429]">
            {hours.map((hh) => (
              <Text
                key={hh}
                onPress={() => void onSaveTime(`${hh}:${minute}`)}
                className={`px-4 py-3 text-center ${hour === hh ? "text-violet-300" : "text-zinc-300"}`}
              >
                {hh}
              </Text>
            ))}
          </ScrollView>
          <ScrollView className="h-44 flex-1 rounded-xl bg-[#242429]">
            {mins.map((mm) => (
              <Text
                key={mm}
                onPress={() => void onSaveTime(`${hour}:${mm}`)}
                className={`px-4 py-3 text-center ${minute === mm ? "text-violet-300" : "text-zinc-300"}`}
              >
                {mm}
              </Text>
            ))}
          </ScrollView>
        </View>
      </Sheet>
    </ScrollView>
  );
}
