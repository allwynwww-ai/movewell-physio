"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
};

function format(value: number, decimals: number) {
  return decimals > 0
    ? value.toFixed(decimals)
    : Math.floor(value).toLocaleString("en-IN");
}

/**
 * Renders the FINAL value on the server and on first paint (so crawlers,
 * no-JS visitors and screenshots always see real numbers). When the counter
 * scrolls into view, it replays a short count-up as progressive enhancement —
 * skipped entirely for users who prefer reduced motion.
 */
export default function AnimatedCounter({
  end,
  duration = 1600,
  suffix = "",
  prefix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const [value, setValue] = useState(end);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // Only animate counters that start below the fold; anything already
    // visible at load keeps its final value (no flash to 0).
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    let frame = 0;
    let done = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done) return;
        done = true;
        observer.disconnect();
        const startTime = performance.now();
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          setValue(end * easeOutCubic(progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
          else setValue(end);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      setValue(end);
    };
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {prefix}
        {format(value, decimals)}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {format(end, decimals)}
        {suffix}
      </span>
    </span>
  );
}
