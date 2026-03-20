import type { Metadata } from "next";
import { Check } from "lucide-react";

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
  },
  {
    title: "Partner",
    desc: "Collaborate through schools, hospitals, businesses, universities, and public institutions.",
  },
  {
    title: "Donate",
    desc: "Support a specific program area or strengthen the operations that keep community work moving.",
  },
  {
    title: "Spread Awareness",
    desc: "Share our work online and offline so more volunteers, donors, and communities can connect with PSZ.",
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <div className="get-involved-hero-section">
        <div className="get-involved-hero-overlay" />
        <header className="relative z-10 mx-auto w-full max-w-screen-xl px-[5%] pb-8 pt-28 sm:pb-10 sm:pt-32 lg:pt-36">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
            Get Involved
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Volunteer, Partner, Or Support PakSarZameen
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-100 sm:text-base lg:max-w-3xl lg:text-lg">
            Whether you want to volunteer on the ground, build an institutional
            partnership, support our blood bank, or strengthen our education,
            health, environmental, and welfare programs, we would love to hear
            from you. Fill in the form below and our team will be in touch
            within 3-5 working days.
          </p>
        </header>
      </div>

      <main className="mx-auto w-full max-w-screen-xl px-[5%] py-16 sm:py-20">
        <div className="mt-10 grid gap-8 lg:grid-cols-3 xl:gap-10">
          <aside className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
                Ways to Help
              </p>
              <ul className="mt-5 space-y-5">
                {waysToHelp.map(({ title, desc }) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-psz-green/10 text-psz-green">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {title}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-neutral-500">
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-psz-green/20 bg-psz-green/5 p-5 sm:p-6">
              <p className="text-sm font-semibold text-neutral-900">
                Already part of PSZ?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                Reach out directly at{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-words font-medium text-psz-green hover:underline"
                >
                  {siteConfig.contact.email}
                </a>{" "}
                or call {siteConfig.contact.phone}. Visit us in Bahawalpur at{" "}
                {siteConfig.contact.address}.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                Follow us on{" "}
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-psz-green hover:underline"
                >
                  Instagram
                </a>{" "}
                and{" "}
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-psz-green hover:underline"
                >
                  Facebook
                </a>
                .
              </p>
            </div>
          </aside>

          <GetInvolvedForm />
        </div>
      </main>
    </>
  );
}
