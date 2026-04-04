"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import type { Program } from "@/lib/models/Program";
import { PROGRAM_CARDS } from "@/features/home/home.content";

import styles from "./ProgramsHubClient.module.css";

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
      className={styles.section}
      aria-labelledby="programs-hub-controls-heading"
    >
      <h2 id="programs-hub-controls-heading" className="sr-only">
        Program filters and results
      </h2>
      <header className={styles.controls}>
        <label className={styles.searchLabel} htmlFor="program-search">
          Search Programs
        </label>
        <input
          id="program-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by department or focus area"
          className={styles.searchInput}
        />

        <div className={styles.categoryRow}>
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`${styles.categoryButton} ${isActive ? styles.categoryButtonActive : ""}`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </header>

      <div className={styles.grid}>
        {filteredPrograms.map((program, index) => (
          <article
            key={program.id}
            className={`${styles.card} ${styles[`tone${(index % 5) + 1}` as const]}`}
          >
            <div className={styles.cardVisual}>
              <Image
                src={`/images/placeholders/${10 + getProgramLogoIndex(program.title)}.png`}
                alt={`${program.title} icon`}
                width={74}
                height={74}
                className={styles.cardImage}
                quality={60}
              />
              <p className={styles.cardCategory}>
                {program.category}
              </p>
              <p className={styles.cardTitle}>{program.title}</p>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardDescription}>
                {program.description}
              </p>
              <Link
                href={`/programs/${program.slug}`}
                className={styles.cardLink}
              >
                Explore Program
                <ArrowRight className={styles.cardLinkIcon} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredPrograms.length === 0 ? (
        <div className={styles.emptyState}>
          No programs found for this filter. Try another category or search term.
        </div>
      ) : null}
    </section>
  );
}
