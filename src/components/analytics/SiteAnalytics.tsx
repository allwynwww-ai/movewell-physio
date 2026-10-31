"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";

const isPrivatePath = (path: string) => path === "/admin" || path.startsWith("/admin/") || path.startsWith("/book/manage/");

/** Never send views/events for the clinic admin or private patient links. */
function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    const { pathname } = new URL(event.url);
    if (isPrivatePath(pathname)) return null;
  } catch {
    /* keep event */
  }
  return event;
}

/** Map a clicked link to one of our conversion events. */
function classify(a: HTMLAnchorElement): "Book click" | "Call click" | "WhatsApp click" | null {
  const explicit = a.dataset.track;
  if (explicit === "book") return "Book click";
  if (explicit === "call") return "Call click";
  if (explicit === "whatsapp") return "WhatsApp click";
  const href = a.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) return "Call click";
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) return "WhatsApp click";
  if (href === "/book" || href.startsWith("/book?") || href.startsWith("/book#")) return "Book click";
  return null;
}

/** Location label for the event, e.g. "header", "footer", "home" (page path otherwise). */
function where(a: HTMLAnchorElement, path: string): string {
  const region = a.closest("[data-track-area], header, footer");
  if (region instanceof HTMLElement) {
    if (region.dataset.trackArea) return region.dataset.trackArea;
    return region.tagName.toLowerCase();
  }
  return path === "/" ? "home" : path;
}

/**
 * Vercel Web Analytics (page views) + click events for Book, Call (tel:) and
 * WhatsApp links anywhere on the site, via one delegated listener — no need
 * to wire every button. Rendered only when features.analytics is on; returns
 * nothing on /admin so the script is never loaded there.
 */
export default function SiteAnalytics() {
  const pathname = usePathname() ?? "/";
  const off = isPrivatePath(pathname);

  useEffect(() => {
    if (off) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const a = target?.closest?.("a");
      if (!(a instanceof HTMLAnchorElement)) return;
      const name = classify(a);
      if (!name) return;
      track(name, { location: where(a, window.location.pathname), page: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [off]);

  if (off) return null;
  return <Analytics beforeSend={beforeSend} />;
}
