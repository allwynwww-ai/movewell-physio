"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { BOOKING_DEMO_MODE, CLINIC_PHONE_DISPLAY, siteConfig, telLink, whatsappLink } from "@/lib/site";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateDisplay(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mmm = MONTHS[d.getMonth()];
  const yyyy = d.getFullYear();
  return `${dd}-${mmm}-${yyyy}`;
}

function isValidDisplayDate(value: string) {
  const m = value.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);
  if (!m) return false;
  const day = parseInt(m[1], 10);
  const mon = MONTHS.findIndex((x) => x.toLowerCase() === m[2].toLowerCase());
  const year = parseInt(m[3], 10);
  if (mon < 0) return false;
  const dt = new Date(year, mon, day);
  return dt.getFullYear() === year && dt.getMonth() === mon && dt.getDate() === day;
}

const serviceOptions = [...siteConfig.services.map((s) => s.name), "General Assessment", "Other"];

const SUCCESS_MESSAGE = "Request received – the clinic will contact you to confirm your appointment.";

function buildWhatsAppMessage(form: HTMLFormElement | null): string {
  const base = siteConfig.contact.whatsappMessages.book;
  if (!form) return base;
  const data = new FormData(form);
  const get = (k: string) => String(data.get(k) ?? "").trim();
  const name = [get("firstName"), get("lastName")].filter(Boolean).join(" ");
  const parts = [
    name && `Name: ${name}`,
    get("phone") && `Phone: ${get("phone")}`,
    get("service") && `Reason: ${get("service")}`,
    get("preferredDate") && `Preferred date: ${get("preferredDate")}`,
    get("message") && `Notes: ${get("message")}`,
  ].filter(Boolean);
  return parts.length ? `${base}\n\n${parts.join("\n")}` : base;
}

