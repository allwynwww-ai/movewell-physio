import { siteConfig } from "@/site.config";

/**
 * Is the Pro online-booking feature switched on?
 * FEATURE_ONLINE_BOOKING (or NEXT_PUBLIC_FEATURE_ONLINE_BOOKING) ("true"/"false") overrides
 * siteConfig.features.onlineBooking when set, so a preview deploy can turn
 * it on without changing the code on main.
 */
export function isOnlineBookingOn(): boolean {
  // Read at request time (computed keys stop Next.js from inlining the value
  // at build time). FEATURE_ONLINE_BOOKING is the preferred server-only name.
  const read = (k: string) => (process.env[k] ?? "").trim().toLowerCase();
  const env = read("FEATURE_ONLINE_BOOKING") || read(["NEXT_PUBLIC", "FEATURE_ONLINE_BOOKING"].join("_"));
  if (env === "true" || env === "1" || env === "on") return true;
  if (env === "false" || env === "0" || env === "off") return false;
  return siteConfig.features.onlineBooking;
}
