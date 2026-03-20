import type { Metadata } from "next";
import Link from "next/link";

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
    <main className="mx-auto w-full max-w-screen-xl px-[5%] py-24 sm:py-28 lg:py-32">
      <header className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
          Contact
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Contact PakSarZameen
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-500">
          Connect with our team in Bahawalpur for volunteering, partnerships,
          blood bank coordination, media inquiries, and community development
          initiatives across Pakistan.
        </p>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">
            Phone
          </h2>
          <p className="mt-3 break-words text-sm leading-relaxed text-neutral-600">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
              className="text-psz-green hover:underline"
            >
              {siteConfig.contact.phone}
            </a>
          </p>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-neutral-900">
            Address
          </h2>
          <address className="mt-3 not-italic text-sm leading-relaxed text-neutral-600">
            {siteConfig.contact.addressLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </address>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-neutral-900">
            Email
          </h2>
          <p className="mt-3 break-words text-sm leading-relaxed text-neutral-600">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-psz-green hover:underline"
            >
              {siteConfig.contact.email}
            </a>
          </p>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-neutral-900">
            Emergency Contacts
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-600">
            {siteConfig.emergencyContacts.map((c) => (
              <li key={c.phone} className="break-words">
                <a href={`tel:${c.phone}`} className="text-psz-green hover:underline">
                  {c.name}: {c.phone}
                </a>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">
            Social Profiles
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            <li className="break-words">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-psz-green hover:underline"
              >
                Instagram - @paksarzameen.wfo
              </a>
            </li>
            <li className="break-words">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-psz-green hover:underline"
              >
                Facebook - PakSarzameen
              </a>
            </li>
            <li className="break-words">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-psz-green hover:underline"
              >
                LinkedIn - PakSarZameen
              </a>
            </li>
            <li className="break-words">
              <a
                href={siteConfig.social.commonwealthInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-psz-green hover:underline"
              >
                Paksarzameen Store Instagram - @commonwealthlab.psz
              </a>
            </li>
          </ul>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-neutral-900">
            Quick Links
          </h2>
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm text-neutral-600">
            <Link href="/" className="text-psz-green hover:underline">
              Home
            </Link>
            <Link href="/about" className="text-psz-green hover:underline">
              About
            </Link>
            <Link href="/programs" className="text-psz-green hover:underline">
              Programs
            </Link>
            <Link href="/get-involved" className="text-psz-green hover:underline">
              Get Involved
            </Link>
            <Link href="/commonwealth-lab" className="text-psz-green hover:underline">
              Paksarzameen Store
            </Link>
          </p>
        </article>

        <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7 lg:col-span-2">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">
            Send a Message
          </h2>
          <p className="mt-3 text-sm text-neutral-600">
            Use the form to send us a message about volunteering, partnerships,
            campaigns, or general inquiries and we&apos;ll get back to you.
          </p>
          <div className="mt-4">
            <ContactForm />
          </div>
        </article>
      </section>

      <section className="mt-10">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="font-heading text-xl font-semibold text-neutral-900">
            Our Location
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            {siteConfig.contact.address}
          </p>
          <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-md sm:aspect-[16/8]">
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
      </section>
    </main>
  );
}
