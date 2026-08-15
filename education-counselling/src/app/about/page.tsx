import type { Metadata } from "next";
import Image from "next/image";
import { getDbStore } from "@/lib/db";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | PakSarZameen Education Counselling",
  description:
    "Learn about our organization, ethical counselling standards, and our mentor network.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const store = getDbStore();
  const mentors = store.mentors || [];

  return (
    <div className="w-full pt-[80px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-8 sm:py-12 space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-6 space-y-1.5">
          <p className="store-kicker">About Us</p>
          <h1 className="store-heading">PakSarZameen Education Counselling</h1>
          <p className="store-subheading max-w-xl">
            A transparent, student-first admissions advisory initiative with zero commission bias.
          </p>
        </div>

        {/* MISSION & ETHICS */}
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <div className="space-y-4">
            <h2 className="text-xl font-normal text-neutral-950">
              Our Philosophy
            </h2>
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-neutral-600">
              <p>
                We do not sell commercial agency quotas or steer students toward private colleges. We work exclusively to position students for top global universities based on their genuine academic strengths.
              </p>
              <p>
                Our advisors are university alumni who review essays, lab outreach, and visa paperwork with radical honesty and precision.
              </p>
            </div>
          </div>

          <div className="store-card rounded-2xl p-6 sm:p-7 space-y-3 text-xs sm:text-sm text-neutral-700">
            <span className="store-kicker">Our Commitments</span>
            <ul className="space-y-2 pt-1">
              <li className="flex items-center gap-2">&bull; 100% free initial profile evaluation</li>
              <li className="flex items-center gap-2">&bull; Zero commercial university quotas</li>
              <li className="flex items-center gap-2">&bull; Verified admissions criteria and links</li>
              <li className="flex items-center gap-2">&bull; Detailed line-by-line essay feedback</li>
            </ul>
          </div>
        </div>

        {/* MENTORS */}
        <div className="space-y-6 pt-4 border-t border-black/6">
          <div>
            <p className="store-kicker">Mentors</p>
            <h2 className="mt-1 store-heading">Our Advisory Team</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {mentors.map((m: any) => (
              <div
                key={m.id}
                className="store-card rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-normal text-neutral-950">{m.name}</h3>
                    <p className="text-xs text-neutral-500">{m.role}</p>
                    <span className="text-[10px] text-neutral-400 block">{m.organization}</span>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-3">
                    &ldquo;{m.bio}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-black/6 flex justify-end">
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-blue-600 hover:underline"
                  >
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
