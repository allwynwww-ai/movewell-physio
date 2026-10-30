"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { siteConfig } from "@/site.config";

function initialsOf(name: string): string {
  const words = name.replace(/[^\p{L}\s]/gu, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const testimonials = siteConfig.testimonials.map((t) => ({
  ...t,
  initials: initialsOf(t.name),
}));
const showSampleTag = siteConfig.showSampleNotice;

function getPerView() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function Stars({ rating = 5 }: { rating?: number }) {
  const count = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex gap-1 text-amber-400 mb-4" aria-label={`${count} out of 5 stars`}>
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsCarousel() {
  const [perView, setPerView] = useState(3);
  const [rawIndex, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const dragRef = useRef(0);

  useEffect(() => {
    function onResize() {
      setPerView(getPerView());
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - perView);

  // Clamp when the number of cards per view changes (derived, no effect needed)
  const index = Math.min(rawIndex, maxIndex);

  const goTo = useCallback(
    (next: number) => {
      const wrapped = ((next % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
      setIndex(wrapped);
    },
    [maxIndex]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  function onPointerDown(clientX: number) {
    setIsDragging(true);
    startXRef.current = clientX;
    dragRef.current = 0;
    setDrag(0);
  }

  function onPointerMove(clientX: number) {
    if (startXRef.current == null) return;
    const dx = clientX - startXRef.current;
    dragRef.current = dx;
    setDrag(dx);
  }

  function onPointerUp() {
    if (startXRef.current == null) return;
    const threshold = 70;
    if (dragRef.current > threshold) goTo(index - 1);
    else if (dragRef.current < -threshold) goTo(index + 1);
    setIsDragging(false);
    startXRef.current = null;
    dragRef.current = 0;
    setDrag(0);
  }

  const slidePct = 100 / perView;
  const offsetPct = -(index * slidePct);

  return (
    <div className="relative select-none">
      <div className="flex items-stretch gap-3 md:gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous testimonials"
          className="shrink-0 self-center w-11 h-11 rounded-full bg-[var(--color-primary)] text-white shadow-md hover:bg-[var(--color-primary-dark)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          className="flex-1 min-w-0 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => onPointerDown(e.clientX)}
          onMouseMove={(e) => onPointerMove(e.clientX)}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={(e) => onPointerDown(e.changedTouches[0].clientX)}
          onTouchMove={(e) => onPointerMove(e.changedTouches[0].clientX)}
          onTouchEnd={onPointerUp}
        >
          <div
            className={isDragging ? "" : "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"}
            style={{
              display: "flex",
              transform: `translateX(calc(${offsetPct}% + ${isDragging ? drag : 0}px))`,
            }}
          >
            {testimonials.map((t) => (
              <article
                key={`${t.name}-${t.detail}`}
                className="px-2.5 box-border"
                style={{ flex: `0 0 ${slidePct}%`, maxWidth: `${slidePct}%` }}
              >
                <div className="premium-card p-6 md:p-7 flex flex-col h-full min-h-[260px] transition-transform duration-500 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <Stars rating={t.rating} />
                    {showSampleTag && t.isSample && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full px-2 py-0.5">
                        Sample
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--color-text)] leading-relaxed mb-6 flex-1 text-[15px]">
                    “{t.quote}”
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-11 h-11 rounded-full bg-[var(--color-light-teal)] flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-secondary)] text-sm tracking-tight">
                        {t.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">{t.detail}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next testimonials"
          className="shrink-0 self-center w-11 h-11 rounded-full bg-[var(--color-primary)] text-white shadow-md hover:bg-[var(--color-primary-dark)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
              i === index
                ? "w-7 bg-[var(--color-primary)]"
                : "w-2 bg-[var(--color-border)] hover:bg-[var(--color-primary)]/40"
            }`}
          />
        ))}
      </div>

      <p className="text-center text-xs text-[var(--color-text-muted)] mt-3">
        {index + 1}–{Math.min(index + perView, testimonials.length)} of {testimonials.length} {showSampleTag && testimonials.some((t) => t.isSample) ? "sample reviews" : "reviews"}
      </p>
    </div>
  );
}
