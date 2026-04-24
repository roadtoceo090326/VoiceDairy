import { Text, View } from "react-native";

import { ds } from "@/constants/design-system";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <View className={className}>
      <Text className="text-2xl font-bold" style={{ color: ds.colors.textPrimary }}>
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-sm" style={{ color: ds.colors.textSecondary }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
