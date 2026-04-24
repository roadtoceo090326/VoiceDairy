import { Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { COLORS } from "@/src/lib/constants";

export interface MoodChartDatum {
  day: string;
  value: number;
  color: string;
}

export interface MoodChartProps {
  data: MoodChartDatum[];
}

export function MoodChart({ data }: MoodChartProps) {
  return (
    <View className="rounded-2xl border border-[#27272A] bg-[#1A1A1F] p-4">
      <Text className="text-base font-semibold text-zinc-100">Mood (last 7 days)</Text>
      <View className="mt-4 flex-row items-end justify-between">
        {data.map((item, index) => (
          <View key={item.day} className="items-center">
            <Animated.View
              entering={FadeInUp.delay(index * 70).duration(280)}
              className="w-6 rounded-full"
              style={{ height: Math.max(8, item.value), backgroundColor: item.color }}
            />
            <Text className="mt-2 text-xs text-zinc-400">{item.day}</Text>
          </View>
        ))}
      </View>
      <Text className="mt-3 text-xs text-zinc-500">Color map follows mood category intensity.</Text>
      <View className="mt-3 h-[1px]" style={{ backgroundColor: COLORS.border }} />
    </View>
  );
}
