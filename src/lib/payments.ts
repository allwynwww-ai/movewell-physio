/**
 * Premium payments – shared types and pure helpers (safe for client components).
 * Server-side logic (config, QR codes) lives in src/lib/booking/payments.ts.
 */

export type PaymentStatus = "unpaid" | "pending_verification" | "paid" | "refunded" | "waived";
export type PaymentMethod = "cash" | "card" | "upi" | "bank" | "other";

export const PAYMENT_STATUSES: PaymentStatus[] = ["unpaid", "pending_verification", "paid", "refunded", "waived"];
export const PAYMENT_METHODS: PaymentMethod[] = ["upi", "cash", "card", "bank", "other"];

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  pending_verification: "Awaiting check",
  paid: "Paid",
  refunded: "Refunded",
  waived: "Waived",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  upi: "UPI",
  cash: "Cash",
  card: "Card",
  bank: "Bank transfer",
  other: "Other",
};

/** A UPI ID (VPA) such as "clinic@okhdfcbank". */
export function isValidVpa(v: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,255}@[a-zA-Z][a-zA-Z0-9]{1,63}$/.test(v.trim());
}

/** Percent-encode a UPI query value. "@" is a legal query character and is kept as-is (some UPI apps expect it). */
function enc(v: string): string {
  return encodeURIComponent(v).replace(/%40/g, "@");
}

/**
 * UPI deep link (NPCI "upi://pay" format) with the amount pre-filled:
 *   upi://pay?pa=<VPA>&pn=<payee name>&am=<amount>&cu=INR&tn=<booking ref>
 */
export function buildUpiLink(opts: { vpa: string; payeeName: string; amountINR: number; note: string }): string {
  const amount = (Math.round(opts.amountINR * 100) / 100).toFixed(2);
  return (
    `upi://pay?pa=${enc(opts.vpa.trim())}` +
    `&pn=${enc(opts.payeeName.trim())}` +
    `&am=${amount}` +
    `&cu=INR` +
    `&tn=${enc(opts.note.trim())}`
  );
}

/** Patient / clinic payment reference: a UPI transaction ID (UTR, 12 digits) or a bank reference. */
export function normalisePaymentRef(v: string): string | null {
  const s = v.replace(/\s+/g, "").trim();
  return /^[A-Za-z0-9/-]{6,40}$/.test(s) ? s : null;
}

/** What the patient-facing payment panel needs (built on the server). */
export type PaymentView = {
  ref: string;
  status: PaymentStatus;
  /** Full service fee (INR), if known. */
  totalINR: number | null;
  /** Amount asked for online (full fee or deposit); null = pay at the clinic only. */
  onlineINR: number | null;
  mode: "full" | "deposit" | "none";
  payAtClinic: boolean;
  upi: { link: string; qrDataUrl: string; vpa: string; payeeName: string } | null;
  bank: { accountName: string; accountNumber: string; ifsc: string; bankName: string } | null;
  method: PaymentMethod | null;
  reference: string | null;
  /** Patient may submit / update a transaction reference. */
  canSubmitRef: boolean;
  /** Demo payment details – patients must not actually pay. */
  demo: boolean;
};
