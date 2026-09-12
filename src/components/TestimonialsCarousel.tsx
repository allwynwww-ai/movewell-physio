"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const testimonials = [
  {
    quote:
      "Emily is amazing! She listened, explained everything clearly, and helped me get back to running pain-free after months of struggling with knee pain. Highly recommend.",
    name: "James T.",
    detail: "Runner · Knee Injury",
    initials: "JT",
  },
  {
    quote:
      "Professional, friendly and effective treatment. After my shoulder surgery, the rehab plan was clear and progressive. I’m back to full strength much faster than expected.",
    name: "Sarah L.",
    detail: "Post-Surgical Rehab",
    initials: "SL",
  },
  {
    quote:
      "I finally have relief from years of neck pain. Life-changing care. Emily took the time to understand my desk setup and gave practical advice I still use every day.",
    name: "Michael D.",
    detail: "Office Worker · Neck Pain",
    initials: "MD",
  },
  {
    quote:
      "As a new mum dealing with pelvic floor issues, I felt completely supported. The treatment was private, respectful and effective. I’m so grateful.",
    name: "Anita K.",
    detail: "Pelvic Floor Therapy",
    initials: "AK",
  },
  {
    quote:
      "Best physio experience I’ve had. Clear communication, hands-on treatment, and a home exercise program that actually worked. Back pain is finally under control.",
    name: "Rohan P.",
    detail: "Lower Back Pain",
    initials: "RP",
  },
  {
    quote:
      "I came in with dizziness and balance issues. After a few sessions the vertigo settled and I feel steady on my feet again. Truly life-changing.",
    name: "Linda W.",
    detail: "Vestibular & Balance",
    initials: "LW",
  },
  {
    quote:
      "My frozen shoulder had limited me for almost a year. The progressive treatment plan and careful hands-on work restored movement I thought I’d lost for good.",
    name: "Suresh M.",
    detail: "Frozen Shoulder",
    initials: "SM",
  },
  {
    quote:
      "Excellent care after my ACL reconstruction. Every session was structured, motivating, and focused on getting me back to cricket safely.",
    name: "Arjun S.",
    detail: "ACL Rehab · Sports",
    initials: "AS",
  },
  {
    quote:
      "I work long hours at a desk and had constant upper back tightness. Within a few visits the pain reduced and I learnt exercises that keep me comfortable at work.",
    name: "Priya N.",
    detail: "Desk Worker · Upper Back",
    initials: "PN",
  },
  {
    quote:
      "Very thorough assessment and clear explanation of what was wrong. The treatment for my tennis elbow helped me return to my weekend matches without fear.",
    name: "Vikram R.",
    detail: "Tennis Elbow",
    initials: "VR",
  },
  {
    quote:
      "Post-pregnancy, I struggled with lower back and pelvic discomfort. The support and guidance I received here made a real difference to my recovery.",
    name: "Meera J.",
    detail: "Postnatal Care",
    initials: "MJ",
  },
  {
    quote:
      "I had chronic plantar fasciitis that affected my morning walks. The combination of treatment and a simple home routine has me walking pain-free again.",
    name: "Deepak H.",
    detail: "Plantar Fasciitis",
    initials: "DH",
  },
  {
    quote:
      "After a road accident I needed careful rehab for my wrist and shoulder. The progress was tracked clearly and I regained strength faster than expected.",
    name: "Kavita B.",
    detail: "Post-Trauma Rehab",
    initials: "KB",
  },
  {
    quote:
      "My elderly father was unsteady on his feet. The balance training sessions improved his confidence and reduced our worry about falls at home.",
    name: "Nikhil G.",
    detail: "Balance · Elderly Care",
    initials: "NG",
  },
  {
    quote:
      "Sciatica pain had me struggling to sit through meetings. Targeted treatment and posture advice changed that — I can work a full day without constant discomfort.",
    name: "Ayesha F.",
    detail: "Sciatica",
    initials: "AF",
  },
  {
    quote:
      "As a gym trainer I needed precise rehab after a lower back strain. The plan was practical, sport-aware, and got me lifting safely again.",
    name: "Imran Q.",
    detail: "Gym Injury · Back",
    initials: "IQ",
  },
  {
    quote:
      "I appreciated the honest timelines and realistic goals. My knee osteoarthritis is managed much better and I can enjoy my evening walks again.",
    name: "Sunita D.",
    detail: "Knee Osteoarthritis",
    initials: "SD",
  },
  {
    quote:
      "Friendly clinic, on-time appointments, and treatment that actually works. My neck mobility is better than it has been in years.",
    name: "Rajesh V.",
    detail: "Chronic Neck Stiffness",
    initials: "RV",
  },
];

function getPerView() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function Stars() {
  return (
    <div className="flex gap-1 text-amber-400 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsCarousel() {
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0);
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

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

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
                  <Stars />
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
        {index + 1}–{Math.min(index + perView, testimonials.length)} of {testimonials.length} reviews
      </p>
    </div>
  );
}
