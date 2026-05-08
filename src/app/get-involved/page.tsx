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
  },
  {
    title: "Partner",
    desc: "Collaborate through schools, hospitals, businesses, universities, and public institutions.",
    icon: HeartHandshake,
  },
  {
    title: "Donate",
    desc: "Support a specific program area or strengthen the operations that keep community work moving.",
    icon: Check,
  },
  {
    title: "Spread Awareness",
    desc: "Share our work online and offline so more volunteers, donors, and communities can connect with PSZ.",
    icon: Megaphone,
  },
];

export default function GetInvolvedPage() {
  return (
    <div className="bg-[#f3f3ee]">
      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Get Involved</p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
            Get Involved
          </h1>
          <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
            Whether you want to volunteer on the ground, build an institutional
            partnership, support our blood bank, or strengthen our education,
            health, environmental, and welfare programs, we would love to hear
            from you. Fill in the form below and our team will be in touch
            within 3–5 working days.
          </p>
        </div>
      </header>

      <main className="px-[5%] pb-20 pt-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-8 lg:grid-cols-3 xl:gap-10">
            <aside className="space-y-5 lg:col-span-1">
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Ways to Help</p>
                <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">How You Can Help</h2>
                <ul className="mt-4 space-y-3">
                  {waysToHelp.map(({ title, desc, icon: Icon }) => (
                    <li
                      key={title}
                      className="flex items-start gap-3 rounded-xl border border-[#E5E5E5] p-4"
                    >
                      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0f7a47]/10 text-[#0f7a47]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-base font-black tracking-tighter text-[#111111]">{title}</p>
                        <p className="mt-0.5 text-sm font-medium leading-relaxed text-[#707072]">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Already Part of PSZ?</p>
                <h3 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Direct Contact</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#707072]">
                  Reach out directly at{" "}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="break-words text-[#0f7a47] hover:underline"
                  >
                    {siteConfig.contact.email}
                  </a>{" "}
                  or call {siteConfig.contact.phone}. Visit us in Bahawalpur at{" "}
                  {siteConfig.contact.address}.
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[#707072]">
                  Follow us on{" "}
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f7a47] hover:underline"
                  >
                    Instagram
                  </a>{" "}
                  and{" "}
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f7a47] hover:underline"
                  >
                    Facebook
                  </a>
                  .
                </p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#111111] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
                >
                  Contact Coordination Team
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </aside>

            <div className="lg:col-span-2">
              <GetInvolvedForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
