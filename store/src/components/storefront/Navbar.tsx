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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d9cdc4]/80 bg-[#fffcf8]/85 backdrop-blur-xl">
      <nav className="store-container flex h-[72px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#2c3d31]/20 bg-white">
            <Image
              src={COMMONWEALTH_LOGO_URL}
              alt="Paksarzameen Store logo"
              fill
              sizes="44px"
              className="object-contain p-1"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-[9px] font-semibold uppercase tracking-[0.32em] text-[#2c3d31]/60">
              PakSarZameen
            </span>
            <span className="block text-[1.35rem] leading-none tracking-tight text-neutral-900">
              Paksarzameen Store
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[10px] font-semibold uppercase tracking-[0.26em] text-neutral-500 transition-colors hover:text-[#2c3d31]"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={MAIN_SITE_URL}
              className="rounded-full border border-[#2c3d31]/25 bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2c3d31] transition-all hover:bg-[#2c3d31] hover:text-white"
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
            <Search className="h-5 w-5 text-neutral-500 transition-colors hover:text-[#2c3d31]" />
          </Link>
          <Link href="/cart" className="relative rounded-full border border-transparent p-1 transition-colors hover:border-[#2c3d31]/20">
            <ShoppingBag className="h-5 w-5 text-neutral-500 transition-colors hover:text-[#2c3d31]" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2c3d31] text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md border border-[#2c3d31]/20 p-1.5 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-neutral-700" />
            ) : (
              <Menu className="h-5 w-5 text-neutral-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#e6dbd3] bg-[#fffaf5] lg:hidden">
          <ul className="store-container flex flex-col gap-4 py-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={MAIN_SITE_URL}
                className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2c3d31]"
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
