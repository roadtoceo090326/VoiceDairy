import type { PropsWithChildren } from "react";
import { View } from "react-native";

export interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <View className={`rounded-2xl border border-[#27272A] bg-[#1A1A1F] p-4 ${className}`}>{children}</View>;
}
