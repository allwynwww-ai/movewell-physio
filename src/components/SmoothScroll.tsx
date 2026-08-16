"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HEADER_OFFSET = 96; // sticky header height + breathing room

function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth") {
  if (!hash || hash === "#") return;
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

export default function SmoothScroll() {
  const pathname = usePathname();

  // On route change or initial load with a hash
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    // Wait a tick for the new page content to paint
    const t = window.setTimeout(() => scrollToHash(hash, "smooth"), 80);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // Handle in-page hash clicks (same route)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a[href*='#']") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only handle same-page or absolute path hashes that match current path
      try {
        const url = new URL(href, window.location.origin);
        if (url.pathname !== window.location.pathname) return;
        if (!url.hash) return;

        e.preventDefault();
        // Update URL without full navigation
        window.history.pushState(null, "", url.hash);
        scrollToHash(url.hash, "smooth");
      } catch {
        // ignore invalid URLs
      }
    }

    function onHashChange() {
      scrollToHash(window.location.hash, "smooth");
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
