import Link from "next/link";
import { MAIN_SITE_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/6 bg-white text-neutral-800">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(181,159,130,0.1),transparent_28%),radial-gradient(circle_at_90%_85%,rgba(17,17,17,0.04),transparent_24%)]" />
      <div className="store-container relative py-16 sm:py-20">
        <div className="md:hidden">
          <div className="pb-7 text-center">
            <h3 className="text-[1.8rem] font-normal leading-none tracking-[0.06em] text-neutral-950">
              PAKSARZAMEEN STORE
            </h3>
          </div>

          <div className="border-y border-black/10">
            <details className="border-b border-black/10 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between px-0 py-4 text-[1.05rem] text-neutral-950 [&::-webkit-details-marker]:hidden">
                Shop
                <span className="text-[1.2rem] leading-none text-neutral-900">+</span>
              </summary>
              <ul className="space-y-3 pb-4 text-sm text-neutral-600">
                <li>
                  <Link href="/products" className="transition-colors duration-300 hover:text-neutral-950">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/artists" className="transition-colors duration-300 hover:text-neutral-950">
                    Artisans
                  </Link>
                </li>
                <li>
                  <Link href="/customizations" className="transition-colors duration-300 hover:text-neutral-950">
                    Bespoke Orders
                  </Link>
                </li>
                <li>
                  <Link href="/policies" className="transition-colors duration-300 hover:text-neutral-950">
                    Policies &amp; Terms
                  </Link>
                </li>
              </ul>
            </details>

            <details className="border-b border-black/10 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between px-0 py-4 text-[1.05rem] text-neutral-950 [&::-webkit-details-marker]:hidden">
                PakSarZameen
                <span className="text-[1.2rem] leading-none text-neutral-900">+</span>
              </summary>
              <ul className="space-y-3 pb-4 text-sm text-neutral-600">
                <li>
                  <Link href={`${MAIN_SITE_URL}/about`} className="transition-colors duration-300 hover:text-neutral-950" target="_blank" rel="noopener noreferrer">
                    About PSZ
                  </Link>
                </li>
                <li>
                  <Link href={`${MAIN_SITE_URL}/programs`} className="transition-colors duration-300 hover:text-neutral-950" target="_blank" rel="noopener noreferrer">
                    Programs
                  </Link>
                </li>
                <li>
                  <Link href={`${MAIN_SITE_URL}/get-involved`} className="transition-colors duration-300 hover:text-neutral-950" target="_blank" rel="noopener noreferrer">
                    Get Involved
                  </Link>
                </li>
              </ul>
            </details>

            <details className="last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between px-0 py-4 text-[1.05rem] text-neutral-950 [&::-webkit-details-marker]:hidden">
                Contact
                <span className="text-[1.2rem] leading-none text-neutral-900">+</span>
              </summary>
              <ul className="space-y-3 pb-4 text-sm text-neutral-600">
                <li>storepaksarzameen@gmail.com</li>
                <li>+92 303 5763435</li>
                <li>1257, Street 47, Sector A, DHA Bahawalpur, Punjab, Pakistan</li>
                <li>
                  <a
                    href="https://www.instagram.com/commonwealthlab.psz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-neutral-950"
                  >
                    Paksarzameen Store Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/paksarzameen.wfo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-neutral-950"
                  >
                    PakSarZameen Instagram
                  </a>
                </li>
              </ul>
            </details>
          </div>
        </div>

        <div className="hidden grid-cols-1 gap-10 md:grid lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div>
            <p className="store-kicker">PakSarZameen Ecosystem</p>
            <h3 className="mt-3 text-[2rem] font-normal leading-[1] tracking-[-0.03em] text-neutral-950 sm:text-[2.35rem]">
              Paksarzameen Store
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600">
              An elevated artisan marketplace shaped around restraint, heritage,
              and purposeful commerce. Every order contributes directly to
              artisans and PakSarZameen community programmes.
            </p>
            <p className="mt-6 text-[10px] font-normal uppercase tracking-[0.22em] text-neutral-500">
              100% profits to impact
            </p>
          </div>

          <nav aria-label="Shop links">
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-950">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-950">
                  Artisans
                </Link>
              </li>
              <li>
                <Link href="/customizations" className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-950">
                  Bespoke Orders
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-950">
                  Policies &amp; Terms
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Organization links">
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              PakSarZameen
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href={`${MAIN_SITE_URL}/about`} className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-950" target="_blank" rel="noopener noreferrer">
                  About PSZ
                </Link>
              </li>
              <li>
                <Link href={`${MAIN_SITE_URL}/programs`} className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-950" target="_blank" rel="noopener noreferrer">
                  Programs
                </Link>
              </li>
              <li>
                <Link href={`${MAIN_SITE_URL}/get-involved`} className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-950" target="_blank" rel="noopener noreferrer">
                  Get Involved
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li>storepaksarzameen@gmail.com</li>
              <li>+92 303 5763435</li>
              <li>1257, Street 47, Sector A, DHA Bahawalpur, Punjab, Pakistan</li>
              <li>
                <a
                  href="https://www.instagram.com/commonwealthlab.psz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-neutral-950"
                >
                  Paksarzameen Store Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/paksarzameen.wfo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-neutral-950"
                >
                  PakSarZameen Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-black/6 pt-6 sm:flex-row">
          <p className="text-[10px] tracking-[0.18em] text-neutral-500">
            &copy; {new Date().getFullYear()} Paksarzameen Store by PakSarZameen. All rights reserved.
          </p>
          <p className="text-[10px] tracking-[0.22em] text-neutral-400">
            Development by innovyx dev
          </p>
        </div>
      </div>
    </footer>
  );
}
