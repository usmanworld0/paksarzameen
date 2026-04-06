"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customizationsOpen, setCustomizationsOpen] = useState(false);
  const [mobileCustomizationsOpen, setMobileCustomizationsOpen] = useState(false);
  const [customizationCategories, setCustomizationCategories] = useState<
    CustomizationCategory[]
  >([]);
  const customizationsRef = useRef<HTMLLIElement | null>(null);
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        customizationsRef.current &&
        !customizationsRef.current.contains(event.target as Node)
      ) {
        setCustomizationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCustomizationsOpen(false);
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e5d8cf] bg-white/92 backdrop-blur-xl">
      <nav className="store-container flex h-[72px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#d8cec6] bg-white shadow-[0_8px_18px_rgba(33,28,20,0.06)]">
            <Image
              src={COMMONWEALTH_LOGO_URL}
              alt="Paksarzameen Store logo"
              fill
              sizes="40px"
              className="object-contain p-1.5"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-[8px] font-semibold uppercase tracking-[0.36em] text-[#0f7a47]/65">
              PakSarZameen
            </span>
            <span className="block text-[1.15rem] leading-none tracking-[0.01em] text-neutral-900 transition-colors group-hover:text-[#0f7a47]">
              Paksarzameen Store
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            if (link.label === "Customizations") {
              const customizationsActive =
                pathname.startsWith("/customizations") || pathname.startsWith("/categories/");

              return (
                <li
                  key={link.href}
                  className="relative"
                  ref={customizationsRef}
                >
                  <button
                    type="button"
                    onClick={() => setCustomizationsOpen((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors ${
                      customizationsActive
                        ? "text-[#0f7a47]"
                        : "text-neutral-500 hover:text-[#0f7a47]"
                    }`}
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
                    <div className="absolute left-0 top-full z-50 mt-3 w-[300px] rounded-2xl border border-[#e5d8cf] bg-white p-3 shadow-[0_16px_36px_rgba(33,28,20,0.08)]">
                      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
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
                              href={`/customizations/${category.slug}`}
                              className="block rounded-xl px-2.5 py-2 text-sm text-neutral-700 transition-colors hover:bg-[#faf6f1] hover:text-[#0f7a47]"
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
                          className="block rounded-xl px-2.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f7a47] transition-colors hover:bg-[#faf6f1] hover:text-[#081c10]"
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

            const isActive =
              link.href.startsWith("/") &&
              (pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href)));

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors ${
                    isActive ? "text-[#0f7a47]" : "text-neutral-500 hover:text-[#0f7a47]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href={MAIN_SITE_URL}
              className="rounded-full border border-[#d8cec6] bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f1f1f] transition-all hover:border-[#0f7a47] hover:bg-[#0f7a47] hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              PakSarZameen
            </Link>
          </li>
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/products" className="hidden md:block">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-neutral-500 transition-colors hover:border-[#e5d8cf] hover:text-[#0f7a47]">
              <Search className="h-4.5 w-4.5" />
            </span>
          </Link>
          <Link href="/cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent transition-colors hover:border-[#E0E0E0]">
            <ShoppingBag className="h-4.5 w-4.5 text-neutral-500 transition-colors hover:text-[#0f7a47]" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0f7a47] px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full border border-[#e5d8cf] p-1.5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-neutral-900" />
            ) : (
              <Menu className="h-5 w-5 text-neutral-900" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-[#e5d8cf] bg-white lg:hidden">
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
                      className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500"
                      aria-expanded={mobileCustomizationsOpen}
                      aria-controls="mobile-customizations-menu"
                    >
                      <span>Customizations</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          mobileCustomizationsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {mobileCustomizationsOpen && (
                      <div id="mobile-customizations-menu" className="mt-3 space-y-2 border-l border-[#e5d8cf] pl-4">
                        {customizationCategories.length === 0 ? (
                          <p className="text-xs text-neutral-500">
                            No customizable categories available.
                          </p>
                        ) : (
                          customizationCategories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/customizations/${category.slug}`}
                              className="block text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 hover:text-[#0f7a47]"
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
                          className="block pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0f7a47] hover:text-[#081c10]"
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
                    className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-700 transition-colors hover:text-[#0f7a47]"
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
                className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f7a47] hover:text-[#081c10]"
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
