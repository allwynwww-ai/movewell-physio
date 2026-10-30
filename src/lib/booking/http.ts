import { NextResponse } from "next/server";
import { bookingStatus } from "./env";

export const NO_STORE = { "Cache-Control": "no-store" };

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: NO_STORE });
}

/** Returns an error response when online booking is off or not configured. */
export function guard(): NextResponse | null {
  const s = bookingStatus();
  if (s === "off") return json({ error: "Online booking is not enabled." }, 404);
  if (s === "not-configured") return json({ error: "Online booking is not available right now." }, 503);
  return null;
}

/** Absolute base URL of the current deployment (works on previews too). */
export function originOf(headers: Headers, fallbackUrl?: string): string {
  const host = headers.get("x-forwarded-host") || headers.get("host");
  const proto = headers.get("x-forwarded-proto") || (host?.startsWith("localhost") ? "http" : "https");
  if (host) return `${proto}://${host}`;
  return fallbackUrl ? new URL(fallbackUrl).origin : "http://localhost:3000";
}

export function manageUrl(origin: string, token: string) {
  return `${origin}/book/manage/${token}`;
}
