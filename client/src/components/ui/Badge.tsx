import { Text, View } from "react-native";

export interface BadgeProps {
  label: string;
  className?: string;
}

export function Badge({ label, className = "" }: BadgeProps) {
  return (
    <View className={`rounded-full border border-[#27272A] bg-[#242429] px-3 py-1 ${className}`}>
      <Text className="text-xs text-zinc-300">{label}</Text>
    </View>
  );
}
