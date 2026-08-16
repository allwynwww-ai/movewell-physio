"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export default function BookPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission — replace with real booking integration later
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
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
          <h1 className="text-3xl font-bold text-[var(--color-secondary)] mb-3">
            Request Received!
          </h1>
          <p className="text-[var(--color-text-muted)] mb-8">
            Thank you for your booking request. We&apos;ll contact you within 1 business day to confirm your appointment time.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase mb-2">
            Book Online
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)] mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
            Take the first step towards better movement and less pain. We&apos;re here to help you feel your best.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm"
              >
                <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-6">
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
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm"
                      placeholder="Jane"
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
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm"
                      placeholder="Smith"
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
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm"
                      placeholder="jane@email.com"
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
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm"
                      placeholder="04xx xxx xxx"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label htmlFor="service" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Reason for Visit
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm bg-[var(--color-surface)]"
                  >
                    <option value="">Select a service (optional)</option>
                    <option>Back & Neck Pain</option>
                    <option>Sports Injury</option>
                    <option>Post-Surgical Rehab</option>
                    <option>Pelvic Floor Therapy</option>
                    <option>Vestibular & Balance</option>
                    <option>General Assessment</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="mb-5">
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm resize-none"
                    placeholder="Briefly describe your concern or any relevant history..."
                  />
                </div>

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
                </p>
              </form>
            </div>

            {/* Sidebar info */}
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
                <h3 className="font-semibold text-[var(--color-secondary)] mb-3">Prefer to Call?</h3>
                <a
                  href="tel:+912212345678"
                  className="text-2xl font-bold text-[var(--color-primary)] hover:underline"
                >
                  +91 22 1234 5678
                </a>
                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                  Mon–Fri 8:00am – 6:00pm
                </p>
              </div>

              <div className="bg-[var(--color-light-teal)] rounded-2xl p-6">
                <p className="text-sm font-medium text-[var(--color-secondary)]">
                  New patients welcome. We look forward to supporting your recovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
