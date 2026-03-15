"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Search, ChevronDown } from "lucide-react";
import { NAV_LINKS, MAIN_SITE_URL, COMMONWEALTH_LOGO_URL } from "@/lib/constants";
import { useCartStore } from "@/store/cart";

type CustomizationCategory = {
  id: string;
  name: string;
  slug: string;
  customizable: boolean;
  _count?: {
    customizationOptions?: number;
  };
};

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customizationsOpen, setCustomizationsOpen] = useState(false);
  const [mobileCustomizationsOpen, setMobileCustomizationsOpen] = useState(false);
  const [customizationCategories, setCustomizationCategories] = useState<
    CustomizationCategory[]
  >([]);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    let cancelled = false;

    async function loadCustomizationCategories() {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as CustomizationCategory[];
        if (cancelled) return;

        setCustomizationCategories(
          data.filter(
            (category) =>
              category.customizable &&
              (category._count?.customizationOptions ?? 0) > 0
          )
        );
      } catch {
        if (!cancelled) setCustomizationCategories([]);
      }
    }

    loadCustomizationCategories();

    return () => {
      cancelled = true;
    };
  }, []);

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
          {NAV_LINKS.map((link) => {
            if (link.label === "Customizations") {
              return (
                <li
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setCustomizationsOpen(true)}
                  onMouseLeave={() => setCustomizationsOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setCustomizationsOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-neutral-500 transition-colors hover:text-[#2c3d31]"
                    aria-expanded={customizationsOpen}
                    aria-haspopup="menu"
                  >
                    <span>Customizations</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        customizationsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {customizationsOpen && (
                    <div className="absolute left-0 top-full z-50 mt-3 w-[280px] rounded-2xl border border-[#e4d8cf] bg-white/95 p-3 shadow-lg backdrop-blur">
                      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        Available Categories
                      </p>
                      <div className="max-h-64 space-y-1 overflow-auto pr-1">
                        {customizationCategories.length === 0 ? (
                          <p className="px-2 py-2 text-xs text-neutral-500">
                            No customizable categories available.
                          </p>
                        ) : (
                          customizationCategories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/categories/${category.slug}`}
                              className="block rounded-lg px-2 py-2 text-sm text-neutral-700 transition-colors hover:bg-[#f6eee8] hover:text-[#2c3d31]"
                              onClick={() => setCustomizationsOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))
                        )}
                      </div>
                      <div className="mt-2 border-t border-[#efe4dc] pt-2">
                        <Link
                          href="/customizations"
                          className="block rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#2c3d31] transition-colors hover:bg-[#f6eee8]"
                          onClick={() => setCustomizationsOpen(false)}
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[10px] font-semibold uppercase tracking-[0.26em] text-neutral-500 transition-colors hover:text-[#2c3d31]"
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
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
            {NAV_LINKS.map((link) => {
              if (link.label === "Customizations") {
                return (
                  <li key={link.href}>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileCustomizationsOpen((prev) => !prev)
                      }
                      className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600"
                    >
                      <span>Customizations</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          mobileCustomizationsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {mobileCustomizationsOpen && (
                      <div className="mt-3 space-y-2 border-l border-[#dfd1c7] pl-4">
                        {customizationCategories.length === 0 ? (
                          <p className="text-xs text-neutral-500">
                            No customizable categories available.
                          </p>
                        ) : (
                          customizationCategories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/categories/${category.slug}`}
                              className="block text-xs font-medium uppercase tracking-[0.16em] text-[#2c3d31]"
                              onClick={() => {
                                setMobileCustomizationsOpen(false);
                                setMobileOpen(false);
                              }}
                            >
                              {category.name}
                            </Link>
                          ))
                        )}
                        <Link
                          href="/customizations"
                          className="block pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500"
                          onClick={() => {
                            setMobileCustomizationsOpen(false);
                            setMobileOpen(false);
                          }}
                        >
                          View All
                        </Link>
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
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
