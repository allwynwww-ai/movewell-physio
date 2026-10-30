"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { siteConfig, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";

const faqs = siteConfig.faq;

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      setHeight(el.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen, item.a]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (isOpen) setHeight(el.scrollHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-light)] rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[var(--color-secondary)] text-[15px]">
          {item.q}
        </span>
        <span
          className={`w-8 h-8 rounded-full bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center shrink-0 transition-transform duration-300 ease-out cursor-pointer ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>

      <div
        style={{ height }}
        className="overflow-hidden transition-[height] duration-300 ease-out"
      >
        <div
          ref={contentRef}
          className={`px-5 pb-5 text-sm text-[var(--color-text-muted)] leading-relaxed transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {item.a}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20 bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-label mb-3">FAQ</p>
          <h2 className="heading-display text-3xl md:text-4xl mb-3">
            Have questions? We&apos;re here to help.
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Common questions about physiotherapy at {siteConfig.brand.name}.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-light-teal)] border border-[var(--color-primary)]/10">
          <p className="text-sm font-medium text-[var(--color-secondary)] text-center sm:text-left">
            Still have questions? WhatsApp is the fastest way to reach us.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.ask)}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn px-5 py-2.5 text-sm bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              WhatsApp
            </a>
            <Link
              href="/contact"
              className="premium-btn premium-btn-secondary px-5 py-2.5 text-sm"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
