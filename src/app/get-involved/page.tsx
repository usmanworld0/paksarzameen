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
    desc: "Give your time and skills to field work, campaigns, and community support.",
    icon: Users2,
    tone: "from-[#1f8f63]/20 via-white to-white",
  },
  {
    title: "Partner",
    desc: "Work with us through schools, hospitals, businesses, or public institutions.",
    icon: HeartHandshake,
    tone: "from-[#2b9f74]/20 via-white to-white",
  },
  {
    title: "Donate",
    desc: "Support a program or the operations behind it.",
    icon: Check,
    tone: "from-[#1fae79]/18 via-white to-white",
  },
  {
    title: "Spread Awareness",
    desc: "Help more volunteers, donors, and communities find PSZ.",
    icon: Megaphone,
    tone: "from-[#54b486]/22 via-white to-white",
  },
];

export default function GetInvolvedPage() {
  return (
    <main className="site-page">
      <section className="site-hero">
        <div className="site-hero__noise" aria-hidden="true" />
        <div className="site-hero__orb site-hero__orb--left" aria-hidden="true" />
        <div className="site-hero__orb site-hero__orb--right" aria-hidden="true" />

        <header className="site-hero__inner">
          <h1 className="site-hero__title">Get Involved.</h1>
          <p className="site-hero__body">
            Volunteer, partner, or support a program and the team will follow up.
          </p>
        </header>
      </section>

      <section className="site-section">
        <div className="site-grid lg:grid-cols-3 xl:gap-10">
          <aside className="space-y-6 lg:col-span-1">
            <div className="site-card site-card--soft site-card--rounded">
              <div className="site-card__body">
              <p className="site-card__eyebrow">
                Ways to Help
              </p>
              <ul className="mt-5 space-y-3.5">
                {waysToHelp.map(({ title, desc, icon: Icon }) => (
                  <li
                    key={title}
                    className="group rounded-[1.6rem] border border-[#e5e5e5] bg-white p-5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#cacacb] bg-[#f5f5f5] text-[#111111]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[1.5rem] font-medium uppercase tracking-[0.08em] text-[#111111]">{title}</p>
                        <p className="mt-1 text-[1.45rem] leading-[1.8] text-[#707072]">{desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              </div>
            </div>

            <div className="site-card site-card--rounded">
              <div className="site-card__body">
              <p className="site-card__eyebrow">
                Already part of PSZ?
              </p>
              <p className="mt-3 text-[1.5rem] leading-[1.8] text-[#707072]">
                Reach us at{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-words font-medium text-[#111111] hover:text-[#707072]"
                >
                  {siteConfig.contact.email}
                </a>{" "}
                or call {siteConfig.contact.phone}. Visit us in Bahawalpur at {siteConfig.contact.address}.
              </p>
              <p className="mt-3 text-[1.35rem] leading-[1.8] text-[#707072]">
                Follow us on{" "}
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#111111] hover:text-[#707072]"
                >
                  Instagram
                </a>{" "}
                and{" "}
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#111111] hover:text-[#707072]"
                >
                  Facebook
                </a>
                .
              </p>

              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="site-button-secondary mt-4 gap-2"
              >
                Contact Coordination Team
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <div className="site-form-shell p-1.5">
              <GetInvolvedForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
