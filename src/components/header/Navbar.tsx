"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Phone, Search, X } from "lucide-react";

import { navLinks, siteConfig } from "@/config/site";

type HeaderAction = {
  label: string;
  href: string;
  external?: boolean;
};

const HEADER_ACTIONS: HeaderAction[] = [
  {
    label: "Call Us",
    href: "/contact",
  },
  {
    label: "Doctor Portal",
    href: "/healthcare/doctor/sign-in",
  },
  {
    label: "Store",
    href: "/commonwealth-lab",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === "/";
  const darkChrome = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuOpen) return;
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const chromeClassName = darkChrome
    ? "border-transparent bg-transparent text-white"
    : "border-black/8 bg-white/95 text-black backdrop-blur-md";

  const actionClassName = darkChrome
    ? "text-white/92 hover:text-white"
    : "text-black/86 hover:text-black";

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredLinks = useMemo(() => {
    if (!normalizedQuery) return navLinks;

    return navLinks.filter((link) => {
      const haystack = `${link.label} ${link.href}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const filteredActions = useMemo(() => {
    if (!normalizedQuery) return HEADER_ACTIONS;

    return HEADER_ACTIONS.filter((action) => {
      const haystack = `${action.label} ${action.href}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${chromeClassName}`}
      >
        <nav className="store-container grid h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`inline-flex items-center gap-3 text-[1.4rem] font-normal tracking-[0.01em] transition-colors ${actionClassName}`}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="psz-drawer-menu"
            >
              <Menu className="h-[18px] w-[18px] stroke-[1.5]" />
              <span>Menu</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`hidden items-center gap-3 text-[12px] font-normal tracking-[0.01em] transition-colors sm:inline-flex ${actionClassName}`}
              aria-label="Open navigation search"
            >
              <Search className="h-[18px] w-[18px] stroke-[1.5]" />
              <span>Search</span>
            </button>
          </div>

          <div className="min-w-0 justify-self-center">
            <Link href="/" aria-label="Paksarzameen home" className="text-center">
              <span
                className={
                  "block truncate font-normal uppercase leading-none tracking-[0.16em] transition-colors duration-300 " +
                  (darkChrome ? "text-white" : "text-black")
                }
                style={{ fontSize: "clamp(1.8rem, 2vw, 2.4rem)" }}
              >
                PAKSARZAMEEN
              </span>
            </Link>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-4 sm:gap-6">
            <Link
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
              className={`hidden md:inline-flex text-[12px] font-normal tracking-[0.01em] transition-colors ${actionClassName}`}
            >
              Call Us
            </Link>

            <Link
              href="/commonwealth-lab"
              className={`hidden sm:inline-flex text-[12px] font-normal tracking-[0.01em] transition-colors ${actionClassName}`}
            >
              Store
            </Link>

            <Link
              href="/get-involved"
              className={`inline-flex items-center gap-2 transition-colors ${actionClassName}`}
              aria-label="Get involved"
            >
              <Phone className="h-[18px] w-[18px] stroke-[1.5] sm:hidden" />
              <span className="hidden text-[1.4rem] font-normal tracking-[0.01em] sm:inline">
                Get Involved
              </span>
            </Link>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[70] transition-all duration-500 ${
          menuOpen
            ? "pointer-events-auto bg-black/48 backdrop-blur-[1.5px]"
            : "pointer-events-none bg-black/0"
        }`}
        aria-hidden={!menuOpen}
      >
        <aside
          id="psz-drawer-menu"
          ref={drawerRef}
          className={`h-full w-[min(92vw,620px)] overflow-y-auto bg-white px-7 pb-10 pt-7 text-black shadow-[30px_0_80px_rgba(0,0,0,0.24)] transition-transform duration-500 sm:px-9 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-4 text-[13px] font-normal tracking-[0.01em] text-black"
            >
              <X className="h-[18px] w-[18px] stroke-[1.5]" />
              <span>Close</span>
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-3">
            <label htmlFor="psz-menu-search" className="sr-only">
              Search navigation
            </label>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-black/45" />
              <input
                id="psz-menu-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search pages or links"
                className="w-full bg-transparent text-[1.4rem] text-black outline-none placeholder:text-black/42"
              />
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/35">
                Navigate
              </p>
              <nav className="flex flex-col gap-3">
                {filteredLinks.map((link) => {
                  const active = pathname === link.href;

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`text-[clamp(2.88rem,3.5vw,4.32rem)] leading-[1.02] tracking-[-0.03em] transition-colors ${
                        active ? "text-black" : "text-black/68 hover:text-black"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-black/10 pt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/35">
                Quick Links
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[12px] text-black/72">
                {filteredActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    className="transition-opacity hover:opacity-60"
                    onClick={() => setMenuOpen(false)}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
