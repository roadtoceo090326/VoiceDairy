import { useCallback, useEffect, useRef, useState } from "react";
import { Audio, type AVPlaybackStatus } from "expo-av";

export function useAudioPlayer(uri: string) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pollStatus = useCallback(async () => {
    if (!soundRef.current) return;
    const status = (await soundRef.current.getStatusAsync()) as AVPlaybackStatus;
    if (!status.isLoaded) return;
    setPositionMs(status.positionMillis ?? 0);
    setDurationMs(status.durationMillis ?? 0);
    setIsPlaying(Boolean(status.isPlaying));
  }, []);

  const ensureLoaded = useCallback(async () => {
    if (soundRef.current) return;
    const { sound, status } = await Audio.Sound.createAsync({ uri });
    soundRef.current = sound;
    if (status.isLoaded) {
      setDurationMs(status.durationMillis ?? 0);
      setPositionMs(status.positionMillis ?? 0);
    }
  }, [uri]);

  const play = useCallback(async () => {
    try {
      setError(null);
      await ensureLoaded();
      if (!soundRef.current) return;
      await soundRef.current.playAsync();
      setIsPlaying(true);
      clearTimer();
      intervalRef.current = setInterval(() => {
        void pollStatus();
      }, 500);
    } catch {
      setError("Could not play audio.");
    }
  }, [clearTimer, ensureLoaded, pollStatus]);

  const pause = useCallback(async () => {
    if (!soundRef.current) return;
    await soundRef.current.pauseAsync();
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const seekTo = useCallback(async (ms: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(Math.max(0, ms));
    setPositionMs(Math.max(0, ms));
  }, []);

  const cleanup = useCallback(async () => {
    clearTimer();
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, [clearTimer]);

  useEffect(() => {
    return () => {
      void cleanup();
    };
  }, [cleanup]);

  return { isPlaying, positionMs, durationMs, error, play, pause, seekTo, cleanup };
}
