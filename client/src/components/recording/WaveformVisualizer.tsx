import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export interface WaveformVisualizerProps {
  amplitudes: number[];
  isRecording: boolean;
}

const MAX_HEIGHT = 60;

function WaveBar({ amplitude, index, isRecording }: { amplitude: number; index: number; isRecording: boolean }) {
  const level = useSharedValue(0.1);

  useEffect(() => {
    if (isRecording) {
      level.value = withSpring(Math.max(0.06, amplitude), { damping: 14, stiffness: 160 });
    } else {
      level.value = withRepeat(withTiming(0.12 + ((index % 5) * 0.02), { duration: 500 }), -1, true);
    }
  }, [amplitude, index, isRecording, level]);

  const style = useAnimatedStyle(() => ({
    height: Math.max(4, level.value * MAX_HEIGHT),
    opacity: index % 2 === 0 ? 0.95 : 0.55,
  }));

  return <Animated.View style={style} className="w-[5px] rounded-full bg-[#7C6AF7]" />;
}

export function WaveformVisualizer({ amplitudes, isRecording }: WaveformVisualizerProps) {
  const values = amplitudes.length >= 40 ? amplitudes.slice(-40) : [...Array.from({ length: 40 - amplitudes.length }, () => 0.08), ...amplitudes];

  return (
    <View className="h-20 w-full flex-row items-end justify-between">
      {values.map((value, index) => (
        <WaveBar key={`bar-${index}`} amplitude={value} index={index} isRecording={isRecording} />
      ))}
    </View>
  );
}
