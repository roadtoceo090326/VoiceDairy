import { useCallback, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

import { useRecordingStore } from "@/src/stores/useRecordingStore";

function normalizeMetering(metering: number | undefined): number {
  if (typeof metering !== "number") return 0.08;
  const normalized = (metering + 160) / 160;
  return Math.max(0, Math.min(1, normalized));
}

export function useAudioRecorder() {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    state,
    startRecording: startInStore,
    pauseRecording: pauseInStore,
    resumeRecording: resumeInStore,
    stopRecording: stopInStore,
    resetRecording,
    pushAmplitude,
  } = useRecordingStore();

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const permission = await Audio.requestPermissionsAsync();
    setPermissionGranted(permission.granted);
    if (!permission.granted) {
      setError("Microphone permission denied.");
    }
  }, []);

  const startPolling = useCallback(() => {
    clearPoll();
    pollRef.current = setInterval(async () => {
      if (!recordingRef.current) return;
      const status = await recordingRef.current.getStatusAsync();
      const metering =
        typeof (status as { metering?: number }).metering === "number"
          ? (status as { metering?: number }).metering
          : Math.random() * 0.6 - 0.4;
      pushAmplitude(normalizeMetering(metering));
    }, 100);
  }, [clearPoll, pushAmplitude]);

  const start = useCallback(async () => {
    try {
      setError(null);
      if (!permissionGranted) {
        await requestPermission();
      }
      if (!permissionGranted && !recordingRef.current) {
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      startInStore();
      startPolling();
    } catch {
      setError("Could not start recording.");
    }
  }, [permissionGranted, requestPermission, startInStore, startPolling]);

  const pause = useCallback(async () => {
    if (!recordingRef.current) return;
    try {
      await recordingRef.current.pauseAsync();
      pauseInStore();
    } catch {
      setError("Pause not supported on this device.");
    }
  }, [pauseInStore]);

  const resume = useCallback(async () => {
    if (!recordingRef.current) return;
    try {
      await recordingRef.current.startAsync();
      resumeInStore();
    } catch {
      setError("Could not resume recording.");
    }
  }, [resumeInStore]);

  const stop = useCallback(async () => {
    if (!recordingRef.current) return null;
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const status = await recordingRef.current.getStatusAsync();
      const uri = recordingRef.current.getURI();
      const durationMs = status.durationMillis ?? 0;
      stopInStore({ durationMs, audioUri: uri });
      clearPoll();
      return { uri, durationMs };
    } catch {
      setError("Could not stop recording.");
      return null;
    }
  }, [clearPoll, stopInStore]);

  const cancel = useCallback(async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
      }
    } catch {
      // ignore stop failures on cancel
    } finally {
      clearPoll();
      recordingRef.current = null;
      resetRecording();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    }
  }, [clearPoll, resetRecording]);

  useEffect(() => {
    void requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    return () => {
      clearPoll();
      if (recordingRef.current) {
        void recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, [clearPoll]);

  return { state, permissionGranted, error, start, pause, resume, stop, cancel };
}
