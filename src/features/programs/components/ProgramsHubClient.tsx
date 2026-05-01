"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PROGRAM_CARDS } from "@/features/home/home.content";
import type { Program } from "@/lib/models/Program";

type ProgramsHubClientProps = {
  programs: Program[];
};

function getProgramImage(programTitle: string) {
  const programCard = PROGRAM_CARDS.find(
    (card) => card.name.toLowerCase() === programTitle.toLowerCase(),
  );
  const fallbackIndex = programCard ? PROGRAM_CARDS.indexOf(programCard) : 0;
  return `/images/placeholders/${10 + (fallbackIndex % 6)}.png`;
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
        program.description.toLowerCase().includes(normalizedQuery) ||
        program.fullContent.toLowerCase().includes(normalizedQuery);

      return matchCategory && matchSearch;
    });
  }, [activeCategory, programs, query]);

  return (
    <section className="site-section" aria-labelledby="programs-hub-results-heading">
      <div className="site-toolbar">
        <div className="site-toolbar__row">
          <div>
            <p className="site-eyebrow">Programs directory</p>
            <h2 id="programs-hub-results-heading" className="site-heading site-heading--sm mt-3">
              Browse By Category
            </h2>
          </div>
          <span className="site-badge site-badge--muted">
            {filteredPrograms.length} results
          </span>
        </div>

        <div className="site-toolbar__search">
          <Search className="site-toolbar__icon" />
          <input
            id="program-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search programs"
            className="site-input"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`site-pill-button ${isActive ? "site-pill-button--active" : ""}`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="site-empty mt-6">
          No programs match that search. Try another keyword.
        </div>
      ) : (
        <div className="site-grid site-grid--three mt-6">
          {filteredPrograms.map((program) => (
            <article key={program.id} className="site-card site-card--rounded overflow-hidden">
              <div className="site-detail__media site-detail__media--landscape">
                <Image
                  src={getProgramImage(program.title)}
                  alt={program.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="site-card__body">
                <p className="site-card__eyebrow">{program.category}</p>
                <h3 className="site-card__title">{program.title}</h3>
                <p className="site-card__text">{program.description}</p>
                <Link href={`/programs/${program.slug}`} className="site-card-link mt-5">
                  View Program
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
