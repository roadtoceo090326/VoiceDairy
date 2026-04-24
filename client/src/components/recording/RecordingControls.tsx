import { View } from "react-native";

import { Button } from "@/src/components/ui";

export interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onCancel: () => void;
  onStop: () => void;
  onPauseToggle: () => void;
}

export function RecordingControls({
  isRecording,
  isPaused,
  onCancel,
  onStop,
  onPauseToggle,
}: RecordingControlsProps) {
  return (
    <View className="mt-auto flex-row items-center justify-between gap-2">
      <Button label="Cancel" onPress={onCancel} className="w-24" />
      <Button label="Stop & Save" onPress={onStop} variant="success" className="w-40 min-h-14" disabled={!isRecording} />
      <Button label={isPaused ? "Resume" : "Pause"} onPress={onPauseToggle} className="w-24" disabled={!isRecording} />
    </View>
  );
}
