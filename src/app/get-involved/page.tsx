import type { Metadata } from "next";
import { ArrowRight, Check, HeartHandshake, Megaphone, Users2 } from "lucide-react";

import { siteConfig } from "@/config/site";
import { GetInvolvedForm } from "@/features/get-involved/components/GetInvolvedForm";

export const metadata: Metadata = {
  title: "Get Involved: Volunteer, Partner Or Support",
  description:
    "Volunteer, partner, donate, or support PakSarZameen's education, health, blood bank, environmental, and welfare work across Pakistan.",
  keywords: [
    ...siteConfig.seo.keywords,
    "volunteer in pakistan",
    "donate in pakistan",
    "partnerships bahawalpur",
  ],
  alternates: {
    canonical: "/get-involved",
  },
  openGraph: {
    title: "Get Involved | Support PakSarZameen's Work In Pakistan",
    description:
      "Volunteer, partner, donate, or spread awareness for PakSarZameen's education, health, environmental, and welfare programs.",
    url: `${siteConfig.siteUrl}/get-involved`,
    type: "website",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
        alt: "PakSarZameen humanitarian activities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Involved | Support PakSarZameen's Work In Pakistan",
    description:
      "Volunteer, partner, donate, or spread awareness for PakSarZameen's education, health, environmental, and welfare programs.",
    images: ["/images/hero-fallback.svg"],
  },
};

const waysToHelp = [
  {
    title: "Volunteer",
    desc: "Contribute your time and skills to field activities, campaigns, and community support work in Bahawalpur and beyond.",
    icon: Users2,
    tone: "from-[#1f8f63]/20 via-white to-white",
  },
  {
    title: "Partner",
    desc: "Collaborate through schools, hospitals, businesses, universities, and public institutions.",
    icon: HeartHandshake,
    tone: "from-[#2b9f74]/20 via-white to-white",
  },
  {
    title: "Donate",
    desc: "Support a specific program area or strengthen the operations that keep community work moving.",
    icon: Check,
    tone: "from-[#1fae79]/18 via-white to-white",
  },
  {
    title: "Spread Awareness",
    desc: "Share our work online and offline so more volunteers, donors, and communities can connect with PSZ.",
    icon: Megaphone,
    tone: "from-[#54b486]/22 via-white to-white",
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(132deg,#ebf8f0_0%,#f6fbf8_44%,#e4f5ec_100%)]">
        <div className="pointer-events-none absolute -left-24 top-4 h-72 w-72 rounded-full bg-[#1f8f63]/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-5rem] top-10 h-80 w-80 rounded-full bg-[#2b9f74]/18 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-6rem] left-[24%] h-72 w-72 rounded-full bg-[#7cc79f]/16 blur-3xl" />

        <header className="relative z-10 mx-auto w-full max-w-screen-xl px-[5%] pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pt-36">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1f8f63]">
            Get Involved
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-[1.02] tracking-tight text-[#163228] sm:text-5xl lg:text-6xl">
            Volunteer, Partner, Or Support PakSarZameen
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#476156] sm:text-lg lg:text-xl">
            Whether you want to volunteer on the ground, build an institutional
            partnership, support our blood bank, or strengthen our education,
            health, environmental, and welfare programs, we would love to hear
            from you. Fill in the form below and our team will be in touch
            within 3-5 working days.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {[
              "Community action",
              "Institutional partnerships",
              "Skill-based volunteering",
            ].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center rounded-full border border-white/75 bg-white/85 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-[#365447] shadow-[0_8px_20px_rgba(38,85,62,0.12)]"
              >
                {chip}
              </span>
            ))}
          </div>
        </header>
      </section>

      <main className="mx-auto w-full max-w-screen-xl px-[5%] py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-3 xl:gap-10">
          <aside className="space-y-6 lg:col-span-1">
            <div className="rounded-3xl border border-[#cfe2d6] bg-[linear-gradient(170deg,rgba(255,255,255,0.98),rgba(242,250,246,0.95))] p-5 shadow-[0_18px_36px_rgba(36,90,65,0.12)] sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f8f63]">
                Ways to Help
              </p>
              <ul className="mt-5 space-y-3.5">
                {waysToHelp.map(({ title, desc, icon: Icon, tone }) => (
                  <li
                    key={title}
                    className={`group rounded-2xl border border-[#d4e6dc] bg-gradient-to-br ${tone} p-5 transition-transform duration-300 hover:-translate-y-0.5`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#1f8f63] shadow-[0_6px_14px_rgba(31,116,78,0.2)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-base font-semibold text-[#1f3b2f]">{title}</p>
                        <p className="mt-1 text-base leading-relaxed text-[#486458]">{desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-[#cdd9cd] bg-[linear-gradient(175deg,rgba(236,252,246,0.95),rgba(255,255,255,0.95))] p-5 shadow-[0_15px_34px_rgba(35,98,72,0.11)] sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f8f63]">
                Already part of PSZ?
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#4a5d57]">
                Reach out directly at{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-words font-semibold text-[#1f8f63] hover:underline"
                >
                  {siteConfig.contact.email}
                </a>{" "}
                or call {siteConfig.contact.phone}. Visit us in Bahawalpur at{" "}
                {siteConfig.contact.address}.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#5b6b67]">
                Follow us on{" "}
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#1f8f63] hover:underline"
                >
                  Instagram
                </a>{" "}
                and{" "}
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#1f8f63] hover:underline"
                >
                  Facebook
                </a>
                .
              </p>

              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1f8f63]/35 bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-[#1f8f63] transition-all duration-300 hover:gap-3"
              >
                Contact Coordination Team
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <div className="rounded-[1.6rem] border border-[#cfe2d6] bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(242,250,246,0.94))] p-1.5 shadow-[0_20px_46px_rgba(35,98,72,0.16)]">
              <GetInvolvedForm />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
