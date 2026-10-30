import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { getSiteUrl } from "@/lib/site";
import { ogAlt, ogSize } from "@/lib/og-meta";

type PageMetaInput = {
  /** Page title (the template adds the clinic name). Omit for the home page. */
  title?: string;
  description?: string;
  /** Route path, e.g. "/about" */
  path: string;
  noIndex?: boolean;
};

/** Per-page metadata with canonical URL, Open Graph and Twitter tags from site.config.ts */
export function pageMetadata({ title, description, path, noIndex }: PageMetaInput): Metadata {
  const desc = description ?? siteConfig.seo.defaultDescription;
  const fullTitle = title
    ? siteConfig.seo.titleTemplate.replace("%s", title)
    : siteConfig.seo.defaultTitle;

  return {
    ...(title ? { title } : { title: { absolute: siteConfig.seo.defaultTitle } }),
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.brand.name,
      locale: siteConfig.seo.locale,
      title: fullTitle,
      description: desc,
      // A page-level openGraph object replaces the inherited one, so the
      // generated share image (app/opengraph-image.tsx) is referenced explicitly.
      images: [{ url: "/opengraph-image", width: ogSize.width, height: ogSize.height, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [{ url: "/twitter-image", alt: ogAlt }],
      ...(siteConfig.seo.twitterHandle
        ? { site: siteConfig.seo.twitterHandle, creator: siteConfig.seo.twitterHandle }
        : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

const SCHEMA_DAYS = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
} as const;

/** schema.org MedicalClinic / Physiotherapy JSON-LD for the whole site. */
export function clinicJsonLd() {
  const url = getSiteUrl();
  const { address, contact, brand, therapists, services, social } = siteConfig;
  const sameAs = Object.values(social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "Physiotherapy"],
    "@id": `${url}/#clinic`,
    name: brand.name,
    description: siteConfig.seo.defaultDescription,
    url,
    image: `${url}${siteConfig.hero.image}`,
    ...(brand.logo ? { logo: `${url}${brand.logo}` } : {}),
    telephone: contact.phoneTel,
    email: contact.email,
    medicalSpecialty: "https://schema.org/Physiotherapy",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.lines.join(", "),
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.geo.latitude,
      longitude: address.geo.longitude,
    },
    hasMap: address.mapEmbedUrl,
    openingHoursSpecification: siteConfig.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => SCHEMA_DAYS[d]),
      opens: h.opens,
      closes: h.closes,
    })),
    availableService: services.map((s) => ({
      "@type": "MedicalTherapy",
      name: s.name,
      description: s.description,
    })),
    employee: therapists.map((t) => ({
      "@type": "Person",
      name: t.name,
      jobTitle: t.title,
    })),
    areaServed: address.city,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: siteConfig.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Safely serialise JSON-LD for a <script> tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

