"use client";

import { useState } from "react";
import SlotPicker, { useAvailability } from "@/components/booking/SlotPicker";
import { rescheduleAction } from "@/app/admin/actions";

function Picker({ id, back }: { id: string; back: string }) {
  const availability = useAvailability("/admin/slots");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  return (
    <form action={rescheduleAction} className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="back" value={back} />
      <input type="hidden" name="date" value={date ?? ""} />
      <input type="hidden" name="time" value={time ?? ""} />
      {availability.state === "loading" && <p className="text-sm text-[var(--color-text-muted)]">Loading free slots…</p>}
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
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={!date || !time}
          className="premium-btn premium-btn-primary px-5 py-2 text-sm disabled:opacity-40 disabled:pointer-events-none"
        >
          Move appointment
        </button>
      </div>
    </form>
  );
}

/** Inline reschedule panel for one appointment in the admin list. */
export default function AdminReschedule({ id, back }: { id: string; back: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
      >
        {open ? "Close" : "Reschedule"}
      </button>
      {open && <Picker id={id} back={back} />}
    </div>
  );
}
