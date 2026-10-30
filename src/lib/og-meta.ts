import { siteConfig } from "@/site.config";

/** Size and alt text of the generated social share image (see lib/og.tsx). */
export const ogSize = { width: 1200, height: 630 };
export const ogAlt = `${siteConfig.brand.name} – ${siteConfig.brand.tagline}`;
