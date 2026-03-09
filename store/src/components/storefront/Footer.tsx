import Link from "next/link";
import { MAIN_SITE_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0c2e1a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(196,162,101,0.08),transparent_42%),radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.03),transparent_48%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/40">PakSarZameen Ecosystem</p>
            <h3 className="text-xl tracking-tight mb-3">
              Commonwealth Lab
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              A premium artisan marketplace by PakSarZameen. Every purchase
              empowers micro-entrepreneurs and preserves Pakistan&apos;s craft heritage.
            </p>
          </div>

          {/* Shop */}
          <nav aria-label="Shop links">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products" className="text-sm text-white/50 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-sm text-white/50 hover:text-white transition-colors">
                  Artisans
                </Link>
              </li>
            </ul>
          </nav>

          {/* PakSarZameen */}
          <nav aria-label="Organization links">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">
              PakSarZameen
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`${MAIN_SITE_URL}/about`} className="text-sm text-white/50 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  About PSZ
                </Link>
              </li>
              <li>
                <Link href={`${MAIN_SITE_URL}/programs`} className="text-sm text-white/50 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  Programs
                </Link>
              </li>
              <li>
                <Link href={`${MAIN_SITE_URL}/get-involved`} className="text-sm text-white/50 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  Get Involved
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>info@paksarzameenwfo.com</li>
              <li>Lahore, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-white/25 tracking-wide">
            &copy; {new Date().getFullYear()} Commonwealth Lab by PakSarZameen. All rights reserved.
          </p>
          <p className="text-[10px] text-white/15">
            Development by 04
          </p>
        </div>
      </div>
    </footer>
  );
}
