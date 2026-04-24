import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState("");
  const opacity = useSharedValue(0);

  const showToast = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
    opacity.value = withTiming(1, { duration: 180 });
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 220 });
    }, 1600);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Animated.View pointerEvents="none" style={style} className="absolute bottom-10 left-6 right-6 rounded-xl bg-[#242429] border border-[#27272A] p-4">
        <Text className="text-center text-sm text-zinc-100">{message}</Text>
      </Animated.View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
