import { useCallback } from "react";
import * as Notifications from "expo-notifications";

import { safeParseTime } from "@/src/lib/utils";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const requestPermission = useCallback(async () => {
    const permission = await Notifications.requestPermissionsAsync();
    return permission.granted;
  }, []);

  const cancelReminder = useCallback(async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }, []);

  const scheduleReminder = useCallback(async (time: string) => {
    await cancelReminder();
    const granted = await requestPermission();
    if (!granted) return;

    const { hour, minute } = safeParseTime(time);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Voice Journal Reminder",
        body: "Take 2 minutes to check in with yourself.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }, [cancelReminder, requestPermission]);

  return { requestPermission, scheduleReminder, cancelReminder };
}
