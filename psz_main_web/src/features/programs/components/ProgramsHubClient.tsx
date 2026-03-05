"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Program } from "@/lib/models/Program";

type ProgramsHubClientProps = {
  programs: Program[];
};

export function ProgramsHubClient({ programs }: ProgramsHubClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(programs.map((program) => program.category))],
    [programs],
  );

  const filteredPrograms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return programs.filter((program) => {
      const matchCategory =
        activeCategory === "All" || program.category === activeCategory;
      const matchSearch =
        normalizedQuery.length === 0 ||
        program.title.toLowerCase().includes(normalizedQuery) ||
        program.description.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, programs, query]);

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
      aria-labelledby="programs-hub-controls-heading"
    >
      <h2 id="programs-hub-controls-heading" className="sr-only">
        Program filters and results
      </h2>
      <header className="rounded-3xl border border-psz-forest/10 bg-white/85 p-5 shadow-panel sm:p-6">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-olive" htmlFor="program-search">
          Search Programs
        </label>
        <input
          id="program-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by department or focus area"
          className="mt-2 w-full rounded-2xl border border-psz-forest/15 bg-white px-4 py-3 text-sm text-psz-charcoal outline-none ring-0 placeholder:text-psz-charcoal/45 focus:border-psz-olive"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                  isActive
                    ? "bg-psz-forest text-psz-cream"
                    : "border border-psz-forest/20 bg-white text-psz-forest hover:bg-psz-forest/10"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredPrograms.map((program) => (
          <article
            key={program.id}
            className="overflow-hidden rounded-3xl border border-psz-forest/10 bg-white shadow-panel"
          >
            <div className="h-40 bg-[linear-gradient(135deg,#1f3b2d,#4d6a57)] p-5 text-psz-cream">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-sand">
                {program.category}
              </p>
              <p className="mt-7 font-heading text-2xl">{program.title}</p>
            </div>
            <div className="space-y-4 p-5">
              <p className="text-sm leading-relaxed text-psz-charcoal/80">
                {program.description}
              </p>
              <Link
                href={`/programs/${program.slug}`}
                className="inline-flex items-center text-sm font-semibold text-psz-forest hover:text-psz-olive"
              >
                Explore Program
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-psz-forest/20 bg-white/80 px-5 py-8 text-center text-sm text-psz-charcoal/70">
          No programs found for this filter. Try another category or search term.
        </div>
      ) : null}
    </section>
  );
}
