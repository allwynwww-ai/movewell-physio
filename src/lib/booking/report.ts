/**
 * Date-range handling for the admin Report tab and its CSV export.
 * Pure functions on IST date keys ("YYYY-MM-DD"); safe on any server timezone.
 */
import type { AppointmentStatus } from "./appointments";
import { addDays, isValidDateKey, startOfWeek, todayKey } from "./time";

export const REPORT_PRESETS = [
  { id: "this-month", label: "This month" },
  { id: "last-month", label: "Last month" },
  { id: "last-7", label: "Last 7 days" },
  { id: "this-week", label: "This week (Mon–Sun)" },
] as const;

export type ReportPreset = (typeof REPORT_PRESETS)[number]["id"] | "custom";

/** Longest custom range we accept (inclusive days). */
export const MAX_REPORT_DAYS = 366;

export type ReportRange = { preset: ReportPreset; from: string; to: string; error?: string };

const REPORT_STATUSES: AppointmentStatus[] = ["completed", "no_show", "cancelled", "pending", "confirmed"];

export function parseReportStatus(v: string | null | undefined): AppointmentStatus | null {
  return REPORT_STATUSES.includes(v as AppointmentStatus) ? (v as AppointmentStatus) : null;
}

function monthStart(key: string) {
  return `${key.slice(0, 7)}-01`;
}
function monthEnd(key: string) {
  const [y, m] = key.split("-").map(Number);
  const next = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
  return addDays(next, -1);
}

/** Inclusive number of days between two valid date keys. */
export function daySpan(from: string, to: string): number {
  const ms = (k: string) => Date.UTC(Number(k.slice(0, 4)), Number(k.slice(5, 7)) - 1, Number(k.slice(8, 10)));
  return Math.round((ms(to) - ms(from)) / 86400000) + 1;
}

export function presetRange(preset: Exclude<ReportPreset, "custom">, today = todayKey()): { from: string; to: string } {
  switch (preset) {
    case "last-month": {
      const lastDay = addDays(monthStart(today), -1);
      return { from: monthStart(lastDay), to: lastDay };
    }
    case "last-7":
      return { from: addDays(today, -6), to: today };
    case "this-week": {
      const ws = startOfWeek(today);
      return { from: ws, to: addDays(ws, 6) };
    }
    default:
      return { from: monthStart(today), to: monthEnd(today) };
  }
}

/**
 * Resolve ?range=&from=&to= into an IST date range. Unknown presets fall back
 * to "This month"; a bad custom range falls back too, with an error to show.
 */
export function resolveReportRange(
  params: { range?: string | null; from?: string | null; to?: string | null },
  today = todayKey(),
): ReportRange {
  const range = params.range ?? "";
  const from = (params.from ?? "").trim();
  const to = (params.to ?? "").trim();
  const preset = REPORT_PRESETS.find((p) => p.id === range);
  if (preset) return { preset: preset.id, ...presetRange(preset.id, today) };

  const wantsCustom = range === "custom" || (!range && !!(from || to));
  if (!wantsCustom) return { preset: "this-month", ...presetRange("this-month", today) };

  const fallback = (error: string): ReportRange => ({ preset: "this-month", ...presetRange("this-month", today), error });
  if (!from || !to) return fallback("Pick both a start and an end date.");
  if (!isValidDateKey(from) || !isValidDateKey(to)) return fallback("That date range isn’t valid. Use real dates (YYYY-MM-DD).");
  if (from > to) return fallback("The start date must be on or before the end date.");
  if (daySpan(from, to) > MAX_REPORT_DAYS) return fallback("Please pick a range of one year or less.");
  return { preset: "custom", from, to };
}
