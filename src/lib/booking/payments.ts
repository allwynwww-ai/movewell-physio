/**
 * Premium payments – server side. Zero-cost: no gateway. Patients pay at the
 * clinic, by UPI (QR / deep link with the amount pre-filled) or by bank
 * transfer quoting their booking reference; the clinic checks its UPI / bank
 * app and marks the booking paid in /admin.
 * Never import this from a client component (it renders QR codes with `qrcode`).
 */
import QRCode from "qrcode";
import { siteConfig } from "@/site.config";
import { isFeatureOn } from "@/lib/features";
import { buildUpiLink, isValidVpa, type PaymentView } from "@/lib/payments";
import type { Appointment } from "./appointments";
import { isOnlineBookingOn } from "./flags";

type PaymentSettings = typeof siteConfig.payments & { demo: boolean };

/*
 * PR-preview demo – REVERT THIS BLOCK BEFORE MERGING (harmless on main: it only
 * matches Vercel preview builds of the feature/premium-payments branch).
 * Turns payments on with obviously fake UPI / bank details so the preview can be
 * tried end to end, unless FEATURE_PAYMENTS is set explicitly.
 */
function isPreviewDemo(): boolean {
  const env = (k: string) => (process.env[k] ?? "").trim();
  return env("VERCEL_ENV") === "preview" && env("VERCEL_GIT_COMMIT_REF") === "feature/premium-payments" && env("FEATURE_PAYMENTS") === "";
}
const PREVIEW_DEMO = {
  upiId: "clinic@upi",
  payeeName: "Demo Clinic (DEMO)",
  bank: { accountName: "DEMO ACCOUNT", accountNumber: "000000000000", ifsc: "DEMO0000001", bankName: "Demo Bank" },
};

/** Is the Premium payments feature on? Needs online booking (payments hang off a booking). */
export function isPaymentsOn(): boolean {
  return (isFeatureOn("payments") || isPreviewDemo()) && isOnlineBookingOn();
}

/** Effective payment settings. */
export function paymentSettings(): PaymentSettings {
  if (isPreviewDemo()) return { ...siteConfig.payments, ...PREVIEW_DEMO, demo: true };
  return { ...siteConfig.payments, demo: false };
}

const clean = (v: string | undefined) => (v ?? "").trim();

/** UPI details, or null when UPI is off or the UPI ID is missing / invalid. */
export function upiDetails(s: PaymentSettings = paymentSettings()) {
  if (!s.methods.upi || s.onlineMode === "none") return null;
  const vpa = clean(s.upiId);
  if (!vpa || !isValidVpa(vpa)) return null;
  return { vpa, payeeName: clean(s.payeeName) || siteConfig.brand.name };
}

/** Bank details, or null when bank transfer is off or account name / number / IFSC are missing. */
export function bankDetails(s: PaymentSettings = paymentSettings()) {
  if (!s.methods.bank || s.onlineMode === "none") return null;
  const b = {
    accountName: clean(s.bank.accountName),
    accountNumber: clean(s.bank.accountNumber),
    ifsc: clean(s.bank.ifsc).toUpperCase(),
    bankName: clean(s.bank.bankName),
  };
  if (!b.accountName || !b.accountNumber || !b.ifsc) return null;
  return b;
}

/** Service fee (INR) used in the payment step: payments.serviceFeesINR, else services[].priceINR. */
export function serviceFee(serviceId: string, s: PaymentSettings = paymentSettings()): number | null {
  const fee = s.serviceFeesINR[serviceId] ?? siteConfig.services.find((x) => x.id === serviceId)?.priceINR;
  return typeof fee === "number" && fee > 0 ? Math.round(fee) : null;
}

/** Amounts to record on a new booking (null when payments are off). */
export function amountsForNewBooking(serviceId: string): { totalINR: number | null; dueINR: number | null } | null {
  if (!isPaymentsOn()) return null;
  const s = paymentSettings();
  const totalINR = serviceFee(serviceId, s);
  return { totalINR, dueINR: onlineAmount(totalINR, s) };
}

function onlineAmount(totalINR: number | null, s: PaymentSettings): number | null {
  if (s.onlineMode === "none") return null;
  if (s.onlineMode === "deposit") {
    const dep = Math.round(s.depositINR);
    if (!(dep > 0)) return null;
    return totalINR ? Math.min(dep, totalINR) : dep;
  }
  return totalINR;
}

async function qrDataUrl(text: string): Promise<string> {
  const svg = await QRCode.toString(text, { type: "svg", errorCorrectionLevel: "M", margin: 2, color: { dark: "#000000", light: "#ffffff" } });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Everything the patient payment panel shows for one booking, or null when payments are off. */
export async function paymentView(a: Appointment): Promise<PaymentView | null> {
  if (!isPaymentsOn()) return null;
  const s = paymentSettings();
  const totalINR = a.paymentTotalINR ?? serviceFee(a.serviceId, s);
  // Bookings made before payments were switched on have no stored amount: use today's settings.
  const onlineINR = a.paymentDueINR ?? (a.paymentTotalINR == null ? onlineAmount(totalINR, s) : null);
  const open = a.status !== "cancelled" && (a.paymentStatus === "unpaid" || a.paymentStatus === "pending_verification");
  const upiCfg = upiDetails(s);
  const bankCfg = bankDetails(s);
  const online = open && s.onlineMode !== "none" && onlineINR != null && onlineINR > 0;

  let upi: PaymentView["upi"] = null;
  if (online && upiCfg) {
    const link = buildUpiLink({ vpa: upiCfg.vpa, payeeName: upiCfg.payeeName, amountINR: onlineINR!, note: a.ref });
    upi = { link, qrDataUrl: await qrDataUrl(link), ...upiCfg };
  }
  const bank = online && bankCfg ? bankCfg : null;
  // Nothing to show: an open booking with no usable method at all.
  if (open && !s.methods.clinic && !upi && !bank) return null;
  return {
    ref: a.ref,
    status: a.paymentStatus,
    totalINR,
    // Only quote an online amount when there is actually a way to pay online.
    onlineINR: upi || bank ? onlineINR : null,
    mode: s.onlineMode,
    payAtClinic: s.methods.clinic,
    upi,
    bank,
    method: a.paymentMethod,
    reference: a.paymentRef,
    canSubmitRef: open && Boolean(upi || bank),
    demo: s.demo,
  };
}

/** One plain-text line for the confirmation email (null when payments are off). */
export function paymentEmailNote(p: PaymentView | null): string | null {
  if (!p || p.status !== "unpaid") return null;
  const inr = (n: number) => `Rs ${n.toLocaleString("en-IN")}`;
  const online = [p.upi ? "UPI" : "", p.bank ? "bank transfer" : ""].filter(Boolean).join(" or ");
  const parts: string[] = [];
  if (p.onlineINR != null && online) {
    parts.push(
      `${p.mode === "deposit" ? `Pay a deposit of ${inr(p.onlineINR)}` : `Pay ${inr(p.onlineINR)}`} by ${online} – the QR code and details are on your manage page (quote ${p.ref}).`,
    );
  }
  if (p.payAtClinic) parts.push(parts.length ? "Or pay at the clinic by cash, card or UPI." : `You can pay at the clinic by cash, card or UPI${p.totalINR ? ` (${inr(p.totalINR)})` : ""}.`);
  if (p.demo) parts.push("(Demo details – please don't pay.)");
  return parts.join(" ") || null;
}
