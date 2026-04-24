import { Pressable, Text } from "react-native";

import { ds } from "@/constants/design-system";

type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  className?: string;
};

export function Chip({ label, active = false, onPress, className = "" }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-12 rounded-full border px-4 items-center justify-center ${className}`}
      style={{
        borderColor: active ? ds.colors.primary : ds.colors.border,
        backgroundColor: active ? "rgba(124, 106, 247, 0.18)" : ds.colors.surface,
      }}
    >
      <Text style={{ color: active ? ds.colors.secondary : ds.colors.textSecondary }}>{label}</Text>
    </Pressable>
  );
}