export default function BookingForm() {
  const todayDisplay = useMemo(() => formatDateDisplay(new Date()), []);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [preferredDate, setPreferredDate] = useState(todayDisplay);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lastWhatsApp, setLastWhatsApp] = useState(siteConfig.contact.whatsappMessages.followup);

  function openWhatsApp() {
    const url = whatsappLink(buildWhatsAppMessage(formRef.current));
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, string> = {};
    data.forEach((value, key) => {
      payload[key] = String(value);
    });

    const nextErrors: Record<string, string> = {};
    if (!payload.firstName?.trim()) nextErrors.firstName = "First name is required.";
    if (!payload.lastName?.trim()) nextErrors.lastName = "Last name is required.";
    if (!payload.email?.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (!phoneDigits) {
      nextErrors.phone = "Phone number is required.";
    } else if (phoneDigits.length < 10) {
      nextErrors.phone = "Enter a valid phone number (at least 10 digits).";
    }

    if (!preferredDate.trim()) {
      nextErrors.preferredDate = "Preferred date is required.";
    } else if (!isValidDisplayDate(preferredDate.trim())) {
      nextErrors.preferredDate = "Use format dd-mmm-yyyy (e.g. 23-Aug-2026).";
    }

    if (!payload.service) {
      nextErrors.service = "Please select a reason for visit.";
    }

    if (!consent) {
      nextErrors.consent = "Please tick the consent box so the clinic can contact you.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`);
      first?.focus();
      return;
    }

    // Bots fill the hidden honeypot – silently pretend success.
    if (payload._honey) {
      setSubmitted(true);
      return;
    }

    setLastWhatsApp(buildWhatsAppMessage(form));
    setLoading(true);
    payload.phone = phoneDigits;
    payload.preferredDate = preferredDate.trim();
    payload.consent = `Yes – consented via website form on ${new Date().toISOString()}`;

    try {
      if (BOOKING_DEMO_MODE) {
        // Demo mode: placeholder address configured, so nothing is sent.
        await new Promise((r) => setTimeout(r, 600));
      } else {
        const res = await fetch(
          `https://formsubmit.co/ajax/${encodeURIComponent(siteConfig.booking.formSubmitEmail)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              ...payload,
              _subject: `${siteConfig.booking.emailSubject} – ${siteConfig.brand.name}`,
              _template: "table",
              _replyto: payload.email,
            }),
          },
        );
        const json = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
        if (!res.ok || (json && String(json.success) === "false")) throw new Error("Submission failed");
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again, call the clinic, or send your request on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 md:p-10 shadow-sm text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-light-teal)] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[var(--color-primary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] mb-3 tracking-tight">
          Request received
        </h2>
        <p className="text-[var(--color-text-muted)] mb-2">{SUCCESS_MESSAGE}</p>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">
          Your appointment is not confirmed yet. Prefer WhatsApp? Send your request on WhatsApp for a quicker reply.
          {BOOKING_DEMO_MODE && " (Demo site: this request was not sent anywhere.)"}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappLink(lastWhatsApp)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-sm transition-colors"
          >
            Send your request on WhatsApp
          </a>
          <a
            href={telLink}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-secondary)] font-semibold text-sm hover:bg-[var(--color-bg)] transition-colors"
          >
            Call {CLINIC_PHONE_DISPLAY}
          </a>
        </div>
        <Link href="/" className="inline-block mt-8 text-sm font-semibold text-[var(--color-primary)] hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm"
    >
      <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-6 tracking-tight">Your Details</h2>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            First Name *
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            type="text"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm bg-[var(--color-surface)] text-[var(--color-text)]"
            placeholder="Your first name"
          />
          {fieldErrors.firstName && <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Last Name *
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            type="text"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm bg-[var(--color-surface)] text-[var(--color-text)]"
            placeholder="Your last name"
          />
          {fieldErrors.lastName && <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Email *
          </label>
          <input
            id="email"
            name="email"
            required
            type="email"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm bg-[var(--color-surface)] text-[var(--color-text)]"
            placeholder="you@email.com"
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Phone *
          </label>
          <input
            id="phone"
            name="phone"
            required
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, "");
              setPhone(digitsOnly);
              if (fieldErrors.phone) setFieldErrors((f) => ({ ...f, phone: "" }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm bg-[var(--color-surface)] text-[var(--color-text)]"
            placeholder="10-digit mobile number"
          />
          {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="service" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          Reason for Visit *
        </label>
        <select
          id="service"
          name="service"
          required
          onChange={() => {
            if (fieldErrors.service) setFieldErrors((f) => ({ ...f, service: "" }));
          }}
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm bg-[var(--color-surface)] text-[var(--color-text)]"
        >
          <option value="">Select a service</option>
          {serviceOptions.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
        {fieldErrors.service && <p className="mt-1 text-xs text-red-600">{fieldErrors.service}</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="preferredDate" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          Preferred Date *
        </label>
        <input
          id="preferredDate"
          name="preferredDate"
          type="text"
          required
          value={preferredDate}
          onChange={(e) => {
            setPreferredDate(e.target.value);
            if (fieldErrors.preferredDate) setFieldErrors((f) => ({ ...f, preferredDate: "" }));
          }}
          placeholder="23-Aug-2026"
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm bg-[var(--color-surface)] text-[var(--color-text)]"
        />
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Format: dd-mmm-yyyy (e.g. 23-Aug-2026). Defaults to today.
        </p>
        {fieldErrors.preferredDate && <p className="mt-1 text-xs text-red-600">{fieldErrors.preferredDate}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          Additional Notes
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm resize-none bg-[var(--color-surface)] text-[var(--color-text)]"
          placeholder="Briefly describe your concern or any relevant history..."
        />
      </div>

      {/* Consent (DPDP Act 2023) */}
      <div className="mb-6">
        <label htmlFor="consent" className="flex items-start gap-3 text-sm text-[var(--color-text)] cursor-pointer">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (fieldErrors.consent) setFieldErrors((f) => ({ ...f, consent: "" }));
            }}
            aria-describedby={fieldErrors.consent ? "consent-error" : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
          />
          <span>
            I consent to {siteConfig.brand.name} storing and using my details to contact me about my appointment, as
            described in the{" "}
            <Link href="/privacy" className="font-semibold text-[var(--color-primary)] underline underline-offset-2">
              Privacy Policy
            </Link>
            . *
          </span>
        </label>
        {fieldErrors.consent && (
          <p id="consent-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.consent}
          </p>
        )}
      </div>

      {/* Honeypot for bots — must stay empty */}
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] disabled:opacity-70 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : (
          <>
            Request Appointment
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>

      <div className="mt-5 pt-5 border-t border-[var(--color-border-light)] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <p className="text-sm text-[var(--color-text-muted)]">Prefer WhatsApp?</p>
        <button
          type="button"
          onClick={openWhatsApp}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#128C7E] dark:text-[#25D366] hover:underline cursor-pointer text-left"
        >
          Send your request on WhatsApp →
        </button>
      </div>

      <p className="mt-4 text-xs text-[var(--color-text-muted)]">
        This form sends a request only — your appointment is not booked until the clinic contacts you to confirm it.
        {BOOKING_DEMO_MODE && " (Demo site: requests are not sent anywhere.)"}
      </p>
    </form>
  );
}
