import type { PropsWithChildren } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ds } from "@/constants/design-system";

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentClassName?: string;
}>;

export function Screen({ scroll = true, contentClassName = "", children }: ScreenProps) {
  if (!scroll) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: ds.colors.background }} edges={["top", "bottom", "left", "right"]}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: ds.colors.background }} edges={["top", "left", "right"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 28 }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
