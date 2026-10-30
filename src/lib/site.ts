/**
 * Derived helpers. All clinic data lives in `src/site.config.ts` —
 * do not hard-code clinic details here.
 */
import { siteConfig, type DayOfWeek, type OpeningHours } from "@/site.config";

export { siteConfig };

export const CLINIC_NAME = siteConfig.brand.name;
export const CLINIC_PHONE_DISPLAY = siteConfig.contact.phoneDisplay;
export const CLINIC_PHONE_TEL = siteConfig.contact.phoneTel;
export const CLINIC_WHATSAPP = siteConfig.contact.whatsappNumber;
export const CLINIC_EMAIL = siteConfig.contact.email;
export const IS_DEMO_NUMBER = siteConfig.contact.isDemoNumber;

export const WHATSAPP_MESSAGES = siteConfig.contact.whatsappMessages;
export const WHATSAPP_PREFILL = WHATSAPP_MESSAGES.default;

export function whatsappLink(message: string = WHATSAPP_PREFILL): string {
  return `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:${CLINIC_PHONE_TEL}`;
export const mailtoLink = `mailto:${CLINIC_EMAIL}`;

/** Primary therapist (first in the list). */
export const primaryTherapist = siteConfig.therapists[0];

/** Absolute site URL without trailing slash. */
export function getSiteUrl(): string {
  const explicit = siteConfig.seo.siteUrl || process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;
  return "http://localhost:3000";
}

/** True while the booking form points at a placeholder address (nothing is sent). */
export const BOOKING_DEMO_MODE = /\.example$/i.test(siteConfig.booking.formSubmitEmail);

/* ── Address ─────────────────────────────────────────────────────────── */

export const addressLines: string[] = [
  ...siteConfig.address.lines,
  [siteConfig.address.city, siteConfig.address.region, siteConfig.address.postalCode]
    .filter(Boolean)
    .join(", "),
];

export const addressOneLine = addressLines.join(", ");

/* ── Opening hours ───────────────────────────────────────────────────── */

const DAY_ORDER: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SHORT: Record<DayOfWeek, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export function formatTime(hhmm: string): string {
  const [hStr, m] = hhmm.split(":");
  const h = Number(hStr);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m ?? "00"} ${suffix}`;
}

function formatDays(days: DayOfWeek[]): string {
  const sorted = [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
  const groups: DayOfWeek[][] = [];
  for (const d of sorted) {
    const last = groups[groups.length - 1];
    if (last && DAY_ORDER.indexOf(d) === DAY_ORDER.indexOf(last[last.length - 1]) + 1) {
      last.push(d);
    } else {
      groups.push([d]);
    }
  }
  return groups
    .map((g) => (g.length === 1 ? SHORT[g[0]] : `${SHORT[g[0]]} – ${SHORT[g[g.length - 1]]}`))
    .join(", ");
}

export type HoursRow = { days: string; hours: string; closed?: boolean };

/** Human-readable opening hours, with closed days listed last. */
export function getHoursRows(hours: OpeningHours[] = siteConfig.openingHours): HoursRow[] {
  const rows: HoursRow[] = hours.map((h) => ({
    days: formatDays(h.days),
    hours: `${formatTime(h.opens)} – ${formatTime(h.closes)}`,
  }));
  const open = new Set(hours.flatMap((h) => h.days));
  const closed = DAY_ORDER.filter((d) => !open.has(d));
  if (closed.length) rows.push({ days: formatDays(closed), hours: "Closed", closed: true });
  return rows;
}

/** e.g. "Mon – Fri 9:00 am – 7:00 pm · Sat 9:00 am – 2:00 pm" */
export function getHoursSummary(): string {
  return getHoursRows()
    .filter((r) => !r.closed)
    .map((r) => `${r.days} ${r.hours}`)
    .join(" · ");
}

/* ── Sample-content helpers ──────────────────────────────────────────── */

export const hasSampleTestimonials =
  siteConfig.showSampleNotice && siteConfig.testimonials.some((t) => t.isSample);
export const hasSampleStats =
  siteConfig.showSampleNotice && siteConfig.stats.some((s) => s.isSample);

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
