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
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(130deg,#e9f7ef_0%,#f9fcfa_42%,#e2f3e9_100%)]">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#1f8f63]/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-5rem] top-10 h-80 w-80 rounded-full bg-[#2ea874]/18 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-5.5rem] left-[30%] h-72 w-72 rounded-full bg-[#74c498]/16 blur-3xl" />

        <header className="relative z-10 mx-auto w-full max-w-screen-xl px-[5%] pb-10 pt-22 sm:pb-16 sm:pt-32 lg:pt-36">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f8f63] sm:text-sm sm:tracking-[0.24em]">
            Contact
          </p>
          <h1 className="mt-3 max-w-4xl font-heading text-3xl font-bold tracking-tight text-[#173429] sm:text-5xl lg:text-6xl">
            Contact PakSarZameen
          </h1>
          <p className="mt-4 max-w-3xl text-[1.45rem] leading-relaxed text-[#496257] sm:text-lg">
            Connect with our team in Bahawalpur for volunteering, partnerships,
            blood bank coordination, media inquiries, and community development
            initiatives across Pakistan.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-2.5">
            <span className="inline-flex items-center rounded-full border border-white/75 bg-white/88 px-4 py-2 text-[1.1rem] font-semibold uppercase tracking-[0.08em] text-[#355246] shadow-[0_8px_20px_rgba(38,85,62,0.12)] sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-[0.1em]">
              Community Support
            </span>
            <span className="inline-flex items-center rounded-full border border-white/75 bg-white/88 px-4 py-2 text-[1.1rem] font-semibold uppercase tracking-[0.08em] text-[#355246] shadow-[0_8px_20px_rgba(38,85,62,0.12)] sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-[0.1em]">
              Partnership Desk
            </span>
            <span className="inline-flex items-center rounded-full border border-white/75 bg-white/88 px-4 py-2 text-[1.1rem] font-semibold uppercase tracking-[0.08em] text-[#355246] shadow-[0_8px_20px_rgba(38,85,62,0.12)] sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-[0.1em]">
              Emergency Coordination
            </span>
          </div>
        </header>
      </section>

      <main className="mx-auto w-full max-w-screen-xl px-[5%] py-12 sm:py-20">
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-[#d0e1d8] bg-[linear-gradient(165deg,rgba(255,255,255,0.98),rgba(245,251,247,0.94))] p-5 shadow-[0_14px_34px_rgba(35,98,72,0.12)] sm:p-7">
          <h2 className="font-heading text-[1.55rem] font-semibold text-[#1a3a2e] sm:text-[1.75rem]">
            Phone
          </h2>
          <p className="mt-3 break-words text-base leading-relaxed text-[#4f665c]">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
              className="font-semibold text-[#1f8f63] hover:underline"
            >
              {siteConfig.contact.phone}
            </a>
          </p>

          <h2 className="mt-6 font-heading text-[1.55rem] font-semibold text-[#1a3a2e] sm:text-[1.75rem]">
            Address
          </h2>
          <address className="mt-3 not-italic text-base leading-relaxed text-[#4f665c]">
            {siteConfig.contact.addressLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </address>

          <h2 className="mt-6 font-heading text-[1.55rem] font-semibold text-[#1a3a2e] sm:text-[1.75rem]">
            Email
          </h2>
          <p className="mt-3 break-words text-base leading-relaxed text-[#4f665c]">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-semibold text-[#1f8f63] hover:underline"
            >
              {siteConfig.contact.email}
            </a>
          </p>

          <h2 className="mt-6 font-heading text-[1.55rem] font-semibold text-[#1a3a2e] sm:text-[1.75rem]">
            Emergency Contacts
          </h2>
          <ul className="mt-3 space-y-2 text-base leading-relaxed text-[#4f665c]">
            {siteConfig.emergencyContacts.map((c) => (
              <li key={c.phone} className="break-words">
                <a href={`tel:${c.phone}`} className="font-semibold text-[#1f8f63] hover:underline">
                  {c.name}: {c.phone}
                </a>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-[#d0e1d8] bg-[linear-gradient(165deg,rgba(255,255,255,0.98),rgba(245,251,247,0.94))] p-5 shadow-[0_14px_34px_rgba(35,98,72,0.12)] sm:p-7">
          <h2 className="font-heading text-[1.55rem] font-semibold text-[#1a3a2e] sm:text-[1.75rem]">
            Social Profiles
          </h2>
          <ul className="mt-4 space-y-3 text-base text-[#4f665c]">
            <li className="break-words">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1f8f63] hover:underline"
              >
                Instagram - @paksarzameen.wfo
              </a>
            </li>
            <li className="break-words">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1f8f63] hover:underline"
              >
                Facebook - PakSarzameen
              </a>
            </li>
            <li className="break-words">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1f8f63] hover:underline"
              >
                LinkedIn - PakSarZameen
              </a>
            </li>
            <li className="break-words">
              <a
                href={siteConfig.social.commonwealthInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#1f8f63] hover:underline"
              >
                Paksarzameen Store Instagram - @commonwealthlab.psz
              </a>
            </li>
          </ul>

          <h2 className="mt-6 font-heading text-[1.55rem] font-semibold text-[#1a3a2e] sm:text-[1.75rem]">
            Quick Links
          </h2>
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-base text-[#4f665c]">
            <Link href="/" className="font-semibold text-[#1f8f63] hover:underline">
              Home
            </Link>
            <Link href="/about" className="font-semibold text-[#1f8f63] hover:underline">
              About
            </Link>
            <Link href="/programs" className="font-semibold text-[#1f8f63] hover:underline">
              Programs
            </Link>
            <Link href="/get-involved" className="font-semibold text-[#1f8f63] hover:underline">
              Get Involved
            </Link>
            <Link href="/commonwealth-lab" className="font-semibold text-[#1f8f63] hover:underline">
              Paksarzameen Store
            </Link>
          </p>
        </article>

        <article className="rounded-3xl border border-[#d0e1d8] bg-[linear-gradient(165deg,rgba(255,255,255,0.98),rgba(245,251,247,0.94))] p-5 shadow-[0_14px_34px_rgba(35,98,72,0.12)] sm:p-7 lg:col-span-2">
          <h2 className="font-heading text-[1.55rem] font-semibold text-[#1a3a2e] sm:text-[1.75rem]">
            Send a Message
          </h2>
          <p className="mt-3 text-base text-[#4f665c]">
            Use the form to send us a message about volunteering, partnerships,
            campaigns, or general inquiries and we&apos;ll get back to you.
          </p>
          <div className="mt-4 rounded-2xl border border-[#d0e1d8] bg-white/90 p-4 sm:p-5">
            <ContactForm />
          </div>
        </article>
      </section>

      <section className="mt-10">
        <div className="rounded-3xl border border-[#d0e1d8] bg-[linear-gradient(165deg,rgba(255,255,255,0.98),rgba(245,251,247,0.94))] p-5 shadow-[0_14px_34px_rgba(35,98,72,0.12)] sm:p-6">
          <h3 className="font-heading text-2xl font-semibold text-[#1a3a2e]">
            Our Location
          </h3>
          <p className="mt-2 text-base text-[#4f665c]">
            {siteConfig.contact.address}
          </p>
          <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#cfe2d6] sm:aspect-[16/8]">
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
    </>
  );
}
