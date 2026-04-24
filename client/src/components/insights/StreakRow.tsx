import { Text, View } from "react-native";

export interface StreakRowProps {
  hasEntryOnDay: boolean[];
}

export function StreakRow({ hasEntryOnDay }: StreakRowProps) {
  return (
    <View className="rounded-2xl border border-[#27272A] bg-[#1A1A1F] p-4">
      <Text className="text-base font-semibold text-zinc-100">Streak Tracker</Text>
      <View className="mt-3 flex-row justify-between">
        {hasEntryOnDay.map((filled, i) => (
          <View
            key={`streak-${i}`}
            className={`h-10 w-10 rounded-full border ${filled ? "border-emerald-400 bg-emerald-400/20" : "border-[#27272A] bg-[#242429]"}`}
          />
        ))}
      </View>
    </View>
  );
}
