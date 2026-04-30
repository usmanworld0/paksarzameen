"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { navLinks } from "@/config/site";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const primaryLinks = navLinks.filter((link) => link.label !== "Paksarzameen Store");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  if (pathname.startsWith("/commonwealth-lab/products/")) return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-[#e5e5e5] transition-all duration-200 ${
          scrolled ? "bg-white/96 backdrop-blur-md" : "bg-white/92 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-4 py-3 md:px-6 lg:px-10">
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-full border border-[#cacacb] bg-[#f5f5f5]">
              <Image
                src="/paksarzameen_logo.png"
                alt="PakSarZameen"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </span>
            <span className="flex flex-col">
              <span className="text-[1.4rem] font-medium uppercase tracking-[0.24em] text-[#707072] transition-colors group-hover:text-[#111111]">
                PakSarZameen
              </span>
              <span className="text-[2rem] font-black uppercase tracking-[-0.06em] text-[#111111]">
                PAKSARZAMEEN.
              </span>
            </span>
          </Link>

          <div className="hidden min-[1180px]:flex min-[1180px]:flex-1 min-[1180px]:items-center min-[1180px]:justify-center min-[1180px]:gap-1">
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-full px-4 py-3 text-[1.25rem] font-medium uppercase tracking-[0.16em] transition-colors ${
                    isActive
                      ? "bg-[#111111] text-white"
                      : "text-[#111111] hover:bg-[#f5f5f5] hover:text-[#707072]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto hidden items-center gap-3 sm:flex">
            <Link
              href="/healthcare/doctor/sign-in"
              className="inline-flex min-h-[4.4rem] items-center justify-center rounded-full border border-[#cacacb] px-5 text-[1.2rem] font-medium uppercase tracking-[0.16em] text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#f5f5f5]"
            >
              Doctor
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-[4.4rem] items-center justify-center rounded-full bg-[#111111] px-5 text-[1.2rem] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#707072]"
            >
              Login
            </Link>
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#cacacb] bg-white text-[#111111] transition-colors hover:bg-[#f5f5f5] min-[1180px]:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-[#e5e5e5] bg-white min-[1180px]:hidden">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 py-5 md:px-6 lg:px-10">
              {primaryLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`rounded-[2rem] border px-4 py-4 text-[1.35rem] font-medium uppercase tracking-[0.16em] transition-colors ${
                      isActive
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-[#e5e5e5] bg-[#fafafa] text-[#111111] hover:border-[#111111]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 grid gap-3 border-t border-[#e5e5e5] pt-4 sm:grid-cols-2">
                <Link
                  href="/healthcare/doctor/sign-in"
                  className="inline-flex min-h-[4.8rem] items-center justify-center rounded-full border border-[#cacacb] px-4 text-center text-[1.2rem] font-medium uppercase tracking-[0.16em] text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#f5f5f5]"
                >
                  Doctor
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-h-[4.8rem] items-center justify-center rounded-full bg-[#111111] px-4 text-center text-[1.2rem] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#707072]"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="h-[7.8rem] md:h-[8.8rem]" />
    </>
  );
}
