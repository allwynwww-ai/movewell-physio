import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getTeam, isFeatureOn } from "@/lib/features";
import { exercises } from "@/content/exercises";

const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book", changeFrequency: "yearly", priority: 0.9 },
  { path: "/about", changeFrequency: "yearly", priority: 0.7 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();
  const all = [...routes];
  // Pro pages are listed only when their feature is switched on.
  if (getTeam().length > 0) all.push({ path: "/team", changeFrequency: "monthly", priority: 0.7 });
  if (isFeatureOn("exerciseLibrary")) {
    all.push({ path: "/exercises", changeFrequency: "monthly", priority: 0.6 });
    for (const e of exercises) all.push({ path: `/exercises/${e.slug}`, changeFrequency: "yearly", priority: 0.5 });
  }
  return all.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
