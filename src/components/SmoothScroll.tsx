"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HEADER_OFFSET = 96;

function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth") {
  if (!hash || hash === "#") return false;
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

/** Hard scroll to absolute top — no smooth, no early exit */
function forceScrollToTop() {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  html.scrollTop = 0;
  html.style.scrollBehavior = prev;
}

export default function SmoothScroll() {
  const pathname = usePathname();

  // Disable browser restoring previous scroll positions
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Every route change without a hash → always land at top
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const t = window.setTimeout(() => scrollToHash(hash, "smooth"), 30);
      return () => window.clearTimeout(t);
    }

    // Force top now and again after paint (beats layout / Next scroll quirks)
    forceScrollToTop();
    const raf = requestAnimationFrame(() => forceScrollToTop());
    const t1 = window.setTimeout(forceScrollToTop, 50);
    const t2 = window.setTimeout(forceScrollToTop, 150);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;

        // In-page hash (footer service anchors, etc.)
        if (url.pathname === window.location.pathname && url.hash) {
          e.preventDefault();
          window.history.pushState(null, "", url.pathname + url.hash);
          scrollToHash(url.hash, "smooth");
          return;
        }

        // Home (or same path) with no hash → always go to top
        if (!url.hash && url.pathname === window.location.pathname) {
          e.preventDefault();
          window.history.pushState(null, "", url.pathname);
          forceScrollToTop();
          return;
        }

        // Navigating to Home from another page: ensure hash is cleared
        if (url.pathname === "/" && !url.hash) {
          // Let Next.js route; pathname effect will force top.
          // Clear any leftover hash on the current URL before nav.
          if (window.location.hash) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
      } catch {
        // ignore
      }
    }

    function onHashChange() {
      if (window.location.hash) {
        scrollToHash(window.location.hash, "smooth");
      } else {
        forceScrollToTop();
      }
    }

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return null;
}
