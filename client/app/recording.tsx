import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

import { RecordingControls, RecordingTimer, WaveformVisualizer } from "@/src/components/recording";
import { Badge, Card, useToast } from "@/src/components/ui";
import { useAudioRecorder, useWaveform } from "@/src/hooks";
import { PROMPTS } from "@/src/lib/constants";
import {
  mockDetectMood,
  mockDetectTags,
  mockInsight,
  mockRefine,
  mockSummarize,
  mockTranscribe,
} from "@/src/lib/mockAI";
import { useJournalStore, useRecordingStore, useSettingsStore } from "@/src/stores";
import type { JournalEntry } from "@/src/types";

function createId() {
  return `entry-${Date.now()}`;
}

export default function RecordingScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const addEntry = useJournalStore((s) => s.addEntry);
  const updateEntry = useJournalStore((s) => s.updateEntry);
  const coachType = useSettingsStore((s) => s.settings.coachType);

  const { state } = useRecordingStore();
  const { permissionGranted, error, start, pause, resume, stop, cancel } = useAudioRecorder();
  const amplitudes = useWaveform(state.amplitudes);

  const [displayMs, setDisplayMs] = useState(0);
  const [processing, setProcessing] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const prompt = useMemo(() => PROMPTS[new Date().getDate() % PROMPTS.length], []);
  const isRecording = state.status === "recording";
  const isPaused = state.status === "paused";

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    startedAtRef.current = Date.now() - displayMs;
    intervalRef.current = setInterval(() => {
      if (startedAtRef.current) {
        setDisplayMs(Date.now() - startedAtRef.current);
      }
    }, 250);
  }, [clearTimer, displayMs]);

  const onStart = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDisplayMs(0);
    startedAtRef.current = Date.now();
    startTimer();
    await start();
  }, [start, startTimer]);

  const onPauseToggle = useCallback(async () => {
    if (isPaused) {
      await resume();
      startTimer();
      return;
    }
    await pause();
    clearTimer();
  }, [clearTimer, isPaused, pause, resume, startTimer]);

  const processEntry = useCallback(
    async (audioUri: string, durationMs: number) => {
      setProcessing(true);
      const id = createId();
      const seedEntry: JournalEntry = {
        id,
        createdAt: new Date().toISOString(),
        audioUri,
        durationMs,
        transcript: "",
        refinedTranscript: "",
        summary: [],
        aiInsight: "",
        mood: "neutral",
        tags: [],
        isFavorite: false,
        isProcessing: true,
      };
      addEntry(seedEntry);

      try {
        const transcript = await mockTranscribe(audioUri);
        const [refined, summary, insight, mood, tags] = await Promise.all([
          mockRefine(transcript),
          mockSummarize(transcript),
          mockInsight(transcript, coachType),
          mockDetectMood(transcript),
          mockDetectTags(transcript),
        ]);

        updateEntry(id, {
          transcript,
          refinedTranscript: refined,
          summary,
          aiInsight: insight,
          mood,
          tags,
          isProcessing: false,
        });

        showToast("Entry saved successfully");
        router.replace({ pathname: "/entry/[id]", params: { id } });
      } catch {
        updateEntry(id, { isProcessing: false });
        showToast("Processing failed. Try again.");
      } finally {
        setProcessing(false);
      }
    },
    [addEntry, coachType, router, showToast, updateEntry],
  );

  const onStop = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearTimer();
    const result = await stop();
    if (!result?.uri) {
      showToast("Could not save recording");
      return;
    }
    await processEntry(result.uri, result.durationMs || displayMs);
  }, [clearTimer, displayMs, processEntry, showToast, stop]);

  const onCancel = useCallback(async () => {
    if (displayMs > 3000) {
      Alert.alert("Discard recording?", "This recording will be lost.", [
        { text: "Keep Recording", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            void cancel();
            clearTimer();
            router.back();
          },
        },
      ]);
      return;
    }
    await cancel();
    clearTimer();
    router.back();
  }, [cancel, clearTimer, displayMs, router]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return (
    <View className="flex-1 bg-[#0D0D0F] px-6 pb-8 pt-5">
      <Text className="text-center text-sm text-zinc-400">{prompt}</Text>

      <View className="mt-8 items-center">
        <View className="flex-row items-center">
          <View className="mr-2 h-2.5 w-2.5 rounded-full bg-red-400" />
          <Text className="text-sm text-zinc-100">Recording...</Text>
        </View>

        <View className="mt-8">
          <RecordingTimer durationMs={displayMs} />
        </View>

        <Card className="mt-8 w-full items-center">
          <WaveformVisualizer amplitudes={amplitudes} isRecording={isRecording || processing} />
        </Card>

        {!permissionGranted ? <Badge label="Microphone permission required" className="mt-3" /> : null}
        {error ? <Text className="mt-3 text-sm text-red-400">{error}</Text> : null}
      </View>

      {processing ? (
        <Card className="mt-auto items-center">
          <Ionicons name="sync" color="#A78BFA" size={24} />
          <Text className="mt-2 text-sm text-zinc-100">Transcribing your thoughts...</Text>
        </Card>
      ) : (
        <RecordingControls
          isRecording={isRecording || isPaused}
          isPaused={isPaused}
          onCancel={() => void onCancel()}
          onPauseToggle={() => void onPauseToggle()}
          onStop={() => void onStop()}
        />
      )}

      {state.status === "idle" && !processing ? (
        <View className="mt-4">
          <PressableProxy onPress={() => void onStart()} />
        </View>
      ) : null}
    </View>
  );
}

function PressableProxy({ onPress }: { onPress: () => void }) {
  return (
    <View className="items-center">
      <Card className="items-center px-8 py-3">
        <Text onPress={onPress} className="text-sm font-semibold text-violet-300">
          Start Recording
        </Text>
      </Card>
    </View>
  );
}
