"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import BrandLogo from "@/components/BrandLogo";
import { CLINIC_PHONE_DISPLAY, siteConfig, telLink, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";
import type { NavLink } from "@/lib/features";

/** Nav links come from the server layout (getNavLinks) so Pro pages appear only when switched on. */
export default function Header({ navLinks }: { navLinks: NavLink[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-[var(--color-border-light)]" style={{ background: "var(--color-header-bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.25rem] md:h-[4.75rem]">
          {/* Logo */}
          <Link
            href="/"
            scroll={true}
            className="flex items-center group min-w-0 mr-2"
            aria-label={`${siteConfig.brand.name} – home`}
          >
            <BrandLogo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                scroll={true}
                className="px-3.5 py-2 text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] rounded-lg hover:bg-[var(--color-bg)] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />
            <a
              href={telLink}
              className="hidden xl:flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {CLINIC_PHONE_DISPLAY}
            </a>
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.ask)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full transition-all shadow-sm"
            >
              WhatsApp
            </a>
            <Link
              href="/book"
              className="hidden md:inline-flex items-center gap-2 bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all shadow-[0_4px_14px_rgba(234,88,12,0.25)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.35)] hover:-translate-y-0.5"
            >
              Book Appointment
            </Link>

            <button
              type="button"
              className="lg:hidden p-2 rounded-xl text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden pb-5 border-t border-[var(--color-border-light)] max-h-[calc(100dvh-4.25rem)] overflow-y-auto overscroll-contain"
          >
            <nav className="flex flex-col gap-0.5 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  scroll={true}
                  className="px-3 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-light-teal)] rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={whatsappLink(WHATSAPP_MESSAGES.ask)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 mx-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-5 py-3 rounded-full"
                onClick={() => setMobileOpen(false)}
              >
                Message on WhatsApp
              </a>
              <Link
                href="/book"
                className="mt-2 mx-1 inline-flex items-center justify-center gap-2 bg-[var(--color-cta)] text-white text-sm font-semibold px-5 py-3 rounded-full"
                onClick={() => setMobileOpen(false)}
              >
                Book Appointment
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
