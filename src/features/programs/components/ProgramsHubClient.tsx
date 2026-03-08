"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import type { Program } from "@/lib/models/Program";
import { PROGRAM_CARDS } from "@/features/home/home.content";

type ProgramsHubClientProps = {
  programs: Program[];
};

// Helper function to get program icon/logo index based on title
function getProgramLogoIndex(programTitle: string): number {
  const programCard = PROGRAM_CARDS.find(
    (card) => card.name.toLowerCase() === programTitle.toLowerCase()
  );
  return programCard ? PROGRAM_CARDS.indexOf(programCard) : 0;
}

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
      className="mx-auto w-full max-w-screen-xl px-[5%] pb-20"
      aria-labelledby="programs-hub-controls-heading"
    >
      <h2 id="programs-hub-controls-heading" className="sr-only">
        Program filters and results
      </h2>
      <header className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 mt-10 shadow-sm">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-green" htmlFor="program-search">
          Search Programs
        </label>
        <input
          id="program-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by department or focus area"
          className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-psz-green/60 transition-colors"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all border ${
                  isActive
                    ? "bg-psz-green text-white border-psz-green"
                    : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50 hover:border-neutral-400"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredPrograms.map((program) => (
          <article
            key={program.id}
            className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-psz-green/30"
          >
            <div className="h-44 bg-neutral-50 p-6 flex flex-col items-center justify-center border-b border-neutral-100">
              <Image
                src={`/images/placeholders/${10 + getProgramLogoIndex(program.title)}.png`}
                alt={`${program.title} icon`}
                width={60}
                height={60}
                className="mb-3 opacity-80 group-hover:opacity-100 transition-opacity"
                quality={60}
              />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green/80 mt-3">
                {program.category}
              </p>
              <p className="mt-2 font-heading text-xl font-semibold text-neutral-900 text-center">{program.title}</p>
            </div>
            <div className="space-y-4 p-6">
              <p className="text-sm leading-relaxed text-neutral-500">
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
        <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-10 text-center text-sm text-neutral-400">
          No programs found for this filter. Try another category or search term.
        </div>
      ) : null}
    </section>
  );
}
