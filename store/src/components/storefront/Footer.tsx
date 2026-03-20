import Link from "next/link";
import { MAIN_SITE_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#e5d8cf] bg-[#f7eee8] text-neutral-800">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(209,147,146,0.18),transparent_36%),radial-gradient(circle_at_85%_90%,rgba(40,56,45,0.12),transparent_42%)]" />
      <div className="store-container relative py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-neutral-500">PakSarZameen Ecosystem</p>
            <h3 className="mb-3 text-3xl leading-tight tracking-tight">
              Paksarzameen Store
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              A premium artisan marketplace by PakSarZameen. Every purchase
              empowers micro-entrepreneurs and preserves Pakistan&apos;s craft heritage.
            </p>
          </div>

          {/* Shop */}
          <nav aria-label="Shop links">
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              Shop
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products" className="text-sm text-neutral-600 transition-colors hover:text-[#2c3d31]">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-sm text-neutral-600 transition-colors hover:text-[#2c3d31]">
                  Artisans
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-sm text-neutral-600 transition-colors hover:text-[#2c3d31]">
                  Policies &amp; Terms
                </Link>
              </li>
            </ul>
          </nav>

          {/* PakSarZameen */}
          <nav aria-label="Organization links">
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              PakSarZameen
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`${MAIN_SITE_URL}/about`} className="text-sm text-neutral-600 transition-colors hover:text-[#2c3d31]" target="_blank" rel="noopener noreferrer">
                  About PSZ
                </Link>
              </li>
              <li>
                <Link href={`${MAIN_SITE_URL}/programs`} className="text-sm text-neutral-600 transition-colors hover:text-[#2c3d31]" target="_blank" rel="noopener noreferrer">
                  Programs
                </Link>
              </li>
              <li>
                <Link href={`${MAIN_SITE_URL}/get-involved`} className="text-sm text-neutral-600 transition-colors hover:text-[#2c3d31]" target="_blank" rel="noopener noreferrer">
                  Get Involved
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li>storepaksarzameen@gmail.com</li>
              <li>+92 303 5763435</li>
              <li>1257, Street 47, Sector A, DHA Bahawalpur, Punjab, Pakistan</li>
              <li>
                <a
                  href="https://www.instagram.com/commonwealthlab.psz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#2c3d31]"
                >
                  Paksarzameen Store Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/paksarzameen.wfo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#2c3d31]"
                >
                  PakSarZameen Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-[#dfd0c6] pt-6 sm:flex-row">
          <p className="text-[10px] tracking-wide text-neutral-500">
            &copy; {new Date().getFullYear()} Paksarzameen Store by PakSarZameen. All rights reserved.
          </p>
          <p className="text-[10px] text-neutral-400">
            Development by 04
          </p>
        </div>
      </div>
    </footer>
  );
}
