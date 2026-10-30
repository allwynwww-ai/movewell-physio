import { siteConfig } from "@/site.config";

/**
 * Is the Pro online-booking feature switched on?
 * NEXT_PUBLIC_FEATURE_ONLINE_BOOKING ("true"/"false") overrides
 * siteConfig.features.onlineBooking when set, so a preview deploy can turn
 * it on without changing the code on main.
 */
export function isOnlineBookingOn(): boolean {
  const env = (process.env.NEXT_PUBLIC_FEATURE_ONLINE_BOOKING ?? "").trim().toLowerCase();
  if (env === "true" || env === "1" || env === "on") return true;
  if (env === "false" || env === "0" || env === "off") return false;
  return siteConfig.features.onlineBooking;
}
