"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SlotPicker, { useAvailability } from "@/components/booking/SlotPicker";
import { formatDateKey, formatSlotTime, TZ_LABEL } from "@/lib/booking/time";

function Rescheduler({ token, onDone }: { token: string; onDone: (msg: string) => void }) {
  const [reload, setReload] = useState(0);
  const availability = useAvailability("/api/booking/slots", reload);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!date || !time) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/booking/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reschedule", token, date, time }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    setBusy(false);
    if (res?.ok) return onDone(`Moved to ${formatDateKey(date, { weekday: "long" })}, ${formatSlotTime(time)} ${TZ_LABEL}.`);
    if (res?.status === 409) {
      setTime(null);
      setReload((n) => n + 1);
    }
    setError(json?.error || "Could not reschedule. Please try again or call the clinic.");
  }

  return (
    <div className="mt-6 border-t border-[var(--color-border)] pt-6">
      <h2 className="text-lg font-bold text-[var(--color-secondary)] mb-4">Pick a new time</h2>
      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      {availability.state === "loading" && <p className="text-sm text-[var(--color-text-muted)]">Loading free times…</p>}
      {availability.state === "error" && <p className="text-sm text-red-600">{availability.message}</p>}
      {availability.state === "ready" && (
        <SlotPicker
          days={availability.days}
          date={date}
          time={time}
          onChange={(d, t) => {
            setDate(d);
            setTime(t);
          }}
        />
      )}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          disabled={!date || !time || busy}
          onClick={save}
          className="premium-btn premium-btn-primary px-6 py-3 text-sm disabled:opacity-40 disabled:pointer-events-none"
        >
          {busy ? "Saving…" : "Confirm new time"}
        </button>
      </div>
    </div>
  );
}

/** Patient actions on the manage page: reschedule or cancel. */
export default function ManageBooking({ token }: { token: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "reschedule" | "confirm-cancel">("idle");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function cancel() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/booking/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel", token }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    setBusy(false);
    if (res?.ok) {
      setMessage("Your appointment has been cancelled.");
      setMode("idle");
      router.refresh();
      return;
    }
    setError(json?.error || "Could not cancel. Please try again or call the clinic.");
  }

  return (
    <div>
      {message && (
        <p role="status" className="mb-4 rounded-lg bg-[var(--color-light-teal)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => setMode(mode === "reschedule" ? "idle" : "reschedule")}
          className="premium-btn premium-btn-primary px-6 py-3 text-sm"
        >
          {mode === "reschedule" ? "Close" : "Reschedule"}
        </button>
        {mode === "confirm-cancel" ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 dark:border-red-500/30 px-4 py-2">
            <span className="text-sm text-[var(--color-text)]">Cancel this appointment?</span>
            <button type="button" onClick={cancel} disabled={busy} className="text-sm font-semibold text-red-600 hover:underline">
              {busy ? "Cancelling…" : "Yes, cancel"}
            </button>
            <button type="button" onClick={() => setMode("idle")} className="text-sm font-semibold text-[var(--color-text-muted)] hover:underline">
              Keep it
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMode("confirm-cancel")}
            className="premium-btn premium-btn-secondary px-6 py-3 text-sm"
          >
            Cancel appointment
          </button>
        )}
      </div>
      {mode === "reschedule" && (
        <Rescheduler
          token={token}
          onDone={(msg) => {
            setMessage(msg);
            setMode("idle");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
