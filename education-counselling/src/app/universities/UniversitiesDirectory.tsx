"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  AlertCircle,
  X,
} from "lucide-react";
import { ExtendedUniversity } from "@/lib/db";

interface UniversitiesDirectoryProps {
  initialUniversities: ExtendedUniversity[];
}

export function UniversitiesDirectory({ initialUniversities }: UniversitiesDirectoryProps) {
  const searchParams = useSearchParams();

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedField, setSelectedField] = useState<string>("All");
  const [selectedTuition, setSelectedTuition] = useState<string>("All");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [selectedEnglish, setSelectedEnglish] = useState<string>("All");

  useEffect(() => {
    const urlQuery = searchParams.get("search");
    if (urlQuery) setSearch(urlQuery);
    const countryQuery = searchParams.get("country");
    if (countryQuery) setSelectedCountry(countryQuery);
    const levelQuery = searchParams.get("level");
    if (levelQuery) setSelectedLevel(levelQuery);
  }, [searchParams]);

  const countries = ["All", "United States", "United Kingdom", "Canada", "Australia", "Europe"];
  const fields = ["All", "Computer Science", "Economics", "Engineering", "Business", "Public Policy", "Medicine"];

  const filteredUniversities = useMemo(() => {
    return initialUniversities.filter((uni) => {
      // 1. Search Query
      if (search.trim() !== "") {
        const query = search.toLowerCase();
        const matchesName = uni.name.toLowerCase().includes(query);
        const matchesCountry = uni.country.toLowerCase().includes(query);
        const matchesProgram = [
          ...(uni.programs?.undergraduate || []),
          ...(uni.programs?.masters || []),
          ...(uni.programs?.phd || []),
        ].some((prog) => prog.toLowerCase().includes(query));

        if (!matchesName && !matchesCountry && !matchesProgram) return false;
      }

      // 2. Country Filter
      if (selectedCountry !== "All" && uni.country !== selectedCountry) {
        return false;
      }

      // 3. Study Level Filter
      if (selectedLevel !== "All") {
        const level = selectedLevel.toLowerCase();
        if (level === "undergraduate" && (!uni.programs?.undergraduate || uni.programs.undergraduate.length === 0)) return false;
        if (level === "graduate" && (!uni.programs?.masters || uni.programs.masters.length === 0) && (!uni.programs?.phd || uni.programs.phd.length === 0)) return false;
      }

      // 4. Field of Study Filter
      if (selectedField !== "All") {
        const field = selectedField.toLowerCase();
        const hasUndergradField = (uni.programs?.undergraduate || []).some((p) => p.toLowerCase().includes(field));
        const hasGradField = (uni.programs?.masters || []).some((p) => p.toLowerCase().includes(field));
        const hasPhdField = (uni.programs?.phd || []).some((p) => p.toLowerCase().includes(field));
        if (!hasUndergradField && !hasGradField && !hasPhdField) return false;
      }

      // 5. Tuition Range Filter
      if (selectedTuition !== "All") {
        const tuitionStr = uni.fees?.tuition || "";
        const numericTuition = parseInt(tuitionStr.replace(/[^0-9]/g, ""), 10) || 0;

        if (selectedTuition === "under-25k" && numericTuition > 25000) return false;
        if (selectedTuition === "25k-45k" && (numericTuition < 25000 || numericTuition > 45000)) return false;
        if (selectedTuition === "over-45k" && numericTuition < 45000) return false;
      }

      // 6. Scholarships Filter
      if (scholarshipOnly && !uni.scholarships?.available) {
        return false;
      }

      // 7. English Language
      if (selectedEnglish !== "All") {
        const score = parseFloat(uni.undergradRequirements?.english?.replace(/[^0-9.]/g, "") || "0");
        if (selectedEnglish === "ielts-7" && score > 7.0) return false;
        if (selectedEnglish === "ielts-7.5" && score < 7.5) return false;
      }

      return true;
    });
  }, [initialUniversities, search, selectedCountry, selectedLevel, selectedField, selectedTuition, scholarshipOnly, selectedEnglish]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCountry("All");
    setSelectedLevel("All");
    setSelectedField("All");
    setSelectedTuition("All");
    setScholarshipOnly(false);
    setSelectedEnglish("All");
  };

  return (
    <div className="w-full pt-[88px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-10 sm:py-16 space-y-10">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-8 space-y-2">
          <p className="store-kicker">Academic Directory</p>
          <h1 className="store-heading">Featured Global Universities</h1>
          <p className="store-subheading max-w-2xl">
            Search and evaluate international institutions by admission criteria, tuition budget, and scholarship opportunities.
          </p>
        </div>

        {/* INFORMATIONAL PARTNERSHIP NOTICE */}
        <div className="store-panel rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-neutral-600 leading-relaxed">
          <AlertCircle className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-normal text-neutral-950">Informational Notice:</strong> Universities listed on this directory are provided for academic guidance and research. PakSarZameen facilitates independent profile development and essay mentoring; listing does not imply an exclusive commercial partnership.
          </div>
        </div>

        {/* DIRECTORY GRID (FILTERS + RESULTS) */}
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] items-start">
          
          {/* FILTER BOARD */}
          <aside className="store-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-black/6 pb-4">
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-950 font-normal flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                Filters
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[10px] uppercase tracking-wider text-neutral-400 hover:text-black transition"
              >
                Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 block">Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="University or major..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="store-control pl-9 text-xs h-10"
                />
              </div>
            </div>

            {/* Country Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 block">Destination</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="store-control text-xs h-10 font-normal"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Study Level */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 block">Program Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="store-control text-xs h-10 font-normal"
              >
                <option value="All">All Program Levels</option>
                <option value="Undergraduate">Undergraduate (Bachelors)</option>
                <option value="Graduate">Graduate (Masters / PhD)</option>
              </select>
            </div>

            {/* Field of Study */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 block">Field of Study</label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="store-control text-xs h-10 font-normal"
              >
                {fields.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Tuition Range */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 block">Estimated Tuition</label>
              <select
                value={selectedTuition}
                onChange={(e) => setSelectedTuition(e.target.value)}
                className="store-control text-xs h-10 font-normal"
              >
                <option value="All">Any Tuition Range</option>
                <option value="under-25k">Under $25,000 / year</option>
                <option value="25k-45k">$25,000 - $45,000 / year</option>
                <option value="over-45k">Over $45,000 / year</option>
              </select>
            </div>

            {/* English Requirement */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 block">Language Standard</label>
              <select
                value={selectedEnglish}
                onChange={(e) => setSelectedEnglish(e.target.value)}
                className="store-control text-xs h-10 font-normal"
              >
                <option value="All">Any Score</option>
                <option value="ielts-7">IELTS 7.0 or below</option>
                <option value="ielts-7.5">IELTS 7.5 or higher</option>
              </select>
            </div>

            {/* Scholarships Checkbox */}
            <div className="flex items-center gap-2.5 pt-3 border-t border-black/6">
              <input
                type="checkbox"
                id="scholarship-check"
                checked={scholarshipOnly}
                onChange={(e) => setScholarshipOnly(e.target.checked)}
                className="h-4 w-4 rounded border-black/20 text-black focus:ring-0"
              />
              <label htmlFor="scholarship-check" className="text-xs text-neutral-800 cursor-pointer">
                Scholarships Available
              </label>
            </div>
          </aside>

          {/* RESULTS PANEL */}
          <main className="space-y-6">
            <div className="flex items-center justify-between text-xs text-neutral-500 pb-2">
              <span>Showing <strong>{filteredUniversities.length}</strong> matching institutions</span>
              {filteredUniversities.length !== initialUniversities.length && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-neutral-900 underline hover:opacity-70"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUniversities.map((uni) => (
                <article key={uni.slug} className="group flex h-full flex-col">
                  <Link
                    href={`/universities/${uni.slug}`}
                    className="relative block overflow-hidden rounded-xl border border-black/6 bg-neutral-100"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={uni.banner}
                        alt={uni.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full border border-white/35 bg-white/86 px-2 py-0.5 text-[8px] font-normal uppercase tracking-[0.16em] text-neutral-950 backdrop-blur-md">
                          QS #{uni.ranking.qs}
                        </span>
                        {uni.scholarships?.available && (
                          <span className="rounded-full border border-white/35 bg-neutral-950 px-2 py-0.5 text-[8px] font-normal uppercase tracking-[0.16em] text-white">
                            Scholarship
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="text-[9px] font-normal uppercase tracking-[0.18em] text-white/80">
                          📍 {uni.country}
                        </p>
                        <h3 className="mt-0.5 text-[1rem] font-normal leading-tight tracking-[-0.02em] text-white truncate">
                          {uni.name}
                        </h3>
                      </div>
                    </div>
                  </Link>

                  <div className="mt-3 flex flex-col justify-between flex-1 space-y-2.5 px-1">
                    <p className="text-xs leading-relaxed text-neutral-600 line-clamp-2">
                      {uni.overview?.about}
                    </p>

                    <div className="pt-2 border-t border-black/6 flex items-center justify-between text-xs text-neutral-700">
                      <div>
                        <span className="text-neutral-400 block text-[9px] uppercase tracking-wider">Tuition Est.</span>
                        <strong className="font-normal text-neutral-900">{uni.fees?.tuition}</strong>
                      </div>
                      <Link
                        href={`/universities/${uni.slug}`}
                        className="store-link-inline font-normal text-[9px]"
                      >
                        View Profile &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              ))}

              {filteredUniversities.length === 0 && (
                <div className="col-span-full py-16 text-center border border-dashed border-black/10 rounded-2xl space-y-3">
                  <h3 className="text-base font-normal text-neutral-950">No Matching Universities Found</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Try refining your keyword search, selecting an all-inclusive country filter, or clearing your selections.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="store-pill-outline text-xs mt-2"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
