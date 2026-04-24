import { Pressable, Text } from "react-native";

import { ds } from "@/constants/design-system";

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  className?: string;
  textClassName?: string;
  minWidthClassName?: string;
};

export function AppButton({
  label,
  onPress,
  variant = "secondary",
  className = "",
  textClassName = "",
  minWidthClassName = "",
}: AppButtonProps) {
  const styleByVariant = {
    primary: { backgroundColor: ds.colors.primary, borderColor: ds.colors.primary, textColor: ds.colors.textPrimary },
    secondary: { backgroundColor: ds.colors.surfaceElevated, borderColor: ds.colors.border, textColor: ds.colors.textPrimary },
    success: { backgroundColor: ds.colors.success, borderColor: ds.colors.success, textColor: ds.colors.background },
    danger: { backgroundColor: "rgba(248, 113, 113, 0.14)", borderColor: "rgba(248, 113, 113, 0.4)", textColor: ds.colors.danger },
    ghost: { backgroundColor: "transparent", borderColor: ds.colors.border, textColor: ds.colors.textSecondary },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      className={`min-h-12 items-center justify-center rounded-xl border px-4 ${minWidthClassName} ${className}`}
      style={{
        backgroundColor: styleByVariant.backgroundColor,
        borderColor: styleByVariant.borderColor,
      }}
    >
      <Text className={`text-sm font-semibold ${textClassName}`} style={{ color: styleByVariant.textColor }}>
        {label}
      </Text>
    </Pressable>
  );
}
