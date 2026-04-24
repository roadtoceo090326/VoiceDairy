import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import type { PropsWithChildren } from "react";

export function ScreenContainer({ children }: PropsWithChildren) {
  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={["left", "right"]}>
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}
