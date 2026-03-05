"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

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
      <header className="rounded-3xl glass-strong p-5 sm:p-6 mt-10">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-green" htmlFor="program-search">
          Search Programs
        </label>
        <input
          id="program-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by department or focus area"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-psz-gray-600 focus:border-psz-green/40 transition-colors"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all ${
                  isActive
                    ? "bg-psz-green text-white"
                    : "border border-white/10 bg-white/5 text-psz-gray-300 hover:bg-white/10 hover:text-white"
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
            className="group overflow-hidden rounded-3xl glass transition-all hover:border-psz-green/20"
          >
            <div className="h-40 bg-gradient-to-br from-psz-green/15 via-psz-green/5 to-transparent p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
                {program.category}
              </p>
              <p className="mt-7 font-heading text-2xl font-semibold text-white">{program.title}</p>
            </div>
            <div className="space-y-4 p-5">
              <p className="text-sm leading-relaxed text-psz-gray-400">
                {program.description}
              </p>
              <Link
                href={`/programs/${program.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-psz-green hover:text-psz-green-light transition-colors"
              >
                Explore Program
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 glass px-5 py-8 text-center text-sm text-psz-gray-400">
          No programs found for this filter. Try another category or search term.
        </div>
      ) : null}
    </section>
  );
}
