import Image from "next/image";
import Link from "next/link";
import { navLinks, siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#e5e5e5] bg-white text-[#111111]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 py-16 md:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:px-10 lg:py-20">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="relative h-14 w-14 overflow-hidden rounded-full border border-[#cacacb] bg-[#f5f5f5]">
              <Image
                src="/paksarzameen_logo.png"
                alt="PakSarZameen"
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
            <span className="text-[1.2rem] font-medium uppercase tracking-[0.24em] text-[#707072]">
              PakSarZameen
            </span>
          </div>

          <h2 className="max-w-[7ch] text-[4rem] font-black uppercase leading-[0.9] tracking-[-0.08em] md:text-[6rem]">
            PAKSAR
            <br />
            ZAMEEN.
          </h2>

          <p className="max-w-xl border-l-2 border-[#111111] pl-5 text-[1.55rem] font-medium leading-[1.7] text-[#707072]">
            Building community wealth through grassroots progress across Pakistan.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex min-h-[4.8rem] items-center justify-center rounded-full bg-[#111111] px-6 text-[1.2rem] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#707072]"
            >
              Email Us
            </a>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
              className="inline-flex min-h-[4.8rem] items-center justify-center rounded-full border border-[#cacacb] px-6 text-[1.2rem] font-medium uppercase tracking-[0.16em] text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#f5f5f5]"
            >
              Call Us
            </a>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          <div className="flex flex-col gap-4">
            <h3 className="border-b border-[#e5e5e5] pb-3 text-[1.2rem] font-medium uppercase tracking-[0.2em] text-[#707072]">
              Navigation
            </h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[1.35rem] font-medium uppercase tracking-[0.08em] text-[#111111] transition-colors hover:text-[#707072]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="border-b border-[#e5e5e5] pb-3 text-[1.2rem] font-medium uppercase tracking-[0.2em] text-[#707072]">
              Support
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/contact"
                  className="text-[1.35rem] font-medium uppercase tracking-[0.08em] text-[#111111] transition-colors hover:text-[#707072]"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[1.35rem] font-medium uppercase tracking-[0.08em] text-[#111111] transition-colors hover:text-[#707072]"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[1.35rem] font-medium uppercase tracking-[0.08em] text-[#111111] transition-colors hover:text-[#707072]"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="border-b border-[#e5e5e5] pb-3 text-[1.2rem] font-medium uppercase tracking-[0.2em] text-[#707072]">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/"
                  className="text-[1.35rem] font-medium uppercase tracking-[0.08em] text-[#111111] transition-colors hover:text-[#707072]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[1.35rem] font-medium uppercase tracking-[0.08em] text-[#111111] transition-colors hover:text-[#707072]"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[1.35rem] font-medium uppercase tracking-[0.08em] text-[#111111] transition-colors hover:text-[#707072]"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e5e5e5]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-6 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="text-[1.1rem] font-medium uppercase tracking-[0.18em] text-[#707072]">
            Copyright {currentYear} Paksarzameen. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#"
              className="text-[1.1rem] font-medium uppercase tracking-[0.18em] text-[#707072] transition-colors hover:text-[#111111]"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-[1.1rem] font-medium uppercase tracking-[0.18em] text-[#707072] transition-colors hover:text-[#111111]"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-[1.1rem] font-medium uppercase tracking-[0.18em] text-[#707072] transition-colors hover:text-[#111111]"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[#111111]">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-4 md:px-6 lg:px-10">
          <p className="text-[1rem] font-medium uppercase tracking-[0.2em] text-[#cacacb]">
            Built for community. Designed for impact.
          </p>
        </div>
      </div>
    </footer>
  );
}
