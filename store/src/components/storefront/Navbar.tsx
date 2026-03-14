"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { NAV_LINKS, MAIN_SITE_URL, COMMONWEALTH_LOGO_URL } from "@/lib/constants";
import { useCartStore } from "@/store/cart";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm border border-[#0c2e1a]/20 bg-[#0c2e1a]/5">
            <Image
              src={COMMONWEALTH_LOGO_URL}
              alt="Commonwealth Lab logo"
              fill
              sizes="40px"
              className="object-contain p-1"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0c2e1a]/70">
              PakSarZameen
            </span>
            <span className="block text-lg tracking-tight text-neutral-900">
              Commonwealth <span className="text-[#0c2e1a]">Lab</span>
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors tracking-[0.25em] uppercase"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={MAIN_SITE_URL}
              className="rounded-full border border-[#0c2e1a]/20 bg-[#0c2e1a]/5 px-4 py-1.5 text-[10px] font-medium text-[#0c2e1a] hover:bg-[#0c2e1a] hover:text-white transition-all tracking-[0.25em] uppercase"
              target="_blank"
              rel="noopener noreferrer"
            >
              PSZ
            </Link>
          </li>
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link href="/products" className="hidden md:block">
            <Search className="h-5 w-5 text-neutral-500 hover:text-brand-charcoal transition-colors" />
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingBag className="h-5 w-5 text-neutral-500 hover:text-brand-charcoal transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[#0c2e1a] text-[10px] font-bold text-white flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white">
          <ul className="flex flex-col py-4 px-6 gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-medium text-neutral-600 tracking-[0.25em] uppercase"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={MAIN_SITE_URL}
                className="text-xs font-medium text-[#0c2e1a] tracking-[0.25em] uppercase"
                target="_blank"
                rel="noopener noreferrer"
              >
                PakSarZameen
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
