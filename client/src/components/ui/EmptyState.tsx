import { Text, View } from "react-native";

import { Button } from "@/src/components/ui/Button";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="rounded-2xl border border-[#27272A] bg-[#1A1A1F] p-6">
      <Text className="text-lg font-semibold text-zinc-100">{title}</Text>
      <Text className="mt-2 text-sm leading-5 text-zinc-400">{description}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} className="mt-4" /> : null}
    </View>
  );
}
