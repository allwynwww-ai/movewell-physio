"use client";

import { useState } from "react";

const testimonials = [
  // Section 1
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
  // Section 2
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
  // Section 3
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

const PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(testimonials.length / PER_PAGE);

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
  const [page, setPage] = useState(0);

  const start = page * PER_PAGE;
  const visible = testimonials.slice(start, start + PER_PAGE);

  function goPrev() {
    setPage((p) => (p === 0 ? TOTAL_PAGES - 1 : p - 1));
  }

  function goNext() {
    setPage((p) => (p === TOTAL_PAGES - 1 ? 0 : p + 1));
  }

  return (
    <div>
      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {visible.map((t) => (
          <article
            key={`${t.name}-${t.detail}`}
            className="premium-card p-7 flex flex-col"
          >
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
          </article>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous testimonials"
          className="w-11 h-11 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-secondary)] hover:bg-[var(--color-light-teal)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] transition-all flex items-center justify-center shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Go to section ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === page
                  ? "w-6 bg-[var(--color-primary)]"
                  : "w-2 bg-[var(--color-border)] hover:bg-[var(--color-primary)]/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next testimonials"
          className="w-11 h-11 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-secondary)] hover:bg-[var(--color-light-teal)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] transition-all flex items-center justify-center shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
        Section {page + 1} of {TOTAL_PAGES} · {testimonials.length} reviews
      </p>
    </div>
  );
}
