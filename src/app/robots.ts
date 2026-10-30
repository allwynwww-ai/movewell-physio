import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    // Private areas (clinic admin, patient manage links, APIs) are also sent with noindex headers.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/book/manage/"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
