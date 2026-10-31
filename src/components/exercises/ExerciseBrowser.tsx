"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ExerciseImage from "./ExerciseImage";
import BodyAreaIcon from "@/components/exercises/BodyAreaIcon";
import { areaId, type BodyArea, type Exercise } from "@/content/exercises";

type Props = { exercises: Exercise[]; areas: BodyArea[] };

/** Exercise cards with a body-area filter. The choice is kept in the URL hash (#knee) so it can be shared. */
export default function ExerciseBrowser({ exercises, areas }: Props) {
  const [area, setArea] = useState<string>("all");

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "");
      setArea(areas.some((a) => areaId(a) === h) ? h : "all");
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [areas]);

  const choose = (id: string) => {
    setArea(id);
    const url = id === "all" ? window.location.pathname : `${window.location.pathname}#${id}`;
    window.history.replaceState(null, "", url);
  };

  const shown = area === "all" ? exercises : exercises.filter((e) => areaId(e.bodyArea) === area);
  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
      active
        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white dark:text-[#0B1220]"
        : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
    }`;

  return (
    <div>
      <div role="group" aria-label="Filter by body area" className="flex flex-wrap gap-2 mb-8" data-testid="exercise-filter">
        <button type="button" className={chip(area === "all")} aria-pressed={area === "all"} onClick={() => choose("all")}>
          All
        </button>
        {areas.map((a) => (
          <button key={a} type="button" className={chip(area === areaId(a))} aria-pressed={area === areaId(a)} onClick={() => choose(areaId(a))}>
            {a}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "exercise" : "exercises"}
      </p>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((ex) => (
          <li key={ex.slug} data-testid="exercise-card" data-area={areaId(ex.bodyArea)}>
            <Link href={`/exercises/${ex.slug}`} className="premium-card overflow-hidden flex flex-col h-full group">
              {ex.image && <ExerciseImage image={ex.image} variant="thumb" />}
              <div className="p-6 flex flex-col flex-1">
                <div className={`flex items-start gap-3 mb-5 ${ex.image ? "justify-start" : "justify-between"}`}>
                  {!ex.image && (
                    <div data-testid="exercise-icon" className="w-12 h-12 rounded-xl bg-[var(--color-light-teal)] text-[var(--color-primary)] flex items-center justify-center">
                      <BodyAreaIcon area={ex.bodyArea} className="w-7 h-7" />
                    </div>
                  )}
                  <div className={`flex flex-wrap gap-1.5 ${ex.image ? "justify-start" : "justify-end"}`}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                      {ex.bodyArea}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[var(--color-soft-coral)] text-[var(--color-cta)]">
                      {ex.difficulty}
                    </span>
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-secondary)] tracking-tight mb-2">{ex.title}</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5">{ex.summary}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] group-hover:gap-2 transition-all">
                  View steps
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
