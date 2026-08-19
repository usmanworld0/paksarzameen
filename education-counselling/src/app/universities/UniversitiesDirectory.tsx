"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";
import { ExtendedUniversity } from "@/lib/db";

interface UniversitiesDirectoryProps {
  initialUniversities: ExtendedUniversity[];
}

export function UniversitiesDirectory({ initialUniversities }: UniversitiesDirectoryProps) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedField, setSelectedField] = useState<string>("All");
  const [selectedTuition, setSelectedTuition] = useState<string>("All");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);

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

      if (selectedCountry !== "All" && uni.country !== selectedCountry) {
        return false;
      }

      if (selectedLevel !== "All") {
        const level = selectedLevel.toLowerCase();
        if (level === "undergraduate" && (!uni.programs?.undergraduate || uni.programs.undergraduate.length === 0)) return false;
        if (level === "graduate" && (!uni.programs?.masters || uni.programs.masters.length === 0) && (!uni.programs?.phd || uni.programs.phd.length === 0)) return false;
      }

      if (selectedField !== "All") {
        const field = selectedField.toLowerCase();
        const hasUndergradField = (uni.programs?.undergraduate || []).some((p) => p.toLowerCase().includes(field));
        const hasGradField = (uni.programs?.masters || []).some((p) => p.toLowerCase().includes(field));
        const hasPhdField = (uni.programs?.phd || []).some((p) => p.toLowerCase().includes(field));
        if (!hasUndergradField && !hasGradField && !hasPhdField) return false;
      }

      if (selectedTuition !== "All") {
        const tuitionStr = uni.fees?.tuition || "";
        const numericTuition = parseInt(tuitionStr.replace(/[^0-9]/g, ""), 10) || 0;

        if (selectedTuition === "under-25k" && numericTuition > 25000) return false;
        if (selectedTuition === "25k-45k" && (numericTuition < 25000 || numericTuition > 45000)) return false;
        if (selectedTuition === "over-45k" && numericTuition < 45000) return false;
      }

      if (scholarshipOnly && !uni.scholarships?.available) {
        return false;
      }

      return true;
    });
  }, [initialUniversities, search, selectedCountry, selectedLevel, selectedField, selectedTuition, scholarshipOnly]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCountry("All");
    setSelectedLevel("All");
    setSelectedField("All");
    setSelectedTuition("All");
    setScholarshipOnly(false);
  };

  return (
    <div className="w-full pt-[90px] min-h-screen bg-[#F3F5F0] text-[#002E21]">
      <div className="ivy-container py-10 sm:py-16 space-y-10">
        
        {/* HEADER */}
        <div className="border-b border-[#BECCAD] pb-6 space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-[#207355] font-bold font-sans">
            Admissions Directory
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase text-[#002E21]">
            Global Universities Directory
          </h1>
          <p className="text-sm sm:text-base font-serif text-[#002E21]/80 max-w-2xl">
            Evaluate admissions requirements, acceptance statistics, tuition costs, and scholarship eligibility.
          </p>
        </div>

        {/* DIRECTORY GRID (FILTERS + RESULTS) */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] items-start">
          
          {/* FILTER BOARD */}
          <aside className="bg-white border border-[#BECCAD] p-6 space-y-5 shadow-xs font-sans">
            <div className="flex items-center justify-between border-b border-[#BECCAD] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#002E21] font-bold flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#207355]" />
                Filters
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold uppercase text-[#0f7a47] hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider text-[#002E21] font-bold block">Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Harvard, Toronto, CS..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ivy-control pl-9 text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider text-[#002E21] font-bold block">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="ivy-control text-xs h-10"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider text-[#002E21] font-bold block">Degree Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="ivy-control text-xs h-10"
              >
                <option value="All">All Degrees</option>
                <option value="Undergraduate">Undergraduate (Bachelors)</option>
                <option value="Graduate">Graduate (MS/PhD)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider text-[#002E21] font-bold block">Field of Study</label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="ivy-control text-xs h-10"
              >
                {fields.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase tracking-wider text-[#002E21] font-bold block">Annual Tuition</label>
              <select
                value={selectedTuition}
                onChange={(e) => setSelectedTuition(e.target.value)}
                className="ivy-control text-xs h-10"
              >
                <option value="All">Any Tuition</option>
                <option value="under-25k">Under $25,000 / year</option>
                <option value="25k-45k">$25,000 - $45,000 / year</option>
                <option value="over-45k">Over $45,000 / year</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#BECCAD]">
              <input
                type="checkbox"
                id="scholarship-check"
                checked={scholarshipOnly}
                onChange={(e) => setScholarshipOnly(e.target.checked)}
                className="h-4 w-4 accent-[#0f7a47]"
              />
              <label htmlFor="scholarship-check" className="text-xs text-[#002E21] font-bold cursor-pointer">
                Scholarships Available
              </label>
            </div>
          </aside>

          {/* RESULTS PANEL */}
          <main className="space-y-6">
            <div className="flex items-center justify-between text-xs text-[#002E21]/70 font-sans border-b border-[#BECCAD] pb-2">
              <span>Showing <strong>{filteredUniversities.length}</strong> matching institutions</span>
              {filteredUniversities.length !== initialUniversities.length && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[#0f7a47] font-bold hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUniversities.map((uni) => (
                <article key={uni.slug} className="bg-white border border-[#BECCAD] flex flex-col justify-between hover:border-[#002E21] transition shadow-xs">
                  <Link href={`/universities/${uni.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <Image
                      src={uni.banner}
                      alt={uni.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#002E21] text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-sans">
                      QS #{uni.ranking.qs}
                    </div>
                    {uni.scholarships?.available && (
                      <div className="absolute top-3 right-3 bg-[#0f7a47] text-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider font-sans">
                        Scholarship
                      </div>
                    )}
                  </Link>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#207355] font-bold block mb-1 font-sans">
                        {uni.country}
                      </span>
                      <h3 className="text-base font-bold text-[#002E21] font-sans">
                        {uni.name}
                      </h3>
                      <p className="text-xs font-serif text-[#002E21]/70 line-clamp-2 mt-1.5">
                        {uni.overview?.about}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#BECCAD] flex items-center justify-between text-xs font-sans">
                      <span className="text-[#002E21]/70">Tuition: <strong>{uni.fees?.tuition}</strong></span>
                      <Link href={`/universities/${uni.slug}`} className="text-[#0f7a47] font-bold hover:underline">
                        Profile &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              ))}

              {filteredUniversities.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white border border-dashed border-[#BECCAD] p-8 space-y-3">
                  <h3 className="text-base font-bold text-[#002E21] font-sans">No Matching Universities Found</h3>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="ivy-btn-dark text-xs px-6 py-2.5"
                  >
                    Reset Filters
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
