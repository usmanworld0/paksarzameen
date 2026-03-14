import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { GetInvolvedForm } from "@/features/get-involved/components/GetInvolvedForm";

export const metadata: Metadata = {
  title: "Volunteer with PakSarzameen",
  description:
    "Volunteer with PakSarzameen and support social development, community welfare, and humanitarian initiatives across Pakistan.",
  alternates: {
    canonical: "/get-involved",
  },
  openGraph: {
    title: "Volunteer with PakSarzameen",
    description:
      "Volunteer, partner, or support PakSarzameen's mission across education, health, environment, and community welfare.",
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
    title: "Volunteer with PakSarzameen",
    description:
      "Volunteer, partner, or support PakSarzameen's mission across education, health, environment, and community welfare.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default function GetInvolvedPage() {
  return (
    <>
      <div className="get-involved-hero-section">
        <div className="get-involved-hero-overlay" />
        <header className="mx-auto w-full max-w-screen-xl px-[5%] pt-32 relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
            Get Involved
          </p>
          <h1 className="mt-4 font-heading text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            Volunteer with PakSarZameen
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-neutral-100 sm:text-lg">
            Whether you want to volunteer on the ground, partner with us
            institutionally, or support our programs, we would love to hear from
            you. Fill in the form below and our team will be in touch within 3–5
            working days.
          </p>
        </header>
      </div>
      <main className="mx-auto w-full max-w-screen-xl px-[5%] py-20">

      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        {/* Sidebar — why join */}
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
              Ways to Help
            </p>
            <ul className="mt-5 space-y-5">
              {[
                {
                  title: "Volunteer",
                  desc: "Contribute time and skills on ground-level initiatives across Bahawalpur and beyond.",
                },
                {
                  title: "Partner",
                  desc: "Institutional partnerships with schools, hospitals, businesses, and government bodies.",
                },
                {
                  title: "Donate",
                  desc: "Fund specific programs or contribute to our general operations and expansion.",
                },
                {
                  title: "Spread Awareness",
                  desc: "Share our work, amplify our stories, and help us reach communities that need us.",
                },
              ].map(({ title, desc }) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-psz-green/10 text-xs font-bold text-psz-green">
                    ✓
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

          <div className="rounded-2xl border border-psz-green/20 bg-psz-green/5 p-6">
            <p className="text-sm font-semibold text-neutral-900">
              Already part of PSZ?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Reach out directly at{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-medium text-psz-green hover:underline"
              >
                {siteConfig.contact.email}
              </a>{" "}
              or call {siteConfig.contact.phone}. Visit us at {siteConfig.contact.address}.
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Follow us: <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-psz-green hover:underline">Instagram</a> · <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="text-psz-green hover:underline">Facebook</a>
            </p>
          </div>
        </aside>

        {/* Main Form */}
        <GetInvolvedForm />
      </div>
    </main>
    </>
  );
}
