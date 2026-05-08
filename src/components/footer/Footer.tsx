import Link from "next/link";
import { navLinks, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/6 bg-white text-neutral-800">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(181,159,130,0.1),transparent_28%),radial-gradient(circle_at_90%_85%,rgba(17,17,17,0.04),transparent_24%)]" />
      <div className="store-container relative py-16 sm:py-20">
        <div className="md:hidden">
          <div className="pb-7 text-center">
            <h3 className="text-[1.8rem] font-normal leading-none tracking-[0.06em] text-neutral-950">
              PAKSARZAMEEN
            </h3>
          </div>

          <div className="border-y border-black/10">
            <details className="border-b border-black/10 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between px-0 py-4 text-[1.05rem] text-neutral-950 [&::-webkit-details-marker]:hidden">
                Navigation
                <span className="text-[1.2rem] leading-none text-neutral-900">+</span>
              </summary>
              <ul className="space-y-3 pb-4 text-sm text-neutral-600">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors duration-300 hover:text-neutral-950">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/policies" className="transition-colors duration-300 hover:text-neutral-950">
                    Policies &amp; Terms
                  </Link>
                </li>
              </ul>
            </details>

            <details className="border-b border-black/10 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between px-0 py-4 text-[1.05rem] text-neutral-950 [&::-webkit-details-marker]:hidden">
                Ecosystem
                <span className="text-[1.2rem] leading-none text-neutral-900">+</span>
              </summary>
              <ul className="space-y-3 pb-4 text-sm text-neutral-600">
                <li>
                  <Link href="/commonwealth-lab" className="transition-colors duration-300 hover:text-neutral-950">
                    Paksarzameen Store
                  </Link>
                </li>
                <li>
                  <Link href="/dog-adoption" className="transition-colors duration-300 hover:text-neutral-950">
                    Dog Adoption
                  </Link>
                </li>
                <li>
                  <Link href="/healthcare" className="transition-colors duration-300 hover:text-neutral-950">
                    Healthcare Portal
                  </Link>
                </li>
              </ul>
            </details>

            <details className="last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between px-0 py-4 text-[1.05rem] text-neutral-950 [&::-webkit-details-marker]:hidden">
                Contact &amp; Social
                <span className="text-[1.2rem] leading-none text-neutral-900">+</span>
              </summary>
              <ul className="space-y-3 pb-4 text-sm text-neutral-600">
                <li>{siteConfig.contact.email}</li>
                <li>{siteConfig.contact.phone}</li>
                <li>{siteConfig.contact.address}</li>
                <li>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-neutral-950"
                  >
                    PakSarZameen Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.social.commonwealthInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-neutral-950"
                  >
                    Paksarzameen Store Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-neutral-950"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-neutral-950"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </details>
          </div>
        </div>

        <div className="hidden grid-cols-1 gap-10 md:grid lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div>
            <p className="store-kicker">Community Development</p>
            <h3 className="mt-3 text-[2rem] font-normal leading-[1] tracking-[-0.03em] text-neutral-950 sm:text-[2.35rem]">
              Pak<span className="text-[#0f7a47]">Sar</span>Zameen
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600">
              Building community wealth through education, health support,
              environmental action, animal welfare, and grassroots progress
              across Pakistan.
            </p>
            <p className="mt-6 text-[10px] font-normal uppercase tracking-[0.22em] text-neutral-500">
              100% focused on impact
            </p>
          </div>

          <nav aria-label="Navigation links">
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.slice(0, 5).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-950">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="More links">
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              Programs &amp; More
            </h4>
            <ul className="space-y-3">
              {navLinks.slice(5).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-950">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/policies" className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-950">
                  Policies &amp; Terms
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              Contact &amp; Social
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li>{siteConfig.contact.email}</li>
              <li>{siteConfig.contact.phone}</li>
              <li>{siteConfig.contact.address}</li>
              <li>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-neutral-950"
                >
                  PakSarZameen Instagram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.commonwealthInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-neutral-950"
                >
                  Paksarzameen Store Instagram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-neutral-950"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-neutral-950"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-black/6 pt-6 sm:flex-row">
          <p className="text-[10px] tracking-[0.18em] text-neutral-500">
            &copy; {new Date().getFullYear()} PakSarZameen. All rights reserved.
          </p>
          <p className="text-[10px] tracking-[0.22em] text-neutral-400">
            Bahawalpur, Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
