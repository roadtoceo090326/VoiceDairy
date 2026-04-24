import { Pressable, Text } from "react-native";

export interface TagChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function TagChip({ label, active = false, onPress }: TagChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-11 items-center justify-center rounded-full border px-4 ${
        active ? "border-[#7C6AF7] bg-[#7C6AF7]/20" : "border-[#27272A] bg-[#1A1A1F]"
      }`}
    >
      <Text className={`text-sm ${active ? "text-[#A78BFA]" : "text-zinc-400"}`}>#{label}</Text>
    </Pressable>
  );
}
