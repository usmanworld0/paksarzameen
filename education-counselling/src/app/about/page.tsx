import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDbStore } from "@/lib/db";
import { ShieldCheck, Award, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | PakSarZameen Education Counselling",
  description:
    "Learn about our organization, ethical counselling standards, leadership, and our mentor network.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const store = getDbStore();
  const mentors = store.mentors || [];

  return (
    <div className="w-full pt-[88px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-10 sm:py-16 space-y-16">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-8 space-y-2">
          <p className="store-kicker">Organization &amp; Approach</p>
          <h1 className="store-heading">About PakSarZameen</h1>
          <p className="store-subheading max-w-2xl">
            A student-first academic counselling initiative dedicated to transparency, zero commission bias, and individual merit.
          </p>
        </div>

        {/* MISSION & DETAILS */}
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-normal leading-tight tracking-[-0.03em] text-neutral-950">
              Our Mission &amp; Approach
            </h2>
            <div className="space-y-4 text-sm leading-7 text-neutral-600">
              <p>
                PakSarZameen was founded to support students navigating complex university admissions worldwide. We understand that applying abroad can be overwhelming, which is why we provide a structured, data-driven methodology.
              </p>
              <p>
                Unlike commercial agencies that prioritize commission percentages from partner colleges, we do not operate on agency quotas. We focus on securing the best placements for students, matching their academic strengths with top-tier international institutions.
              </p>
              <p>
                We advise on all major study regions—including the United States, United Kingdom, Canada, Australia, Europe, the Middle East, and East Asia—across undergraduate and postgraduate degrees.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2 text-xs">
              <div className="store-panel rounded-xl p-4 space-y-1.5">
                <strong className="block text-sm font-normal text-neutral-950">100% Transparency</strong>
                <p className="text-neutral-500">Verified links and actual fee estimates with zero hidden agency costs.</p>
              </div>
              <div className="store-panel rounded-xl p-4 space-y-1.5">
                <strong className="block text-sm font-normal text-neutral-950">Alumni Mentoring</strong>
                <p className="text-neutral-500">Advisors hold degrees from top institutions and provide personal review.</p>
              </div>
            </div>
          </div>

          <div className="store-card rounded-2xl p-8 sm:p-10 space-y-6">
            <p className="store-kicker">Ethical Commitment</p>
            <h3 className="text-xl font-normal leading-tight tracking-[-0.02em] text-neutral-950">
              Our Promise to Students and Families
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-neutral-600">
              We never guarantee visas or admissions, as these decisions lie solely with embassies and university committees. We commit to building the strongest possible academic portfolio, reviewing statements line-by-line, and ensuring student credentials are submitted with zero errors.
            </p>
            <ul className="space-y-2 text-xs text-neutral-700 pt-2 border-t border-black/6">
              <li className="flex items-center gap-2">&bull; Zero commission quota bias</li>
              <li className="flex items-center gap-2">&bull; Verified outbound university requirements links</li>
              <li className="flex items-center gap-2">&bull; Transparent cost and financial aid breakdowns</li>
              <li className="flex items-center gap-2">&bull; Class batches limited for personalized feedback</li>
            </ul>
          </div>
        </div>

        {/* MENTORS NETWORK */}
        <div className="space-y-8 pt-6 border-t border-black/6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="store-kicker">Advisory Board</p>
              <h2 className="mt-2 store-heading">Meet Our Mentors</h2>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              Connect with experienced alumni guiding you through the admissions process.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {mentors.map((m: any) => (
              <div
                key={m.id}
                className="store-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
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
                    <h3 className="text-base font-normal text-neutral-950">{m.name}</h3>
                    <p className="text-xs text-neutral-500">{m.role}</p>
                    <span className="text-[10px] text-neutral-400 block">{m.organization}</span>
                  </div>

                  <p className="text-xs leading-relaxed text-neutral-600">
                    &ldquo;{m.bio}&rdquo;
                  </p>

                  <div className="space-y-1 text-[11px] text-neutral-700 pt-3 border-t border-black/6">
                    <div>
                      <span className="text-neutral-400">Expertise:</span> {m.expertise}
                    </div>
                    <div>
                      <span className="text-neutral-400">Regions:</span> {m.countries}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/6 flex justify-end">
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
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
