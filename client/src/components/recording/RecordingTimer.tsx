import { useMemo } from "react";
import { Text } from "react-native";

import { formatDuration } from "@/src/lib/utils";

export interface RecordingTimerProps {
  durationMs: number;
}

export function RecordingTimer({ durationMs }: RecordingTimerProps) {
  const label = useMemo(() => formatDuration(durationMs), [durationMs]);
  return <Text className="text-5xl font-bold text-zinc-100">{label}</Text>;
}
