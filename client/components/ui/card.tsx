import type { PropsWithChildren } from "react";
import { View } from "react-native";

import { ds } from "@/constants/design-system";

type CardProps = PropsWithChildren<{
  className?: string;
  elevated?: boolean;
}>;

export function Card({ className = "", elevated = false, children }: CardProps) {
  return (
    <View
      className={`rounded-2xl border p-4 ${className}`}
      style={{
        borderColor: ds.colors.border,
        backgroundColor: elevated ? ds.colors.surfaceElevated : ds.colors.surface,
      }}
    >
      {children}
    </View>
  );
}
