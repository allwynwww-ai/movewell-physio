"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, formatDateKey, formatSlotTime, TZ_LABEL, weekdayOf } from "@/lib/booking/time";

export type DayAvailability = { date: string; slots: string[]; closed?: string };

type Availability = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; days: DayAvailability[] };

/** Loads free slots from the server (public endpoint by default; /admin/slots for the clinic). */
export function useAvailability(endpoint = "/api/booking/slots", reloadKey = 0): Availability {
  const [data, setData] = useState<Availability>({ state: "loading" });
  useEffect(() => {
    let cancelled = false;
    fetch(endpoint, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.days) throw new Error(json?.error || "Online booking is not available right now.");
        if (!cancelled) setData({ state: "ready", days: json.days });
      })
      .catch((err: Error) => {
        if (!cancelled) setData({ state: "error", message: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, reloadKey]);
  return data;
}

const WEEK_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function monthKey(date: string) {
  return date.slice(0, 7);
}

function monthLabel(mk: string) {
  return formatDateKey(`${mk}-01`, { weekday: undefined, day: undefined, month: "long", year: "numeric" });
}

/** Month calendar of bookable days + the free times for the chosen day (all times IST). */
export default function SlotPicker({
  days,
  date,
  time,
  onChange,
  compact = false,
}: {
  days: DayAvailability[];
  date: string | null;
  time: string | null;
  onChange: (date: string | null, time: string | null) => void;
  compact?: boolean;
}) {
  const byDate = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);
  const months = useMemo(() => Array.from(new Set(days.map((d) => monthKey(d.date)))), [days]);
  const firstAvailable = days.find((d) => d.slots.length)?.date ?? null;
  const [month, setMonth] = useState(() => monthKey(date ?? firstAvailable ?? days[0]?.date ?? ""));
  const monthIdx = Math.max(0, months.indexOf(month));

  // Cells for the visible month, Monday-first.
  const cells = useMemo(() => {
    const first = `${month}-01`;
    const lead = ORDER.indexOf(weekdayOf(first));
    const out: (string | null)[] = Array(lead).fill(null);
    for (let d = first; monthKey(d) === month; d = addDays(d, 1)) out.push(d);
    while (out.length % 7) out.push(null);
    return out;
  }, [month]);

  const selectedDay = date ? byDate.get(date) : undefined;
  const groups = useMemo(() => {
    const slots = selectedDay?.slots ?? [];
    return [
      { label: "Morning", items: slots.filter((t) => t < "12:00") },
      { label: "Afternoon", items: slots.filter((t) => t >= "12:00" && t < "17:00") },
      { label: "Evening", items: slots.filter((t) => t >= "17:00") },
    ].filter((g) => g.items.length);
  }, [selectedDay]);

  if (!firstAvailable) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">
        There are no free online slots in the next few weeks. Please call or message the clinic.
      </p>
    );
  }

  return (
    <div className={`grid gap-6 ${compact ? "" : "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"}`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setMonth(months[monthIdx - 1])}
            disabled={monthIdx === 0}
            aria-label="Previous month"
            className="w-9 h-9 rounded-full border border-[var(--color-border)] text-[var(--color-secondary)] disabled:opacity-30 hover:bg-[var(--color-bg)] transition-colors"
          >
            ‹
          </button>
          <p className="font-semibold text-[var(--color-secondary)]" aria-live="polite">
            {monthLabel(month)}
          </p>
          <button
            type="button"
            onClick={() => setMonth(months[monthIdx + 1])}
            disabled={monthIdx >= months.length - 1}
            aria-label="Next month"
            className="w-9 h-9 rounded-full border border-[var(--color-border)] text-[var(--color-secondary)] disabled:opacity-30 hover:bg-[var(--color-bg)] transition-colors"
          >
            ›
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
          {WEEK_HEADERS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Choose a date">
          {cells.map((d, i) => {
            if (!d) return <div key={`e${i}`} />;
            const info = byDate.get(d);
            const free = info?.slots.length ?? 0;
            const selected = d === date;
            const disabled = !free;
            const title = !info
              ? "Not bookable online"
              : info.closed
                ? `Closed – ${info.closed}`
                : free
                  ? `${free} free slot${free === 1 ? "" : "s"}`
                  : "Fully booked";
            return (
              <button
                key={d}
                type="button"
                disabled={disabled}
                title={title}
                aria-label={`${formatDateKey(d)} – ${title}`}
                aria-pressed={selected}
                onClick={() => onChange(d, null)}
                className={`relative aspect-square rounded-xl text-sm font-semibold transition-all ${
                  selected
                    ? "bg-[var(--color-primary)] text-white shadow-md dark:text-[#0B1220]"
                    : disabled
                      ? "text-[var(--color-text-muted)]/40 cursor-not-allowed"
                      : "bg-[var(--color-light-teal)] text-[var(--color-primary)] hover:ring-2 hover:ring-[var(--color-primary)]/40"
                }`}
              >
                {Number(d.slice(8))}
                {!disabled && !selected && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">
          Highlighted days have free slots. All times are {TZ_LABEL} (India Standard Time).
        </p>
      </div>

      <div>
        {!date || !selectedDay ? (
          <div className="h-full min-h-40 rounded-2xl border border-dashed border-[var(--color-border)] flex items-center justify-center p-6 text-center text-sm text-[var(--color-text-muted)]">
            Pick a highlighted date to see free times.
          </div>
        ) : (
          <div>
            <p className="font-semibold text-[var(--color-secondary)] mb-3">{formatDateKey(date, { weekday: "long" })}</p>
            <div className="space-y-4">
              {groups.map((g) => (
                <div key={g.label}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">{g.label}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {g.items.map((t) => (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={t === time}
                        onClick={() => onChange(date, t)}
                        className={`px-1 py-2.5 rounded-lg border text-sm font-semibold whitespace-nowrap transition-colors ${
                          t === time
                            ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white dark:text-[#0B1220]"
                            : "border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                        }`}
                      >
                        {formatSlotTime(t)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
