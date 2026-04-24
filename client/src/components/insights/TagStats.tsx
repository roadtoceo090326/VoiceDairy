import { Text, View } from "react-native";

export interface TagStatsItem {
  tag: string;
  count: number;
}

export interface TagStatsProps {
  data: TagStatsItem[];
}

export function TagStats({ data }: TagStatsProps) {
  return (
    <View className="rounded-2xl border border-[#27272A] bg-[#1A1A1F] p-4">
      <Text className="text-base font-semibold text-zinc-100">Top Tags</Text>
      <View className="mt-3 gap-3">
        {data.map((item) => (
          <View key={item.tag}>
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-sm text-zinc-200">#{item.tag}</Text>
              <Text className="text-xs text-zinc-400">{item.count}</Text>
            </View>
            <View className="h-2 rounded-full bg-[#242429]">
              <View className="h-2 rounded-full bg-[#7C6AF7]" style={{ width: `${Math.min(100, item.count * 12)}%` }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
