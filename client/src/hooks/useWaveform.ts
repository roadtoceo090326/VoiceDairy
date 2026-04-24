import { useMemo } from "react";

export function useWaveform(amplitudes: number[]) {
  return useMemo(() => {
    const normalized = amplitudes.slice(-40);
    const missing = 40 - normalized.length;
    if (missing <= 0) return normalized;
    return [...Array.from({ length: missing }, () => 0.08), ...normalized];
  }, [amplitudes]);
}
