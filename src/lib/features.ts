import { siteConfig } from "@/site.config";

/** Pro extras that can be switched on/off in `siteConfig.features`. */
export type ProFeature = "googleReviews" | "therapists" | "analytics" | "exerciseLibrary";

/** Optional per-deployment overrides ("true"/"false"); the env var wins when set. */
const ENV_OVERRIDE: Record<ProFeature, string> = {
  googleReviews: "FEATURE_GOOGLE_REVIEWS",
  therapists: "FEATURE_THERAPISTS",
  analytics: "FEATURE_ANALYTICS",
  exerciseLibrary: "FEATURE_EXERCISE_LIBRARY",
};

/**
 * Is a Pro extra switched on? Reads `siteConfig.features[name]`, overridable by
 * the matching FEATURE_* env var. Pages are statically generated, so the value
 * is fixed at build time (a redeploy applies a change).
 */
export function isFeatureOn(name: ProFeature): boolean {
  // Computed key: keeps Next.js from inlining the value.
  const env = (process.env[ENV_OVERRIDE[name]] ?? "").trim().toLowerCase();
  if (env === "true" || env === "1" || env === "on") return true;
  if (env === "false" || env === "0" || env === "off") return false;
  return Boolean(siteConfig.features[name]);
}

/* ── Google reviews ─────────────────────────────────────────────────── */

export type GoogleReviewsView =
  | { mode: "badge"; rating: number; reviewCount: number; url?: string; isSample: boolean }
  | { mode: "link"; url: string }
  | { mode: "none" };

/** What the Google reviews badge should show (nothing when the feature is off or data is missing). */
export function getGoogleReviews(): GoogleReviewsView {
  if (!isFeatureOn("googleReviews")) return { mode: "none" };
  const { rating, reviewCount, url, isSample } = siteConfig.googleReviews;
  const validUrl = url && /^https:\/\//i.test(url) ? url : undefined;
  if (
    typeof rating === "number" &&
    rating > 0 &&
    rating <= 5 &&
    typeof reviewCount === "number" &&
    reviewCount > 0 &&
    validUrl
  ) {
    return {
      mode: "badge",
      rating: Math.round(rating * 10) / 10,
      reviewCount: Math.floor(reviewCount),
      url: validUrl,
      isSample: Boolean(isSample) && siteConfig.showSampleNotice,
    };
  }
  // A rating/count of 0 means "no reviews yet": hide everything. With no
  // rating/count at all but a Google link, show just "Find us on Google".
  const noNumbers = rating == null && reviewCount == null;
  if (validUrl && noNumbers) return { mode: "link", url: validUrl };
  return { mode: "none" };
}

/* ── Team ───────────────────────────────────────────────────────────── */

export function getTeam() {
  if (!isFeatureOn("therapists")) return [];
  return siteConfig.team.members.filter((m) => m.slug && m.name);
}

/* ── Navigation ─────────────────────────────────────────────────────── */

export type NavLink = { href: string; label: string };

/** Main navigation, including the Pro pages that are switched on. */
export function getNavLinks(): NavLink[] {
  const links: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
  ];
  if (getTeam().length > 0) links.push({ href: "/team", label: "Team" });
  if (isFeatureOn("exerciseLibrary")) links.push({ href: "/exercises", label: "Exercises" });
  links.push({ href: "/testimonials", label: "Testimonials" }, { href: "/contact", label: "Contact" });
  return links;
}
