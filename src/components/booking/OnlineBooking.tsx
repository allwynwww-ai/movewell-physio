"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import BookingForm from "@/components/BookingForm";
import SlotPicker, { useAvailability } from "@/components/booking/SlotPicker";
import { booking, formatDateKey, formatSlotTime, TZ_LABEL } from "@/lib/booking/time";
import { CLINIC_PHONE_DISPLAY, formatINR, siteConfig, telLink } from "@/lib/site";

type Confirmation = {
  booking: { ref: string; status: string; serviceName: string; date: string; time: string; name: string; email: string };
  manageUrl: string;
  icsUrl: string;
};

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm bg-[var(--color-surface)] text-[var(--color-text)]";
const cardClass = "bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm";

const STEPS = ["Service", "Date & time", "Your details"];

function Steps({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2 mb-6 text-xs font-semibold" aria-label="Booking steps">
      {STEPS.map((label, i) => (
        <li key={label} className="flex items-center gap-2" aria-current={i === step ? "step" : undefined}>
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              i < step
                ? "bg-[var(--color-primary)] text-white dark:text-[#0B1220]"
                : i === step
                  ? "bg-[var(--color-light-teal)] text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]"
                  : "bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
            }`}
          >
            {i < step ? "✓" : i + 1}
          </span>
          <span className={`hidden sm:inline ${i === step ? "text-[var(--color-secondary)]" : "text-[var(--color-text-muted)]"}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && <span className="w-6 sm:w-10 h-px bg-[var(--color-border)]" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}

/** Pro: live booking calendar with instant confirmation. Falls back to the request form if the server is unavailable. */
export default function OnlineBooking() {
  const [reload, setReload] = useState(0);
  const availability = useAvailability("/api/booking/slots", reload);
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Confirmation | null>(null);

  const service = siteConfig.services.find((s) => s.id === serviceId);

  if (availability.state === "error") {
    return (
      <div className="space-y-6">
        <div role="status" className="rounded-2xl border border-amber-300/60 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 p-5 text-sm text-amber-900 dark:text-amber-200">
          <strong className="font-semibold">Online booking is temporarily unavailable.</strong> Please send a request below and the
          clinic will confirm a time with you.
        </div>
        <BookingForm />
      </div>
    );
  }

  if (done) {
    const b = done.booking;
    const pending = b.status === "pending";
    return (
      <div role="status" aria-live="polite" className={`${cardClass} text-center`} data-testid="booking-confirmation">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-light-teal)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] mb-2 tracking-tight">
          {pending ? "Booking received" : "You're booked!"}
        </h2>
        <p className="text-[var(--color-text-muted)] mb-6">
          {pending
            ? "The clinic will confirm your appointment shortly."
            : `Thanks ${b.name.split(" ")[0]}, your appointment is confirmed.`}
        </p>
        <dl className="mx-auto max-w-sm text-left rounded-2xl border border-[var(--color-border)] divide-y divide-[var(--color-border)] mb-6">
          {[
            ["When", `${formatDateKey(b.date, { weekday: "long" })}, ${formatSlotTime(b.time)} ${TZ_LABEL}`],
            ["Service", b.serviceName],
            ["Reference", b.ref],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
              <dt className="text-[var(--color-text-muted)]">{k}</dt>
              <dd className="font-semibold text-[var(--color-secondary)] text-right">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={done.icsUrl} className="premium-btn premium-btn-primary w-full sm:w-auto px-6 py-3 text-sm" download>
            Add to calendar (.ics)
          </a>
          <a href={done.manageUrl} className="premium-btn premium-btn-secondary w-full sm:w-auto px-6 py-3 text-sm">
            Manage booking
          </a>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-6 max-w-md mx-auto">
          Save this page or the manage link to cancel or reschedule online up to {booking.cancellationCutoffHours} hours
          before your appointment. A confirmation email is on its way to {b.email} if email is set up for this clinic.
        </p>
        <Link href="/" className="inline-block mt-6 text-sm font-semibold text-[var(--color-primary)] hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const payload = {
      serviceId,
      date,
      time,
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      note: get("note"),
      consent,
      website: get("website"),
    };

    const errs: Record<string, string> = {};
    if (payload.name.length < 2) errs.name = "Please enter your full name.";
    if (payload.phone.replace(/\D/g, "").length < 10) errs.phone = "Enter a valid phone number (at least 10 digits).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errs.email = "Enter a valid email address.";
    if (!consent) errs.consent = "Please tick the consent box so the clinic can store your booking.";
    setFieldErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setDone(json as Confirmation);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (res.status === 409) {
        // Slot was taken a moment ago: refresh times and send the patient back to pick again.
        setTime(null);
        setStep(1);
        setReload((n) => n + 1);
      }
      if (json?.fields) setFieldErrors(json.fields);
      setError(json?.error || "Something went wrong. Please try again or call the clinic.");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const summary = service && date && time && (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--color-light-teal)] px-4 py-3 mb-6 text-sm">
      <div>
        <p className="font-semibold text-[var(--color-secondary)]">{service.name}</p>
        <p className="text-[var(--color-text-muted)]">
          {formatDateKey(date, { weekday: "long" })} · {formatSlotTime(time)} {TZ_LABEL}
        </p>
      </div>
      <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
        Change
      </button>
    </div>
  );

  return (
    <div className={cardClass} data-testid="online-booking">
      <Steps step={step} />

      {error && (
        <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {step === 0 && (
        <div>
          <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-4 tracking-tight">What would you like to book?</h2>
          <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Service">
            {siteConfig.services.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={serviceId === s.id}
                onClick={() => {
                  setServiceId(s.id);
                  setStep(1);
                }}
                className={`text-left rounded-xl border p-4 transition-all hover:border-[var(--color-primary)] ${
                  serviceId === s.id
                    ? "border-[var(--color-primary)] bg-[var(--color-light-teal)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]"
                }`}
              >
                <p className="font-semibold text-[var(--color-secondary)]">{s.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {s.duration}
                  {typeof s.priceINR === "number" && ` · ${formatINR(s.priceINR)}`}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <h2 className="text-xl font-bold text-[var(--color-secondary)] tracking-tight">Pick a date and time</h2>
            <button type="button" onClick={() => setStep(0)} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              {service?.name} · Change
            </button>
          </div>
          {availability.state === "loading" ? (
            <div className="py-16 text-center text-sm text-[var(--color-text-muted)]" aria-busy="true">
              Loading free times…
            </div>
          ) : (
            <SlotPicker
              days={availability.days}
              date={date}
              time={time}
              onChange={(d, t) => {
                setDate(d);
                setTime(t);
                setError("");
              }}
            />
          )}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              disabled={!date || !time}
              onClick={() => setStep(2)}
              className="premium-btn premium-btn-primary px-6 py-3 text-sm disabled:opacity-40 disabled:pointer-events-none"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form
          onSubmit={handleSubmit}
          noValidate
          onChange={(e) => {
            const name = (e.target as unknown as HTMLInputElement).name;
            if (fieldErrors[name]) {
              setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
              });
            }
          }}
        >
          <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-4 tracking-tight">Your details</h2>
          {summary}
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div className="sm:col-span-2">
              <label htmlFor="bk-name" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                Full name *
              </label>
              <input id="bk-name" name="name" autoComplete="name" className={inputClass} placeholder="Your full name" />
              {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="bk-phone" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                Phone *
              </label>
              <input id="bk-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputClass} placeholder="+91 98765 43210" />
              {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
            </div>
            <div>
              <label htmlFor="bk-email" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                Email *
              </label>
              <input id="bk-email" name="email" type="email" autoComplete="email" className={inputClass} placeholder="you@example.com" />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="bk-note" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                Note for the clinic <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
              </label>
              <textarea id="bk-note" name="note" rows={3} maxLength={500} className={inputClass} placeholder="Anything the physio should know before your visit" />
              {fieldErrors.note && <p className="mt-1 text-xs text-red-600">{fieldErrors.note}</p>}
            </div>
          </div>

          {/* Honeypot – hidden from people, bots fill it in. */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label htmlFor="bk-website">Website</label>
            <input id="bk-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <label className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] mb-2 cursor-pointer">
            <input
              type="checkbox"
              name="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[var(--color-primary)]"
            />
            <span>
              I consent to {siteConfig.brand.name} storing these details to manage my appointment and contacting me about it, as
              described in the{" "}
              <Link href="/privacy" className="text-[var(--color-primary)] font-semibold hover:underline">
                Privacy Policy
              </Link>
              . *
            </span>
          </label>
          {fieldErrors.consent && <p className="mb-2 text-xs text-red-600">{fieldErrors.consent}</p>}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
            <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="premium-btn premium-btn-primary px-8 py-3 text-sm disabled:opacity-60"
            >
              {loading ? "Booking…" : "Confirm booking"}
            </button>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-4">
            Can&apos;t find a time? Call{" "}
            <a href={telLink} className="font-semibold text-[var(--color-primary)] hover:underline">
              {CLINIC_PHONE_DISPLAY}
            </a>
            .
          </p>
        </form>
      )}
    </div>
  );
}
