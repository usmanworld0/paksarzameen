import type { Metadata } from "next";
import { getDbStore } from "@/lib/db";
import { ShieldCheck, Award, MessageCircle, MapPin, Mail, Phone, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | PakSarZameen Education Counselling",
  description:
    "Learn about our mission, counselling ethics, international team, and explore our professional mentors network.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const store = getDbStore();
  const mentors = store.mentors || [];

  return (
    <div className="w-full pt-[90px] min-h-screen bg-slate-50">
      <div className="max-w-[1320px] mx-auto px-[6vw] py-10 space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-black/[0.05] pb-5 space-y-2 text-center max-w-xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#0f7a47] block">Our Organization</span>
          <h1 className="text-3xl font-black tracking-tight text-[#1d1d1f]">About PakSarZameen</h1>
          <p className="text-xs text-[#707072] leading-relaxed">
            Discover our mission, ethical counselling framework, and our dedication to making global pathways transparent.
          </p>
        </div>

        {/* DETAILS SECTION */}
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-[#111111] tracking-tight">Our Mission &amp; Approach</h2>
            <div className="space-y-4 text-xs text-[#707072] leading-relaxed">
              <p>
                PakSarZameen was founded to support students navigating complex university admissions. We understand that applying abroad can be overwhelming, which is why we offer a structured, data-driven approach.
              </p>
              <p>
                Unlike commercial agencies that prioritize commission percentages, we do not operate on agency partnerships. We focus on securing the best placements for students, matching their academic strengths with top-tier international institutions.
              </p>
              <p>
                We advise on all major study regions—including the United States, United Kingdom, Canada, Australia, Europe, the Middle East, and East Asia—across undergraduate and postgraduate degrees.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-50 text-[#0f7a47] flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <strong className="text-xs text-[#111111] block font-bold">100% Transparency</strong>
                  <span className="text-[11px] text-[#707072]">We provide verified links and actual fee estimates.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-50 text-[#0f7a47] flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <strong className="text-xs text-[#111111] block font-bold">Comprehensive Mentoring</strong>
                  <span className="text-[11px] text-[#707072]">Advisors hold degrees from top institutions.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#081c10] text-[#c9decb] rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0f7a47] block">Ethics Code</span>
            <h3 className="text-lg font-black text-white tracking-tight">Our Commitment to Families</h3>
            <p className="text-xs text-[#a2b5a4] leading-relaxed">
              We never guarantee visas or admissions, as these decisions lie solely with embassies and university committees. We commit to building the strongest possible academic portfolio, review statements line-by-line, and ensure student credentials are submitted with zero errors.
            </p>
            <div className="pt-2 border-t border-[#123d29] space-y-2 text-xs font-semibold text-white">
              <div>✓ Zero commission bias</div>
              <div>✓ Verified outbound university requirements links</div>
              <div>✓ Transparent cost statements</div>
              <div>✓ In-person training groups limited to 20 students</div>
            </div>
          </div>
        </div>

        {/* MEET MENTORS NETWORK */}
        <div className="space-y-8 pt-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f7a47] block">Expert Guidance Network</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">Meet Our Mentors</h2>
            <p className="text-xs text-[#707072] max-w-sm mx-auto">Get to know the advisory team helping you secure international admissions.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {mentors.map((m: any) => (
              <div 
                key={m.id}
                className="rounded-3xl border border-black/[0.06] bg-white p-6 flex flex-col justify-between hover:border-[#0f7a47]/30 hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-black/[0.06]"
                    />
                    <div>
                      <h3 className="text-sm font-black text-[#111111] tracking-tight">{m.name}</h3>
                      <span className="text-[10px] font-bold text-[#0f7a47] block">{m.role}</span>
                      <span className="text-[9px] text-[#707072] block">{m.organization}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#707072] leading-relaxed italic">
                    &ldquo;{m.bio}&rdquo;
                  </p>

                  <div className="space-y-1.5 text-[11px] text-[#1d1d1f] pt-2 border-t border-black/[0.04]">
                    <div>
                      <span className="text-[#707072] font-semibold">Area of Expertise:</span> {m.expertise}
                    </div>
                    <div>
                      <span className="text-[#707072] font-semibold">Countries Advised:</span> {m.countries}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 flex justify-end">
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-blue-600 hover:underline"
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
