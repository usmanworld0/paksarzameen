import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/* eslint-disable react/no-unescaped-entities */

export const metadata: Metadata = {
  title: "About Us: Mission, Vision And Community Work In Pakistan",
  description:
    "Learn about PakSarZameen, a community development organization in Pakistan rooted in justice, compassion, education, health support, environmental action, and sustainable social impact.",
  keywords: [
    ...siteConfig.seo.keywords,
    "about paksarzameen",
    "organization mission pakistan",
    "community development bahawalpur",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About PakSarZameen | Mission, Vision And Community Work",
    description:
      "Meet the story, mission, and values behind PakSarZameen's education, health, environmental, and welfare work in Pakistan.",
    url: `${siteConfig.siteUrl}/about`,
    type: "website",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
          alt: "PakSarZameen Bahawalpur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About PakSarZameen | Mission, Vision And Community Work",
    description:
      "Meet the story, mission, and values behind PakSarZameen's education, health, environmental, and welfare work in Pakistan.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#f3f3ee]">
      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">About Us</p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
            About PakSarZameen
          </h1>
          <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
            Local action. Lasting dignity. Nurturing character through education.
          </p>
        </div>
      </header>

      <main className="px-[5%] pb-20 pt-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Who We Are</p>
            <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">
              A Bahawalpur-Rooted Movement
            </h2>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-[#707072]">
              PakSarZameen is a Bahawalpur-rooted movement working across education,
              health, welfare, and environmental care. We build practical pathways
              to dignity for underserved communities through volunteer-driven programs
              shaped by real local needs.
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Purpose</p>
              <h3 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Mission</h3>
              <p className="mt-2 text-sm font-medium text-[#707072]">
                Build practical pathways to dignity for underserved communities.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Aspiration</p>
              <h3 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Vision</h3>
              <p className="mt-2 text-sm font-medium text-[#707072]">
                A just Pakistan where opportunity and care are shared.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Approach</p>
              <h3 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Method</h3>
              <p className="mt-2 text-sm font-medium text-[#707072]">
                Volunteer-driven programs shaped by real local needs.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Join Us</p>
            <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">Build With Us</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-[#707072]">
              Join programs, volunteer your time, or partner with us to create measurable local impact.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/get-involved"
                className="rounded-xl bg-[#0f7a47] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
              >
                Get Involved
              </Link>
              <Link
                href="/contact"
                className="rounded-xl bg-[#111111] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
