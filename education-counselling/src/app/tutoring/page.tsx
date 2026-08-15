import type { Metadata } from "next";
import { getDbStore } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tutoring & Test Preparation | IELTS, OET, SAT",
  description:
    "Review exam formats, class schedules, and fees for IELTS Academic, OET Healthcare, and Digital SAT programs.",
  alternates: {
    canonical: "/tutoring",
  },
};

export default function TutoringPage() {
  const store = getDbStore();
  const tutoringCourses = store.tutoring || [];

  return (
    <div className="w-full pt-[80px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-8 sm:py-12 space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-6 space-y-1.5">
          <p className="store-kicker">Testing</p>
          <h1 className="store-heading">Tutoring Programs</h1>
          <p className="store-subheading">
            Targeted test preparation with weekly diagnostic mocks and writing reviews.
          </p>
        </div>

        {/* COURSES */}
        <div className="grid gap-6 md:grid-cols-3">
          {tutoringCourses.map((t: any) => (
            <div
              key={t.id}
              className="store-card rounded-2xl p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="store-pill-label">{t.format}</span>
                  <span className="text-xs text-neutral-500">{t.duration}</span>
                </div>

                <h2 className="text-lg font-normal text-neutral-950">
                  {t.name}
                </h2>

                <p className="text-xs text-neutral-600 min-h-[45px]">
                  {t.description}
                </p>

                <div className="space-y-1 pt-3 border-t border-black/6 text-xs text-neutral-700">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Timings:</span>
                    <strong className="font-normal text-neutral-900">{t.schedule}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Tuition:</span>
                    <strong className="font-normal text-neutral-900">{t.fee}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-black/6">
                <a
                  href={`https://wa.me/923001234567?text=Hi%20PakSarZameen%2C%20I%20want%20to%20register%20for%20${encodeURIComponent(t.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="store-button-secondary w-full text-center text-xs"
                >
                  WhatsApp Register &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
