"use client";

import { useRef, useState, useCallback, useEffect } from "react";

type ComparisonSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  captionBefore?: string;
  captionAfter?: string;
  className?: string;
};

export default function ComparisonSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeLabel = "Before",
  afterLabel = "After",
  captionBefore,
  captionAfter,
  className = "",
}: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, x)));
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging.current) return;
      if ("touches" in e) e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX);
    }
    function onUp() {
      dragging.current = false;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [updateFromClientX]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden select-none border border-[var(--color-border-light)] shadow-sm bg-slate-100 cursor-ew-resize"
        onMouseDown={(e) => {
          dragging.current = true;
          updateFromClientX(e.clientX);
        }}
        onTouchStart={(e) => {
          dragging.current = true;
          updateFromClientX(e.touches[0].clientX);
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-label="Before and after comparison"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
        }}
      >
        {/* After — full image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt={afterAlt}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Before — clipped with clip-path */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          draggable={false}
        />

        {/* Divider line + handle */}
        <div
          className="absolute top-0 bottom-0 z-10 pointer-events-none"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-0.5 h-full bg-white/95 shadow-[0_0_10px_rgba(0,0,0,0.35)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-primary)] text-white shadow-lg flex items-center justify-center border-[3px] border-white pointer-events-auto">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
            </svg>
          </div>
        </div>

        <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/60 text-white backdrop-blur-sm">
          {beforeLabel}
        </span>
        <span className="absolute top-3 right-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--color-primary)] text-white shadow-sm">
          {afterLabel}
        </span>
      </div>

      {(captionBefore || captionAfter) && (
        <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
          {captionBefore && (
            <p className="text-[var(--color-text-muted)] leading-snug">
              <span className="font-semibold text-[var(--color-secondary)]">Before: </span>
              {captionBefore}
            </p>
          )}
          {captionAfter && (
            <p className="text-[var(--color-text-muted)] leading-snug">
              <span className="font-semibold text-[var(--color-primary)]">After: </span>
              {captionAfter}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
