"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { dummyUniversities } from "@/data/universities";
import { TunnelHero } from "./TunnelHero";
import styles from "./CounsellingClient.module.css";

export function CounsellingClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedStudyLevel, setSelectedStudyLevel] = useState("All");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [sortBy, setSortBy] = useState("alphabetical");

  const countries = useMemo(() => {
    const all = dummyUniversities.map((u) => u.country);
    return ["All", ...Array.from(new Set(all))];
  }, []);

  const filteredUniversities = useMemo(() => {
    let result = [...dummyUniversities];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((u) => u.name.toLowerCase().includes(term));
    }

    if (selectedCountry !== "All") {
      result = result.filter((u) => u.country === selectedCountry);
    }

    if (selectedStudyLevel !== "All") {
      const level = selectedStudyLevel.toLowerCase();
      result = result.filter((u) => {
        if (level === "undergraduate") return u.programs.undergraduate.length > 0;
        if (level === "masters") return u.programs.masters.length > 0;
        if (level === "phd") return u.programs.phd.length > 0;
        return true;
      });
    }

    if (scholarshipOnly) {
      result = result.filter((u) => u.scholarships.available);
    }

    if (sortBy === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "ranking") {
      result.sort((a, b) => Number(a.ranking.world) - Number(b.ranking.world));
    }

    return result;
  }, [searchTerm, selectedCountry, selectedStudyLevel, scholarshipOnly, sortBy]);

  return (
    <div className={styles.wrapper}>
      <TunnelHero universities={dummyUniversities} />

      <section id="search-section" className={styles.searchSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Portal</span>
          <h2>Explore Universities</h2>
          <p>Filter through world-leading international institutions and find your next academic home.</p>
        </div>

        <div className={styles.filterPanel}>
          <div className={styles.searchGroup}>
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Search by university name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.dropdownsGrid}>
            <div className={styles.filterGroup}>
              <label htmlFor="country-filter">Country</label>
              <select
                id="country-filter"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className={styles.selectInput}
              >
                {countries.map((c) => (
                  <option key={`country-${c}`} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="level-filter">Study Level</label>
              <select
                id="level-filter"
                value={selectedStudyLevel}
                onChange={(e) => setSelectedStudyLevel(e.target.value)}
                className={styles.selectInput}
              >
                <option value="All">All Levels</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Masters">Master&apos;s</option>
                <option value="PhD">Ph.D.</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="sort-filter">Sort By</label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.selectInput}
              >
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="ranking">World Rank (QS)</option>
              </select>
            </div>
          </div>

          <div className={styles.toggleGroup}>
            <label className={styles.switchLabel}>
              <input
                type="checkbox"
                checked={scholarshipOnly}
                onChange={(e) => setScholarshipOnly(e.target.checked)}
                className={styles.switchInput}
              />
              <span className={styles.switchCustom} />
              <span className={styles.switchText}>Scholarships Available</span>
            </label>
          </div>
        </div>

        <div className={styles.resultsBar}>
          <p>
            Showing <strong>{filteredUniversities.length}</strong> {filteredUniversities.length === 1 ? "university" : "universities"}
          </p>
        </div>

        {filteredUniversities.length > 0 ? (
          <div className={styles.universityGrid}>
            {filteredUniversities.map((uni) => (
              <div key={uni.slug} className={styles.uniCard}>
                <div className={styles.cardCover} style={{ background: uni.logo }}>
                  <div className={styles.logoBadgeBig}>
                    {uni.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardCountry}>📍 {uni.country}</span>
                    <span className={styles.cardRank}>🏆 QS #{uni.ranking.qs}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{uni.name}</h3>

                  <p className={styles.cardAbout}>
                    {uni.overview.about.length > 120
                      ? `${uni.overview.about.substring(0, 117)}...`
                      : uni.overview.about}
                  </p>

                  <div className={styles.cardPrograms}>
                    <strong>Popular Programs:</strong>
                    <div className={styles.programTags}>
                      {uni.programs.undergraduate.slice(0, 2).map((p) => (
                        <span key={p} className={styles.progTag}>
                          {p}
                        </span>
                      ))}
                      {uni.programs.masters.slice(0, 1).map((p) => (
                        <span key={p} className={styles.progTag}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    {uni.scholarships.available && (
                      <span className={styles.scholarshipEligible}>
                        🎓 Scholarships Available
                      </span>
                    )}
                    <Link
                      href={`/universities/${uni.slug}`}
                      className={styles.detailsBtn}
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <h3>No Universities Found</h3>
            <p>Try adjusting your search criteria, checking spelling, or clearing filters.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCountry("All");
                setSelectedStudyLevel("All");
                setScholarshipOnly(false);
                setSortBy("alphabetical");
              }}
              className={styles.resetBtn}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
