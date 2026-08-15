import type { Metadata } from "next";
import { getDbStore } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tutoring & Test Preparation | IELTS, OET, SAT",
  description:
    "Review exam formats, class schedules, and tuition fees for IELTS Academic, OET Healthcare, and Digital SAT programs.",
  alternates: {
    canonical: "/tutoring",
  },
};

export default function TutoringPage() {
  const store = getDbStore();
  const tutoringCourses = store.tutoring || [];

  return (
    <div className="w-full pt-[88px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-10 sm:py-16 space-y-16">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-8 space-y-2">
          <p className="store-kicker">Standardized Testing</p>
          <h1 className="store-heading">Tutoring Programs &amp; Batches</h1>
          <p className="store-subheading max-w-2xl">
            Master high-scoring tactics with weekly diagnostic examinations, individualized feedback, and customized templates.
          </p>
        </div>

        {/* COURSES GRID */}
        <div className="grid gap-8 md:grid-cols-3">
          {tutoringCourses.map((t: any) => {
            const anchorId = t.name.toLowerCase().includes("ielts")
              ? "ielts"
              : t.name.toLowerCase().includes("oet")
              ? "oet"
              : "sat";

            return (
              <div
                key={t.id}
                id={anchorId}
                className="store-card rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-6 scroll-mt-28"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="store-pill-label">{t.format}</span>
                    <span className="text-xs text-neutral-500">{t.duration}</span>
                  </div>

                  <h2 className="text-xl font-normal tracking-[-0.02em] text-neutral-950">
                    {t.name}
                  </h2>

                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 min-h-[60px]">
                    {t.description}
                  </p>

                  <div className="space-y-2 text-xs text-neutral-700 pt-4 border-t border-black/6">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Duration:</span>
                      <strong className="font-normal text-neutral-900">{t.duration}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Timings:</span>
                      <strong className="font-normal text-neutral-900 text-right max-w-[160px] truncate">{t.schedule}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Tuition Fee:</span>
                      <strong className="font-normal text-neutral-900">{t.fee}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/6">
                  <a
                    href={`https://wa.me/923001234567?text=Hi%20PakSarZameen%2C%20I%20would%20like%20to%20register%20for%20the%20${encodeURIComponent(t.name)}%20course.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="store-button-secondary w-full text-center"
                  >
                    Register via WhatsApp &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* METHODOLOGY & BATCHES */}
        <div className="grid gap-10 lg:grid-cols-2 items-center store-panel rounded-2xl p-8 sm:p-12">
          <div className="space-y-4">
            <p className="store-kicker">Curriculum Design</p>
            <h3 className="store-heading">Our Tutoring Methodology</h3>
            <p className="text-sm leading-7 text-neutral-600">
              We focus heavily on timed exam simulations and critical feedback reviews. Each student is evaluated individually during speaking drills and writing tasks.
            </p>
            <div className="space-y-3 pt-2 text-xs sm:text-sm text-neutral-700">
              <div className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                <span>Weekly mock exams matching exact digital SAT software and IELTS test conditions</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                <span>High-scoring template frameworks for OET clinical writing and IELTS essays</span>
              </div>
            </div>
          </div>

          <div className="store-card rounded-xl p-6 space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <span className="store-kicker block">Class Batch Caps</span>
            <p>
              To maintain focus and provide detailed feedback on writing tasks, batch sizes are capped:
            </p>
            <ul className="space-y-2 list-disc pl-4 font-normal text-neutral-900">
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
