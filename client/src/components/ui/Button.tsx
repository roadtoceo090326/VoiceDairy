import { Pressable, Text } from "react-native";

import { COLORS } from "@/src/lib/constants";

type ButtonVariant = "primary" | "secondary" | "danger" | "success";

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#7C6AF7] border-[#7C6AF7]",
  secondary: "bg-[#242429] border-[#27272A]",
  danger: "bg-[#3A1D1F] border-[#F87171]",
  success: "bg-[#4ADE80] border-[#4ADE80]",
};

export function Button({
  label,
  onPress,
  variant = "secondary",
  className = "",
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`min-h-12 items-center justify-center rounded-xl border px-4 ${variantClasses[variant]} ${disabled ? "opacity-60" : ""} ${className}`}
    >
      <Text
        className="text-sm font-semibold"
        style={{ color: variant === "success" ? COLORS.background : COLORS.text }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
