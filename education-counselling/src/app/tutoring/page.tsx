import type { Metadata } from "next";
import { getDbStore } from "@/lib/db";
import { BookOpen, Calendar, Clock, GraduationCap, Star, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tutoring & Test Preparation | IELTS, OET, SAT",
  description:
    "Review exam formats, class schedules, and tuition fees for IELTS, OET, and Digital SAT courses.",
  alternates: {
    canonical: "/tutoring",
  },
};

export default function TutoringPage() {
  const store = getDbStore();
  const tutoringCourses = store.tutoring || [];

  return (
    <div className="w-full pt-[90px] min-h-screen bg-slate-50">
      <div className="max-w-[1320px] mx-auto px-[6vw] py-10 space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-black/[0.05] pb-5 space-y-2 text-center max-w-xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#0f7a47] block">Test Preparation</span>
          <h1 className="text-3xl font-black tracking-tight text-[#1d1d1f]">Tutoring Programs</h1>
          <p className="text-xs text-[#707072] leading-relaxed">
            Master high-scoring tactics with weekly diagnostic exams, feedback evaluations, and customized templates.
          </p>
        </div>

        {/* DETAILS GRID */}
        <div className="grid gap-8 md:grid-cols-3">
          {tutoringCourses.map((t: any) => {
            // Anchor matching
            const anchorId = t.name.toLowerCase().includes("ielts") ? "ielts" : t.name.toLowerCase().includes("oet") ? "oet" : "sat";
            
            return (
              <div 
                key={t.id} 
                id={anchorId}
                className="scroll-mt-24 rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-8 flex flex-col justify-between hover:border-[#0f7a47]/30 hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-50 text-[#0f7a47] flex items-center justify-center">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#0f7a47]">Course Code</span>
                      <h2 className="text-base font-black text-[#111111] tracking-tight">{t.name}</h2>
                    </div>
                  </div>

                  <p className="text-xs text-[#707072] leading-relaxed min-h-[60px]">
                    {t.description}
                  </p>

                  <div className="space-y-2 text-xs border-t border-black/[0.04] pt-4 text-[#1d1d1f]">
                    <div className="flex justify-between">
                      <span className="text-[#707072]">Duration:</span>
                      <strong>{t.duration}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#707072]">Timings:</span>
                      <strong className="text-right max-w-[170px] truncate">{t.schedule}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#707072]">Tuition Fee:</span>
                      <strong>{t.fee}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#707072]">Format:</span>
                      <strong>{t.format}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-black/[0.04]">
                  <a
                    href={`https://wa.me/923001234567?text=Hi%20PakSarZameen%2C%20I%20would%20like%20to%20register%20for%20the%20${encodeURIComponent(t.name)}%20course.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex h-10 items-center justify-center rounded-xl bg-[#111111] hover:bg-[#0f7a47] text-xs font-black uppercase tracking-wider text-white transition-colors"
                  >
                    Register via WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* BENCHMARK / METHODOLOGY INFO */}
        <div className="grid gap-10 lg:grid-cols-2 items-center bg-white rounded-3xl border border-black/[0.06] p-6 sm:p-8">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-[#111111] tracking-tight">Our Tutoring Methodology</h2>
            <p className="text-xs text-[#707072] leading-relaxed">
              We focus heavily on actual exam simulations and critical feedback reviews. Each student is evaluated individually during speaking drills and writing tasks.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[#0f7a47] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs text-[#111111] block font-bold">Weekly Mock Exams</strong>
                  <span className="text-[11px] text-[#707072]">Simulating exact digital SAT software and official IELTS environments.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[#0f7a47] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs text-[#111111] block font-bold">Custom Templates</strong>
                  <span className="text-[11px] text-[#707072]">High-scoring template responses for OET letter writing and IELTS essays.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 space-y-3 text-xs text-[#707072] leading-relaxed">
            <strong className="text-[#1d1d1f] font-black uppercase text-[10px] tracking-wider block">Course batch sizes</strong>
            <p>
              To maintain focus and provide detailed feedback on writing tasks, class batches are strictly capped:
            </p>
            <ul className="space-y-1.5 list-disc pl-4 font-semibold text-[#1d1d1f]">
              <li>Digital SAT classes: Max 15 students per batch</li>
              <li>IELTS physical batches: Max 20 students per batch</li>
              <li>OET clinical writing groups: Max 10 candidates per batch</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
