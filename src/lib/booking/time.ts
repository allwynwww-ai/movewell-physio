/**
 * Timezone + slot helpers for online booking. Pure functions — safe on the
 * server and in the browser. Everything is calculated in the clinic timezone
 * (siteConfig.onlineBooking.timezone, IST) no matter where the code runs.
 *
 * Conventions: a "date key" is "YYYY-MM-DD" and a "time" is "HH:MM", both as
 * wall-clock values in the clinic timezone.
 */
import { siteConfig, type DayOfWeek } from "@/site.config";

export const booking = siteConfig.onlineBooking;
export const TZ = booking.timezone;
export const TZ_LABEL = booking.timezoneLabel;

const WEEKDAYS: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function zonedParts(d: Date) {
  const map: Record<string, number> = {};
  for (const p of partsFormatter.formatToParts(d)) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour: map.hour === 24 ? 0 : map.hour,
    minute: map.minute,
    second: map.second,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Offset of the clinic timezone from UTC at a given instant, in minutes. */
function offsetMinutes(utcMs: number): number {
  const p = zonedParts(new Date(utcMs));
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / 60000);
}

/** Clinic wall-clock date + time → the real instant (UTC Date). */
export function zonedToUtc(dateKey: string, time: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let ts = guess - offsetMinutes(guess) * 60000;
  // Second pass handles DST edges for non-IST timezones.
  ts = guess - offsetMinutes(ts) * 60000;
  return new Date(ts);
}

/** "YYYY-MM-DD" in the clinic timezone for an instant. */
export function dateKeyOf(d: Date): string {
  const p = zonedParts(d);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** "HH:MM" in the clinic timezone for an instant. */
export function timeOf(d: Date): string {
  const p = zonedParts(d);
  return `${pad(p.hour)}:${pad(p.minute)}`;
}

export function todayKey(now: Date = new Date()): string {
  return dateKeyOf(now);
}

export function addDays(dateKey: string, n: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function weekdayOf(dateKey: string): DayOfWeek {
  const [y, m, d] = dateKey.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

/** Monday of the week containing dateKey. */
export function startOfWeek(dateKey: string): string {
  const idx = WEEKDAYS.indexOf(weekdayOf(dateKey)); // 0 = Sunday
  return addDays(dateKey, -((idx + 6) % 7));
}

export function isValidDateKey(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  return addDays(v, 0) === v;
}

export function isValidTime(v: string): boolean {
  const m = /^(\d{2}):(\d{2})$/.exec(v);
  return !!m && Number(m[1]) < 24 && Number(m[2]) < 60;
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fromMin = (n: number) => `${pad(Math.floor(n / 60))}:${pad(n % 60)}`;

/** Config holiday for a date, if any. */
export function holidayOn(dateKey: string) {
  return booking.holidays.find((h) => h.date === dateKey);
}

/**
 * Every slot start time the clinic offers on a date, from config only
 * (opening hours, breaks, holidays). Bookings and admin-blocked days are
 * removed separately on the server.
 */
export function configSlotsFor(dateKey: string): string[] {
  if (holidayOn(dateKey)) return [];
  const day = weekdayOf(dateKey);
  const ranges = booking.hours[day] ?? [];
  const len = booking.slotMinutes;
  const breaks = booking.breaks
    .filter((b) => !b.days || b.days.includes(day))
    .map((b) => [toMin(b.start), toMin(b.end)] as const);
  const out: string[] = [];
  for (const r of ranges) {
    for (let s = toMin(r.opens); s + len <= toMin(r.closes); s += len) {
      const e = s + len;
      if (breaks.some(([bs, be]) => s < be && e > bs)) {
        // Jump to the end of the break so later slots stay aligned to it.
        const blocking = breaks.find(([bs, be]) => s < be && e > bs)!;
        s = blocking[1] - len;
        continue;
      }
      out.push(fromMin(s));
    }
  }
  return out;
}

/* ── Display helpers (always IST, independent of the viewer's timezone) ── */

function keyToUtcNoon(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

/** e.g. "Mon, 2 Nov 2026" */
export function formatDateKey(dateKey: string, opts: Intl.DateTimeFormatOptions = {}): string {
  return keyToUtcNoon(dateKey).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
    ...opts,
  });
}

/** e.g. "9:30 am" */
export function formatSlotTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${suffix}`;
}

/** Instant → "Mon, 2 Nov 2026 · 9:30 am IST" */
export function formatInstant(d: Date): string {
  return `${formatDateKey(dateKeyOf(d))} · ${formatSlotTime(timeOf(d))} ${TZ_LABEL}`;
}
