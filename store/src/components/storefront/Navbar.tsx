"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { NAV_LINKS, MAIN_SITE_URL } from "@/lib/constants";
import { useCartStore } from "@/store/cart";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/40 bg-[#f7f5ef]/85 backdrop-blur-xl shadow-[0_8px_28px_rgba(16,24,20,0.08)]">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-brand-green/20 bg-brand-green/10 text-xs font-bold uppercase tracking-[0.2em] text-brand-green">
            CL
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-green">
              PakSarZameen
            </span>
            <span className="block text-lg font-semibold tracking-tight text-brand-charcoal">
              Commonwealth <span className="text-brand-gold">Lab</span>
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[11px] font-semibold text-neutral-600 hover:text-brand-charcoal transition-colors tracking-[0.2em] uppercase"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={MAIN_SITE_URL}
              className="rounded-sm border border-brand-green/20 bg-brand-green/10 px-3 py-1.5 text-[10px] font-semibold text-brand-green hover:bg-brand-green hover:text-white transition-colors tracking-[0.2em] uppercase"
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
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-brand-green text-[10px] font-bold text-white flex items-center justify-center">
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
        <div className="md:hidden border-t border-brand-green/10 bg-[#f7f5ef]">
          <ul className="flex flex-col py-4 px-6 gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-semibold text-neutral-700 tracking-[0.2em] uppercase"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={MAIN_SITE_URL}
                className="text-sm font-medium text-brand-green tracking-wide uppercase"
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
