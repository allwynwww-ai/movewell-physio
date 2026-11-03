"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { PAYMENT_METHOD_LABEL, type PaymentView } from "@/lib/payments";
import { formatINR } from "@/lib/site";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition text-sm bg-[var(--color-surface)] text-[var(--color-text)]";
const boxClass = "rounded-2xl border border-[var(--color-border)] p-4 md:p-5";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard blocked – the value is still visible to copy by hand */
        }
      }}
      className="shrink-0 min-h-8 px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
      aria-label={`Copy ${label}`}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function Row({ k, v, copy, testId }: { k: string; v: string; copy?: boolean; testId?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-sm">
      <dt className="text-[var(--color-text-muted)]">{k}</dt>
      <dd className="flex items-center gap-2 min-w-0 text-right">
        <span className="font-semibold text-[var(--color-secondary)] [overflow-wrap:anywhere]" data-testid={testId}>
          {v}
        </span>
        {copy && <CopyButton value={v} label={k} />}
      </dd>
    </div>
  );
}

/**
 * Premium payments: how to pay for one booking – pay at the clinic, UPI QR /
 * "Pay with UPI" button, bank transfer – plus an optional transaction-reference
 * form. Shown on the booking confirmation and the manage page.
 */
export default function PaymentPanel({ initial, token }: { initial: PaymentView; token: string }) {
  const [p, setP] = useState(initial);
  const [ref, setRef] = useState("");
  const [method, setMethod] = useState<"upi" | "bank">(initial.upi ? "upi" : "bank");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const uid = useId();

  const deposit = p.mode === "deposit" && p.onlineINR != null;
  const rest = deposit && p.totalINR != null ? Math.max(0, p.totalINR - p.onlineINR!) : null;
  const amountText = p.onlineINR != null ? formatINR(p.onlineINR) : "";

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (ref.replace(/\s+/g, "").length < 6) {
      setError("Enter the transaction ID from your UPI or bank app (6–40 letters or numbers).");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/booking/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, reference: ref, method }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    setBusy(false);
    if (res?.ok && json?.payment) {
      setP(json.payment as PaymentView);
      setRef("");
      setSaved(true);
      return;
    }
    setError(json?.error || "Could not save the reference. Please try again or call the clinic.");
  }

  return (
    <section
      aria-labelledby={`${uid}-h`}
      className="text-left mx-auto max-w-xl space-y-4"
      data-testid="payment-panel"
      data-status={p.status}
      data-mode={p.mode}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`${uid}-h`} className="text-lg font-bold text-[var(--color-secondary)]">
          Payment
        </h2>
        {p.totalINR != null && (
          <p className="text-sm text-[var(--color-text-muted)]">
            Fee <span className="font-semibold text-[var(--color-secondary)]" data-testid="payment-total">{formatINR(p.totalINR)}</span>
          </p>
        )}
      </div>

      {p.demo && (
        <p role="note" className="rounded-xl border border-amber-300/60 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 px-4 py-3 text-sm text-amber-900 dark:text-amber-200" data-testid="payment-demo">
          <strong className="font-semibold">Demo payment details.</strong> This is a preview – please don&apos;t send any money.
        </p>
      )}

      {p.status === "paid" && (
        <p role="status" className="rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300 px-4 py-3 text-sm font-semibold" data-testid="payment-paid">
          ✓ Paid{p.method ? ` by ${PAYMENT_METHOD_LABEL[p.method]}` : ""}. Thank you!
        </p>
      )}
      {p.status === "waived" && (
        <p role="status" className="rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] px-4 py-3 text-sm font-semibold">
          No payment is needed for this booking.
        </p>
      )}
      {p.status === "refunded" && (
        <p role="status" className="rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
          Your payment for this booking has been refunded.
        </p>
      )}
      {p.status === "pending_verification" && (
        <p role="status" className="rounded-xl border border-amber-300/60 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 px-4 py-3 text-sm text-amber-900 dark:text-amber-200" data-testid="payment-pending">
          Thanks – we&apos;ve got your transaction ID <strong className="font-semibold [overflow-wrap:anywhere]">{p.reference}</strong>. The clinic will check
          it and mark your booking as paid.
        </p>
      )}

      {(p.status === "unpaid" || p.status === "pending_verification") && (
        <>
          {p.payAtClinic && (
            <div className={boxClass} data-testid="pay-at-clinic">
              <p className="font-semibold text-[var(--color-secondary)] text-sm">
                {p.onlineINR != null ? (deposit ? "Pay the rest at the clinic" : "Or pay at the clinic") : "Pay at the clinic"}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {deposit && rest != null && rest > 0
                  ? `Pay the remaining ${formatINR(rest)} at your visit – `
                  : p.onlineINR == null && p.totalINR != null
                    ? `Pay ${formatINR(p.totalINR)} at your visit – `
                    : "You can pay at your visit – "}
                cash, card or UPI at reception.
              </p>
            </div>
          )}

          {p.onlineINR != null && (p.upi || p.bank) && (
            <p className="text-sm text-[var(--color-text)]" data-testid="payment-online-amount">
              {deposit ? "To hold your slot, pay a deposit of " : "Pay online now: "}
              <strong className="font-bold text-[var(--color-secondary)]" data-testid="payment-amount">
                {amountText}
              </strong>
              {deposit && rest != null && rest > 0 ? ` (the remaining ${formatINR(rest)} at the clinic)` : ""}.
            </p>
          )}

          {p.upi && (
            <div className={boxClass} data-testid="payment-upi">
              <p className="font-semibold text-[var(--color-secondary)] text-sm mb-3">Pay by UPI</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- local data: URL, generated on the server */}
                <img
                  src={p.upi.qrDataUrl}
                  alt={`UPI QR code: pay ${amountText} to ${p.upi.payeeName} (${p.upi.vpa}), reference ${p.ref}`}
                  width={192}
                  height={192}
                  className="w-48 h-48 mx-auto sm:mx-0 rounded-xl bg-white p-1 border border-[var(--color-border)]"
                  data-testid="upi-qr"
                  data-upi-link={p.upi.link}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text-muted)] mb-2">
                    Scan with any UPI app (Google Pay, PhonePe, Paytm, BHIM…). The amount and reference are filled in for you.
                  </p>
                  <dl className="divide-y divide-[var(--color-border)]">
                    <Row k="UPI ID" v={p.upi.vpa} copy testId="upi-vpa" />
                    <Row k="Name" v={p.upi.payeeName} />
                    <Row k="Amount" v={amountText} />
                    <Row k="Reference" v={p.ref} />
                  </dl>
                </div>
              </div>
              {/* Phones: open the UPI app directly (same link as the QR). Wrapper div because .premium-btn sets display. */}
              <div className="md:hidden mt-4">
                <a href={p.upi.link} className="premium-btn premium-btn-primary w-full px-6 py-3 text-sm" data-testid="upi-pay-button">
                  Pay {amountText} with UPI
                </a>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-3" data-testid="payment-manual-note">
                The clinic confirms UPI payments manually, so your booking shows as paid once they&apos;ve checked (usually within a
                working day).
              </p>
            </div>
          )}

          {p.bank && (
            <div className={boxClass} data-testid="payment-bank">
              <p className="font-semibold text-[var(--color-secondary)] text-sm mb-1">Pay by bank transfer (NEFT / IMPS)</p>
              <dl className="divide-y divide-[var(--color-border)]">
                <Row k="Account name" v={p.bank.accountName} />
                <Row k="Account number" v={p.bank.accountNumber} copy testId="bank-account" />
                <Row k="IFSC" v={p.bank.ifsc} copy testId="bank-ifsc" />
                {p.bank.bankName && <Row k="Bank" v={p.bank.bankName} />}
                {p.onlineINR != null && <Row k="Amount" v={amountText} />}
              </dl>
              <p className="text-sm text-[var(--color-text)] mt-2">
                Please quote <strong className="font-semibold">{p.ref}</strong> as the payment reference / remarks.
              </p>
              {!p.upi && (
                <p className="text-xs text-[var(--color-text-muted)] mt-2" data-testid="payment-manual-note">
                  The clinic confirms bank transfers manually, so your booking shows as paid once they&apos;ve checked.
                </p>
              )}
            </div>
          )}

          {p.canSubmitRef && (
            <form onSubmit={submit} className={boxClass} data-testid="payment-ref-form" noValidate>
              <label htmlFor={`${uid}-ref`} className="block text-sm font-semibold text-[var(--color-secondary)]">
                {p.status === "pending_verification" ? "Update your transaction ID" : "Already paid? Tell the clinic (optional)"}
              </label>
              <p id={`${uid}-hint`} className="text-xs text-[var(--color-text-muted)] mt-1 mb-3">
                Enter the UPI transaction ID (12-digit UTR) or bank reference from your app.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                {p.upi && p.bank && (
                  <select
                    aria-label="Paid by"
                    value={method}
                    onChange={(e) => setMethod(e.target.value as "upi" | "bank")}
                    className={`${inputClass} sm:w-40`}
                  >
                    <option value="upi">UPI</option>
                    <option value="bank">Bank transfer</option>
                  </select>
                )}
                <input
                  id={`${uid}-ref`}
                  name="reference"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  inputMode="text"
                  autoComplete="off"
                  maxLength={60}
                  placeholder="e.g. 412345678901"
                  aria-describedby={`${uid}-hint${error ? ` ${uid}-err` : ""}`}
                  aria-invalid={error ? true : undefined}
                  className={inputClass}
                />
                <button type="submit" disabled={busy} className="premium-btn premium-btn-primary px-5 py-2.5 text-sm shrink-0 disabled:opacity-60">
                  {busy ? "Sending…" : "Send"}
                </button>
              </div>
              {error && (
                <p id={`${uid}-err`} role="alert" className="text-sm text-red-600 dark:text-red-400 mt-2">
                  {error}
                </p>
              )}
              {saved && (
                <p role="status" className="text-sm text-[var(--color-primary)] mt-2">
                  Sent. The clinic will confirm your payment.
                </p>
              )}
            </form>
          )}
        </>
      )}
    </section>
  );
}
