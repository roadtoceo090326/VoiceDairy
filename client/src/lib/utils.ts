import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function formatEntryDate(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return `Today • ${format(date, "h:mm a")}`;
  if (isYesterday(date)) return `Yesterday • ${format(date, "h:mm a")}`;
  return format(date, "EEE, MMM d • h:mm a");
}

export function relativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function safeParseTime(value: string): { hour: number; minute: number } {
  const [hh, mm] = value.split(":");
  const hour = Number(hh);
  const minute = Number(mm);
  return {
    hour: Number.isFinite(hour) ? hour : 20,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}
