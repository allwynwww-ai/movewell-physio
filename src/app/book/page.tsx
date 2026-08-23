"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CLINIC_EMAIL, CLINIC_PHONE_DISPLAY, CLINIC_PHONE_TEL, whatsappLink } from "@/lib/site";

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

export default function BookPage() {
  const todayDisplay = useMemo(() => formatDateDisplay(new Date()), []);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState(todayDisplay);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    const phoneDigits = phone.replace(/\D/g, "");
    if (!phoneDigits) {
      nextErrors.phone = "Phone number is required.";
    } else if (!/^\d+$/.test(phone)) {
      nextErrors.phone = "Phone number must contain only digits.";
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

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    payload.phone = phoneDigits;
    payload.preferredDate = preferredDate.trim();

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CLINIC_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
          _subject: "New appointment request — MoveWell Physiotherapy",
          _template: "table",
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong. Please try again, call us, or message on WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="py-20 md:py-28 bg-[var(--color-bg)]">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-light-teal)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-secondary)] mb-3 tracking-tight">
            Request received
          </h1>
          <p className="text-[var(--color-text-muted)] mb-2">
            Thank you for your booking request. We&apos;ll respond within 1 business day to confirm your appointment.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">
            Need a faster reply? Reach us on WhatsApp or phone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-sm transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${CLINIC_PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-secondary)] font-semibold text-sm hover:bg-[var(--color-bg)] transition-colors"
            >
              Call {CLINIC_PHONE_DISPLAY}
            </a>
          </div>
          <a href="/" className="inline-block mt-8 text-sm font-semibold text-[var(--color-primary)] hover:underline">
            ← Back to Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 md:pt-12 md:pb-8">
          <p className="section-label mb-3">Book online</p>
          <h1 className="heading-display text-3xl md:text-5xl mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Take the first step towards better movement and less pain. We&apos;re here to help you feel your best.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm"
              >
                <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-6 tracking-tight">
                  Your Details
                </h2>

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
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                    )}
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
                    <option>Back & Neck Pain</option>
                    <option>Sports Injury</option>
                    <option>Post-Surgical Rehab</option>
                    <option>Pelvic Floor Therapy</option>
                    <option>Vestibular & Balance</option>
                    <option>General Assessment</option>
                    <option>Other</option>
                  </select>
                    {fieldErrors.service && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.service}</p>
                    )}
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
                    {fieldErrors.preferredDate && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.preferredDate}</p>
                    )}
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

                {/* Honeypot for bots */}
                <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

                {error && (
                  <p className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] disabled:opacity-70 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
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

                <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                  Your information is secure. We&apos;ll only use it to arrange your appointment.
                  First submission may require email confirmation at {CLINIC_EMAIL}.
                </p>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
                <h3 className="font-semibold text-[var(--color-secondary)] mb-4">What to Expect</h3>
                <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    We review your request and contact you to confirm a time.
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    Initial assessment usually takes 45–60 minutes.
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    Wear comfortable clothing you can move in.
                  </li>
                </ul>
              </div>

              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6">
                <h3 className="font-semibold text-[var(--color-secondary)] mb-3">Prefer WhatsApp or Call?</h3>
                <a
                  href={`tel:${CLINIC_PHONE_TEL}`}
                  className="text-xl font-bold text-[var(--color-primary)] hover:underline block"
                >
                  {CLINIC_PHONE_DISPLAY}
                </a>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-[#25D366] hover:underline"
                >
                  Message on WhatsApp →
                </a>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                  Mon–Sat clinic hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
