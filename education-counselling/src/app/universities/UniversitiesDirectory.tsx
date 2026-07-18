"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Award,
  DollarSign,
  GraduationCap,
  Layers,
  Sparkles,
  ChevronRight,
  Filter,
  X,
  AlertCircle
} from "lucide-react";
import { ExtendedUniversity } from "@/lib/db";

interface UniversitiesDirectoryProps {
  initialUniversities: ExtendedUniversity[];
}

export function UniversitiesDirectory({ initialUniversities }: UniversitiesDirectoryProps) {
  const searchParams = useSearchParams();
  
  // Search state
  const [search, setSearch] = useState("");
  
  // Filtering states
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedField, setSelectedField] = useState<string>("All");
  const [selectedTuition, setSelectedTuition] = useState<string>("All");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [selectedEnglish, setSelectedEnglish] = useState<string>("All");
  const [selectedTest, setSelectedTest] = useState<string>("All");

  // Read URL query parameters on load
  useEffect(() => {
    const urlQuery = searchParams.get("search");
    if (urlQuery) {
      setSearch(urlQuery);
    }
  }, [searchParams]);

  // Unique lists for dropdown selectors
  const countries = ["All", "United States", "United Kingdom", "Canada", "Australia", "Europe", "Middle East", "East Asia"];
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
          ...(uni.programs?.phd || [])
        ].some(prog => prog.toLowerCase().includes(query));

        if (!matchesName && !matchesCountry && !matchesProgram) return false;
      }

      // 2. Country Filter
      if (selectedCountry !== "All") {
        if (uni.country !== selectedCountry) return false;
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
        const hasUndergradField = (uni.programs?.undergraduate || []).some(p => p.toLowerCase().includes(field));
        const hasGradField = (uni.programs?.masters || []).some(p => p.toLowerCase().includes(field));
        const hasPhdField = (uni.programs?.phd || []).some(p => p.toLowerCase().includes(field));
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

      // 7. English language requirements
      if (selectedEnglish !== "All") {
        const score = parseFloat(uni.undergradRequirements?.english?.replace(/[^0-9.]/g, "") || "0");
        if (selectedEnglish === "ielts-7" && score > 7.0) return false;
        if (selectedEnglish === "ielts-7.5" && score < 7.5) return false;
      }

      // 8. Standardized test requirement
      if (selectedTest !== "All") {
        const satStr = uni.undergradRequirements?.satAct?.toLowerCase() || "";
        const greStr = uni.gradRequirements?.greGmat?.toLowerCase() || "";
        
        if (selectedTest === "sat" && !satStr.includes("sat")) return false;
        if (selectedTest === "gre" && !greStr.includes("gre")) return false;
        if (selectedTest === "optional" && (satStr.includes("required") || greStr.includes("required"))) return false;
      }

      return true;
    });
  }, [initialUniversities, search, selectedCountry, selectedLevel, selectedField, selectedTuition, scholarshipOnly, selectedEnglish, selectedTest]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCountry("All");
    setSelectedLevel("All");
    setSelectedField("All");
    setSelectedTuition("All");
    setScholarshipOnly(false);
    setSelectedEnglish("All");
    setSelectedTest("All");
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto px-[6vw] py-10 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-black/[0.05] pb-5 space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#0f7a47] block">Directory Search</span>
        <h1 className="text-3xl font-black tracking-tight text-[#1d1d1f]">Featured Global Universities</h1>
        <p className="text-xs text-[#707072] leading-relaxed max-w-xl">
          Search and narrow down the list of international schools. Apply filters for standardized test scores, budgets, and scholarship availability.
        </p>
      </div>

      {/* INFORMATIONAL PARTNERSHIP DISCLAIMER */}
      <div className="flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-blue-900 text-xs leading-relaxed shadow-xs">
        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Informational Notice:</strong> Universities listed on this portal are provided for informational and guidance purposes only. PakSarZameen facilitates academic counselling, essay mentoring, and pathway submissions; inclusion of a university does not necessarily indicate an official partnership or direct affiliation.
        </div>
      </div>

      {/* DIRECTORY GRID (FILTERS + RESULTS) */}
      <div className="grid gap-8 lg:grid-cols-4 items-start">
        
        {/* FILTERS PANEL */}
        <aside className="lg:col-span-1 rounded-2xl border border-black/[0.06] bg-white p-5 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#1d1d1f] flex items-center gap-1.5">
              <Filter className="h-4 w-4" />
              Filter Board
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">University Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-black/[0.06] bg-[#FAFAFA] pl-9 pr-3 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none focus:border-[#111111] transition"
              />
            </div>
          </div>

          {/* Country Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Destination Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full rounded-xl border border-black/[0.06] bg-white p-2.5 text-xs font-bold outline-none focus:border-[#111111]"
            >
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Study Level */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Program Pathway</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded-xl border border-black/[0.06] bg-white p-2.5 text-xs font-bold outline-none"
            >
              <option value="All">All Program Levels</option>
              <option value="Undergraduate">Undergraduate (Bachelors)</option>
              <option value="Graduate">Graduate (Masters / PhD)</option>
            </select>
          </div>

          {/* Field of Study */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Field of Study</label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full rounded-xl border border-black/[0.06] bg-white p-2.5 text-xs font-bold outline-none"
            >
              {fields.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Tuition Range */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Estimated Tuition Budget</label>
            <select
              value={selectedTuition}
              onChange={(e) => setSelectedTuition(e.target.value)}
              className="w-full rounded-xl border border-black/[0.06] bg-white p-2.5 text-xs font-bold outline-none"
            >
              <option value="All">Any Tuition Range</option>
              <option value="under-25k">Under $25,000 / year</option>
              <option value="25k-45k">$25,000 - $45,000 / year</option>
              <option value="over-45k">Over $45,000 / year</option>
            </select>
          </div>

          {/* English Level */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">English Proficiency Req.</label>
            <select
              value={selectedEnglish}
              onChange={(e) => setSelectedEnglish(e.target.value)}
              className="w-full rounded-xl border border-black/[0.06] bg-white p-2.5 text-xs font-bold outline-none"
            >
              <option value="All">Any score range</option>
              <option value="ielts-7">IELTS 7.0 or below</option>
              <option value="ielts-7.5">IELTS 7.5 or higher</option>
            </select>
          </div>

          {/* Test Requirements */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Testing Criteria</label>
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full rounded-xl border border-black/[0.06] bg-white p-2.5 text-xs font-bold outline-none"
            >
              <option value="All">Any Requirements</option>
              <option value="sat">SAT Required (Undergrad)</option>
              <option value="gre">GRE/GMAT Required (Grad)</option>
              <option value="optional">Test Optional / Waver Available</option>
            </select>
          </div>

          {/* Scholarships Checkbox */}
          <div className="flex items-center gap-2 pt-2 border-t border-black/[0.04]">
            <input
              type="checkbox"
              id="scholarship"
              checked={scholarshipOnly}
              onChange={(e) => setScholarshipOnly(e.target.checked)}
              className="h-4 w-4 rounded border-black/[0.06]"
            />
            <label htmlFor="scholarship" className="text-xs font-bold text-[#1d1d1f] cursor-pointer">
              Scholarships Available
            </label>
          </div>
        </aside>

        {/* RESULTS PANEL */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#707072]">
            <span>Showing <strong>{filteredUniversities.length}</strong> matching schools</span>
            {filteredUniversities.length !== initialUniversities.length && (
              <button onClick={handleResetFilters} className="text-[#0f7a47] hover:underline">
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {filteredUniversities.map((uni) => (
              <div
                key={uni.slug}
                className="group relative flex flex-col justify-between rounded-3xl border border-black/[0.06] bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all"
              >
                <div className="relative h-36 bg-gray-100 overflow-hidden">
                  <img
                    src={uni.banner}
                    alt={uni.name}
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow"
                      style={{ background: uni.logo }}
                    >
                      {uni.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#FAFAFA] block">📍 {uni.country}</span>
                      <h3 className="text-xs font-black text-white line-clamp-1">{uni.name}</h3>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#1d1d1f]">
                    🏆 QS #{uni.ranking.qs}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-[11px] text-[#707072] leading-relaxed line-clamp-2 italic">
                      &ldquo;{uni.overview?.about || "Explore complete admissions checklist, documents review, and timelines."}&rdquo;
                    </p>

                    <div className="space-y-1.5 text-[11px] text-[#1d1d1f]">
                      <div className="flex justify-between">
                        <span className="text-[#707072]">Annual Tuition:</span>
                        <strong>{uni.fees?.tuition || "Contact for info"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#707072]">Language Req:</span>
                        <strong>{uni.undergradRequirements?.english || "IELTS/TOEFL"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#707072]">Scholarships:</span>
                        <strong className="text-[#0f7a47]">{uni.scholarships?.available ? "Available" : "Limited"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between">
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Updated: {uni.lastUpdated || "Recently"}</span>
                    <Link
                      href={`/universities/${uni.slug}`}
                      className="inline-flex h-8 items-center justify-center rounded-xl bg-gray-50 hover:bg-[#0f7a47] hover:text-white border border-black/5 px-4 text-[10px] font-black uppercase tracking-wider text-[#111111] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredUniversities.length === 0 && (
              <div className="col-span-full py-12 text-center border border-dashed border-gray-200 rounded-3xl space-y-2">
                <strong className="text-sm font-black text-[#1d1d1f] block">No Matching Universities Found</strong>
                <p className="text-xs text-[#707072] max-w-xs mx-auto">Try typing another search word, selecting an all-inclusive filter, or clearing filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 rounded-xl bg-[#111111] px-4 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-[#0f7a47]"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
