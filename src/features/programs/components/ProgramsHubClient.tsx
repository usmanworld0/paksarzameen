"use client";

import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import type { Program } from "@/lib/models/Program";
import { PROGRAM_CARDS } from "@/features/home/home.content";

import styles from "./ProgramsHubClient.module.css";

type ProgramsHubClientProps = {
  programs: Program[];
};

const ORBIT_POINTS = [
  { top: "1%", right: "18%", shift: "0rem", delay: "0ms", rotate: "-10deg" },
  { top: "17%", right: "10%", shift: "5.1rem", delay: "120ms", rotate: "6deg" },
  { top: "34%", right: "2%", shift: "9.2rem", delay: "220ms", rotate: "12deg" },
  { top: "53%", right: "2%", shift: "9.2rem", delay: "320ms", rotate: "-10deg" },
  { top: "71%", right: "10%", shift: "5.1rem", delay: "420ms", rotate: "5deg" },
  { top: "88%", right: "18%", shift: "0rem", delay: "520ms", rotate: "10deg" },
] as const;

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

  const orbitPrograms = useMemo(() => {
    if (filteredPrograms.length === 0) {
      return [] as Program[];
    }
    return filteredPrograms.slice(0, ORBIT_POINTS.length);
  }, [filteredPrograms]);

  return (
    <section
      className={styles.section}
      aria-labelledby="programs-hub-heading"
    >
      <div className={styles.heroWrap}>
        <header className={styles.heroContent}>
          <p className={styles.eyebrow}>Programs Hub</p>
          <h1 id="programs-hub-heading" className={styles.title}>
            PakSarZameen Projects And Programs
          </h1>
          <p className={styles.description}>
            Explore our community development programs in education, health,
            environmental action, animal welfare, women empowerment, and social
            care. Filter by category and follow the areas where PSZ is working
            on the ground.
          </p>

          <div className={styles.controls}>
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
          </div>
        </header>

        <div className={styles.heroOrbit} aria-live="polite">
          <div className={styles.heroOrbitGlow} />
          <div className={styles.heroOrbitRing} />

          {orbitPrograms.length > 0 ? (
            orbitPrograms.map((program, index) => (
              <Link
                href={`/programs/${program.slug}`}
                key={program.id}
                className={`${styles.heroOrbitItem} ${styles[`tone${(index % 5) + 1}` as const]}`}
                style={
                  {
                        top: ORBIT_POINTS[index].top,
                        right: ORBIT_POINTS[index].right,
                        ["--orbit-shift" as string]: ORBIT_POINTS[index].shift,
                        ["--orbit-delay" as string]: ORBIT_POINTS[index].delay,
                        ["--orbit-rotate" as string]: ORBIT_POINTS[index].rotate,
                  } as CSSProperties
                }
              >
                <div className={styles.heroOrbitBadge}>
                  <Image
                    src={`/images/placeholders/${10 + getProgramLogoIndex(program.title)}.png`}
                    alt={`${program.title} logo`}
                    fill
                    sizes="160px"
                    className={styles.heroOrbitImage}
                    quality={60}
                  />
                </div>
                <div className={styles.heroOrbitText}>
                  <p>{program.title}</p>
                  <span>{program.category}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              No programs found for this filter. Try another category or search term.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
