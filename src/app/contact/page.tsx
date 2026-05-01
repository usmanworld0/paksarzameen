import type { Metadata } from "next";
import Link from "next/link";

import { CompactPageHeader } from "@/components/layout/CompactPageHeader";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/contact/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us In Bahawalpur, Pakistan",
  description:
    "Contact PakSarZameen in Bahawalpur for volunteer opportunities, partnerships, blood bank support, media inquiries, and community initiatives across Pakistan.",
  keywords: [
    ...siteConfig.seo.keywords,
    "contact bahawalpur",
    "paksarzameen contact",
    "blood bank contact bahawalpur",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact PakSarZameen | Bahawalpur, Pakistan",
    description:
      "Reach PakSarZameen for volunteering, partnerships, blood support, and community development work in Bahawalpur and beyond.",
    url: `${siteConfig.siteUrl}/contact`,
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
    title: "Contact PakSarZameen | Bahawalpur, Pakistan",
    description:
      "Reach PakSarZameen for volunteering, partnerships, blood support, and community development work in Bahawalpur and beyond.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default function ContactPage() {
  return (
    <main className="site-page">
      <CompactPageHeader
        title="Contact."
        description="Reach the team for support, partnerships, or coordination."
      />

      <section className="site-section">
        <div className="site-grid site-grid--two">
          <article className="site-card site-card--rounded">
            <div className="site-card__body">
              <h2 className="site-card__title !mt-0 !text-[3rem]">
                Phone
              </h2>
              <p className="mt-3 break-words text-[1.5rem] leading-[1.8] text-[#707072]">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                  className="font-medium text-[#111111] hover:text-[#707072]"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>

              <h2 className="site-card__title !text-[3rem]">
                Address
              </h2>
              <address className="mt-3 not-italic text-[1.5rem] leading-[1.8] text-[#707072]">
                {siteConfig.contact.addressLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </address>

              <h2 className="site-card__title !text-[3rem]">
                Email
              </h2>
              <p className="mt-3 break-words text-[1.5rem] leading-[1.8] text-[#707072]">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="font-medium text-[#111111] hover:text-[#707072]"
                >
                  {siteConfig.contact.email}
                </a>
              </p>

              <h2 className="site-card__title !text-[3rem]">
                Emergency Contacts
              </h2>
              <ul className="mt-3 space-y-2 text-[1.5rem] leading-[1.8] text-[#707072]">
                {siteConfig.emergencyContacts.map((c) => (
                  <li key={c.phone} className="break-words">
                    <a href={`tel:${c.phone}`} className="font-medium text-[#111111] hover:text-[#707072]">
                      {c.name}: {c.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="site-card site-card--rounded">
            <div className="site-card__body">
              <h2 className="site-card__title !mt-0 !text-[3rem]">
                Social Profiles
              </h2>
              <ul className="mt-4 space-y-3 text-[1.5rem] text-[#707072]">
                <li className="break-words">
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#111111] hover:text-[#707072]"
                  >
                    Instagram - @paksarzameen.wfo
                  </a>
                </li>
                <li className="break-words">
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#111111] hover:text-[#707072]"
                  >
                    Facebook - PakSarzameen
                  </a>
                </li>
                <li className="break-words">
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#111111] hover:text-[#707072]"
                  >
                    LinkedIn - PakSarZameen
                  </a>
                </li>
                <li className="break-words">
                  <a
                    href={siteConfig.social.commonwealthInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#111111] hover:text-[#707072]"
                  >
                    Paksarzameen Store Instagram - @commonwealthlab.psz
                  </a>
                </li>
              </ul>

              <h2 className="site-card__title !text-[3rem]">
                Quick Links
              </h2>
              <p className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[1.4rem] text-[#707072]">
                <Link href="/" className="font-medium text-[#111111] hover:text-[#707072]">
                  Home
                </Link>
                <Link href="/about" className="font-medium text-[#111111] hover:text-[#707072]">
                  About
                </Link>
                <Link href="/programs" className="font-medium text-[#111111] hover:text-[#707072]">
                  Programs
                </Link>
                <Link href="/get-involved" className="font-medium text-[#111111] hover:text-[#707072]">
                  Get Involved
                </Link>
                <Link href="/commonwealth-lab" className="font-medium text-[#111111] hover:text-[#707072]">
                  Paksarzameen Store
                </Link>
              </p>
            </div>
          </article>

          <article className="site-card site-card--rounded lg:col-span-2">
            <div className="site-card__body">
              <h2 className="site-card__title !mt-0 !text-[3rem]">
                Send a Message
              </h2>
              <p className="mt-3 text-[1.5rem] text-[#707072]">
                Send a message and the team will get back to you.
              </p>
              <div className="mt-5">
                <ContactForm />
              </div>
            </div>
          </article>
        </div>

        <section className="mt-10">
          <div className="site-card site-card--rounded">
            <div className="site-card__body">
              <h3 className="site-card__title !mt-0 !text-[3rem]">
                Our Location
              </h3>
              <p className="mt-2 text-[1.5rem] text-[#707072]">
                {siteConfig.contact.address}
              </p>
              <div className="mt-4 aspect-[4/3] w-full overflow-hidden border border-[#e5e5e5] sm:aspect-[16/8]">
                <iframe
                  title="PakSarZameen Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.contact.address)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
