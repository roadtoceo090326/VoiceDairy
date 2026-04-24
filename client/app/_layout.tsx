import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
import "react-native-reanimated";
import "./global.css";

import { COLORS } from "@/src/lib/constants";
import { ToastProvider } from "@/src/components/ui";
import { useJournalStore, useSettingsStore } from "@/src/stores";

function AppBootstrap() {
  const hydrate = useJournalStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  return null;
}

export default function RootLayout() {
  const theme = useSettingsStore((s) => s.settings.theme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className={theme === "dark" ? "dark flex-1" : "flex-1"}>
        <ToastProvider>
          <AppBootstrap />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.background },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="recording" options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="entry/[id]" />
          </Stack>
          <StatusBar style="light" />
        </ToastProvider>
      </View>
    </GestureHandlerRootView>
  );
}
