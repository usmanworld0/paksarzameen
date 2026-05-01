"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

import { navLinks, siteConfig } from "@/config/site";
import { impactCategories } from "@/content/impact/shared";

const primaryHrefs = ["/about", "/programs", "/impact", "/get-involved", "/contact"];
const utilityHrefs = ["/healthcare", "/dog-adoption", "/news", "/commonwealth-lab"];

function toTightSummary(text: string, maxWords = 9) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [impactOpen, setImpactOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const closeTimerRef = useRef<number | null>(null);

  const primaryLinks = useMemo(
    () => navLinks.filter((link) => primaryHrefs.includes(link.href)),
    []
  );
  const utilityLinks = useMemo(
    () => navLinks.filter((link) => utilityHrefs.includes(link.href)),
    []
  );

  const displayFont = {
    fontFamily: 'var(--font-psz-display), "Arial Narrow", Arial, sans-serif',
  } as const;

  const bodyFont = {
    fontFamily: 'var(--font-psz-sans), "Helvetica Neue", Helvetica, Arial, sans-serif',
  } as const;

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= 8) {
        setIsHidden(false);
        lastScrollYRef.current = currentY;
        return;
      }

      const isScrollingUp = currentY < lastScrollYRef.current;
      const isScrollingDown = currentY > lastScrollYRef.current;

      if (isScrollingUp && currentY > 80) {
        setIsHidden(false);
      } else if (isScrollingDown) {
        setIsHidden(true);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setImpactOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (pathname.startsWith("/commonwealth-lab/products/")) return null;

  const scheduleImpactClose = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setImpactOpen(false);
    }, 120);
  };

  const openImpact = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    setImpactOpen(true);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-[#e5e5e5] bg-white transition-transform duration-300 ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto hidden w-full max-w-[1440px] items-center justify-end gap-4 px-4 pt-3 md:px-6 lg:flex lg:px-10">
          {utilityLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                style={bodyFont}
                className={`text-[1.15rem] font-medium transition-colors ${
                  isActive ? "text-[#111111]" : "text-[#707072] hover:text-[#111111]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <span className="h-4 w-px bg-[#e5e5e5]" aria-hidden="true" />

          <Link
            href="/healthcare/doctor/sign-in"
            style={bodyFont}
            className="text-[1.15rem] font-medium text-[#707072] transition-colors hover:text-[#111111]"
          >
            Doctor Portal
          </Link>
          <Link
            href="/login"
            style={bodyFont}
            className="text-[1.15rem] font-medium text-[#111111] transition-colors hover:text-[#707072]"
          >
            Sign In
          </Link>
        </div>

        <div
          className="relative"
          onMouseLeave={scheduleImpactClose}
        >
          <nav className="mx-auto flex w-full max-w-[1440px] items-center gap-6 px-4 py-4 md:px-6 lg:px-10">
            <Link href="/" className="group flex shrink-0 items-center gap-3">
              <span className="relative h-10 w-10 overflow-hidden">
                <Image
                  src="/paksarzameen_logo.png"
                  alt="PakSarZameen"
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </span>
              <span className="min-w-0 flex flex-col">
                <span
                  style={bodyFont}
                  className="hidden text-[1rem] font-medium uppercase tracking-[0.22em] text-[#707072] sm:block"
                >
                  Community Development
                </span>
                <span
                  style={displayFont}
                  className="text-[1.9rem] font-semibold uppercase leading-none tracking-[0.04em] text-[#111111] sm:text-[2.2rem]"
                >
                  PakSarZameen
                </span>
              </span>
            </Link>

            <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
              {primaryLinks.map((link) => {
                const isImpact = link.href === "/impact";
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                if (isImpact) {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={openImpact}
                      onFocus={openImpact}
                    >
                      <button
                        type="button"
                        style={bodyFont}
                        aria-expanded={impactOpen}
                        className={`inline-flex items-center gap-2 text-[1.6rem] font-medium transition-colors ${
                          isActive || impactOpen
                            ? "text-[#111111]"
                            : "text-[#111111] hover:text-[#707072]"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${impactOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={bodyFont}
                    className={`text-[1.6rem] font-medium transition-colors ${
                      isActive ? "text-[#111111]" : "text-[#111111] hover:text-[#707072]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="ml-auto hidden items-center gap-3 lg:flex">
              <Link
                href="/healthcare/blood-bank"
                style={bodyFont}
                className="inline-flex min-h-[4.4rem] items-center justify-center rounded-full bg-[#f5f5f5] px-5 text-[1.2rem] font-medium text-[#111111] transition-colors hover:bg-[#e5e5e5]"
              >
                24/7 Blood Support
              </Link>
            </div>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#cacacb] bg-white text-[#111111] transition-colors hover:bg-[#f5f5f5] lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>

          {impactOpen && (
            <div
              className="hidden border-t border-[#e5e5e5] bg-white lg:block"
              onMouseEnter={openImpact}
              onMouseLeave={scheduleImpactClose}
            >
              <div className="mx-auto grid w-full max-w-[1440px] grid-cols-4 gap-10 px-10 py-10">
                {impactCategories.map((category) => (
                  <div key={category.slug} className="min-w-0">
                    <Link
                      href={category.href}
                      style={bodyFont}
                      className="text-[2rem] font-medium text-[#111111] transition-colors hover:text-[#707072]"
                    >
                      {category.title}
                    </Link>
                    <p
                      style={bodyFont}
                      className="mt-3 max-w-[28ch] text-[1.35rem] leading-[1.7] text-[#707072]"
                    >
                      {toTightSummary(category.summary)}
                    </p>
                    <div className="mt-5 flex flex-col gap-3">
                      {category.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          style={bodyFont}
                          className="text-[1.45rem] font-medium text-[#111111] transition-colors hover:text-[#707072]"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {menuOpen && (
          <div className="border-t border-[#e5e5e5] bg-white lg:hidden">
            <div className="mx-auto flex min-h-[calc(100svh-8.8rem)] w-full max-w-[1440px] flex-col px-4 py-6 md:px-6">
              <div className="border-b border-[#e5e5e5] pb-5">
                <p
                  style={bodyFont}
                  className="text-[1.05rem] font-medium uppercase tracking-[0.2em] text-[#707072]"
                >
                  Navigation
                </p>
                <p
                  style={displayFont}
                  className="mt-3 text-[4rem] font-semibold uppercase leading-[0.92] tracking-[0.04em] text-[#111111]"
                >
                  Explore
                  <br />
                  PakSarZameen
                </p>
              </div>

              <div className="mt-5 grid gap-3">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  const isImpact = link.href === "/impact";

                  return (
                    <div key={link.href} className="rounded-[2rem] border border-[#e5e5e5] bg-[#fafafa]">
                      <Link
                        href={link.href}
                        style={bodyFont}
                        className={`block px-4 py-4 text-[1.35rem] font-medium uppercase tracking-[0.16em] transition-colors ${
                          isActive ? "text-[#111111]" : "text-[#111111]"
                        }`}
                      >
                        {link.label}
                      </Link>

                      {isImpact && (
                        <div className="border-t border-[#e5e5e5] px-4 py-4">
                          <div className="grid gap-4">
                            {impactCategories.map((category) => (
                              <div key={category.slug}>
                                <Link
                                  href={category.href}
                                  style={bodyFont}
                                  className="text-[1.3rem] font-medium uppercase tracking-[0.12em] text-[#111111]"
                                >
                                  {category.title}
                                </Link>
                                <div className="mt-2 flex flex-col gap-2">
                                  {category.items.slice(0, 2).map((item) => (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      style={bodyFont}
                                      className="text-[1.25rem] font-medium text-[#707072] transition-colors hover:text-[#111111]"
                                    >
                                      {item.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto grid gap-3 border-t border-[#e5e5e5] pt-5 sm:grid-cols-2">
                <Link
                  href="/healthcare/doctor/sign-in"
                  style={bodyFont}
                  className="inline-flex min-h-[4.8rem] items-center justify-center rounded-full border border-[#cacacb] px-4 text-center text-[1.2rem] font-medium text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#f5f5f5]"
                >
                  Doctor Portal
                </Link>
                <Link
                  href="/login"
                  style={bodyFont}
                  className="inline-flex min-h-[4.8rem] items-center justify-center rounded-full bg-[#111111] px-4 text-center text-[1.2rem] font-medium text-white transition-colors hover:bg-[#707072]"
                >
                  Sign In
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 border-t border-[#e5e5e5] pt-4">
                <Link
                  href="/healthcare/blood-bank"
                  style={bodyFont}
                  className="text-[1.15rem] font-medium text-[#707072] transition-colors hover:text-[#111111]"
                >
                  24/7 Blood Support
                </Link>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  style={bodyFont}
                  className="text-[1.15rem] font-medium text-[#707072] transition-colors hover:text-[#111111]"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="h-[8.8rem] md:h-[10.2rem]" />
    </>
  );
}
