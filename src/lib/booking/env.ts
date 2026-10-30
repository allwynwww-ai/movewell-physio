/** Server-only environment helpers for online booking and the admin area. */
import { isOnlineBookingOn } from "./flags";

export function databaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

const DEV_SECRET = "dev-only-insecure-secret-change-me-0123456789";

/**
 * Secret used to sign patient manage links and the admin session cookie.
 * Required in production (min 32 chars). In local development a fixed dev
 * secret is used so the flow can be tried without extra setup.
 */
export function sessionSecret(): string | undefined {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV !== "production") return DEV_SECRET;
  return undefined;
}

export type BookingStatus = "off" | "ready" | "not-configured";

/** "ready" only when the flag is on AND a database + secret are configured. */
export function bookingStatus(): BookingStatus {
  if (!isOnlineBookingOn()) return "off";
  if (!databaseUrl() || !sessionSecret()) return "not-configured";
  return "ready";
}

export function adminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD && !!databaseUrl() && !!sessionSecret();
}

export function clinicNotifyEmail(fallback: string): string {
  return process.env.CLINIC_NOTIFY_EMAIL || fallback;
}
