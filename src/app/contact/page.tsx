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
    <div className="store-shell pt-[72px]">
      <header className="border-b border-black/6 bg-white py-12 sm:py-16">
        <div className="store-container">
          <p className="store-kicker">Contact</p>
          <h1 className="store-heading mt-3 font-medium">
            Contact Us
          </h1>
          <p className="store-subheading mt-2 max-w-2xl">
            Connect with our team in Bahawalpur for volunteering, partnerships,
            blood bank coordination, media inquiries, and community development
            initiatives across Pakistan.
          </p>
        </div>
      </header>

      <main className="store-section-soft">
        <div className="store-container">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Phone</p>
              <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Call Us</h2>
              <p className="mt-2 text-sm font-medium text-[#707072]">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                  className="text-[#0f7a47] hover:underline"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Address</p>
              <h3 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Find Us</h3>
              <address className="mt-2 not-italic text-sm font-medium leading-relaxed text-[#707072]">
                {siteConfig.contact.addressLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </address>

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Email</p>
              <h3 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Write To Us</h3>
              <p className="mt-2 text-sm font-medium text-[#707072]">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all text-[#0f7a47] hover:underline"
                >
                  {siteConfig.contact.email}
                </a>
              </p>

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Emergency</p>
              <h3 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Emergency Contacts</h3>
              <ul className="mt-2 space-y-1.5 text-sm font-medium text-[#707072]">
                {siteConfig.emergencyContacts.map((c) => (
                  <li key={c.phone} className="break-words">
                    <a href={`tel:${c.phone}`} className="text-[#0f7a47] hover:underline">
                      {c.name}: {c.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Social</p>
              <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Social Profiles</h2>
              <ul className="mt-3 space-y-2 text-sm font-medium text-[#707072]">
                <li className="break-words">
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f7a47] hover:underline"
                  >
                    Instagram — @paksarzameen.wfo
                  </a>
                </li>
                <li className="break-words">
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f7a47] hover:underline"
                  >
                    Facebook — PakSarzameen
                  </a>
                </li>
                <li className="break-words">
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f7a47] hover:underline"
                  >
                    LinkedIn — PakSarZameen
                  </a>
                </li>
                <li className="break-words">
                  <a
                    href={siteConfig.social.commonwealthInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f7a47] hover:underline"
                  >
                    Paksarzameen Store Instagram — @commonwealthlab.psz
                  </a>
                </li>
              </ul>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Navigation</p>
              <h3 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Quick Links</h3>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm font-medium">
                <Link href="/" className="text-[#0f7a47] hover:underline">Home</Link>
                <Link href="/about" className="text-[#0f7a47] hover:underline">About</Link>
                <Link href="/programs" className="text-[#0f7a47] hover:underline">Programs</Link>
                <Link href="/get-involved" className="text-[#0f7a47] hover:underline">Get Involved</Link>
                <Link href={siteConfig.commonwealthUrl} target="_blank" rel="noopener noreferrer" className="text-[#0f7a47] hover:underline">Paksarzameen Store</Link>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6 lg:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Message</p>
              <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Send a Message</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#707072]">
                Use the form to send us a message about volunteering, partnerships,
                campaigns, or general inquiries and we&apos;ll get back to you.
              </p>
              <div className="mt-5 rounded-2xl border border-[#E5E5E5] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Location</p>
            <h3 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Our Location</h3>
            <p className="mt-2 text-sm font-medium text-[#707072]">
              {siteConfig.contact.address}
            </p>
            <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#E5E5E5] sm:aspect-[16/8]">
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
      </main>
    </div>
  );
}
