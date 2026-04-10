"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { COMMONWEALTH_LOGO_URL } from "@/lib/constants";
import { useCartStore } from "@/store/cart";
import type { StorefrontActionItem, StorefrontNavigationData } from "@/types/storefront";
import { SidebarMenu } from "@/components/storefront/SidebarMenu";

type NavbarProps = {
  data?: StorefrontNavigationData;
};

const FALLBACK_NAVIGATION: StorefrontNavigationData = {
  menu: [],
  actions: [],
};

function actionIcon(id: StorefrontActionItem["id"]) {
  if (id === "call") return Phone;
  if (id === "wishlist") return Heart;
  if (id === "account") return User;
  return ShoppingBag;
}

export function Navbar({ data }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navigation, setNavigation] = useState<StorefrontNavigationData>(data ?? FALLBACK_NAVIGATION);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const itemCount = useCartStore((s) => s.itemCount());

  const isHome = pathname === "/";
  const darkChrome = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    if (data) {
      setNavigation(data);
      return;
    }

    let cancelled = false;

    async function loadNavigation() {
      try {
        const response = await fetch("/api/navigation", { cache: "no-store" });
        if (!response.ok) return;

        const payload = (await response.json()) as StorefrontNavigationData;
        if (!cancelled) {
          setNavigation(payload);
        }
      } catch {
        if (!cancelled) {
          setNavigation(FALLBACK_NAVIGATION);
        }
      }
    }

    loadNavigation();

    return () => {
      cancelled = true;
    };
  }, [data]);

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
    : "border-black/8 bg-white text-black backdrop-blur-md";

  const actionClassName = darkChrome
    ? "text-white/92 hover:text-white"
    : "text-black/86 hover:text-black";

  const menuData = navigation.menu;
  const actions = useMemo(() => navigation.actions, [navigation.actions]);

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
              className={`inline-flex items-center gap-3 text-[12px] font-normal tracking-[0.01em] transition-colors ${actionClassName}`}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="store-drawer-menu"
            >
              <Menu className="h-[18px] w-[18px] stroke-[1.5]" />
              <span>Menu</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`hidden items-center gap-3 text-[12px] font-normal tracking-[0.01em] transition-colors sm:inline-flex ${actionClassName}`}
              aria-label="Open search"
            >
              <Search className="h-[18px] w-[18px] stroke-[1.5]" />
              <span>Search</span>
            </button>
          </div>

          <div className="justify-self-center min-w-0">
            <Link href="/" aria-label="Paksarzameen Store home" className="text-center">
              <span
                className={
                  "block font-normal uppercase leading-none tracking-[0.12em] transition-colors duration-300 truncate " +
                  (darkChrome ? "text-white" : "text-black")
                }
                style={{ fontSize: "clamp(0.95rem,1.6vw,1.2rem)" }}
              >
                PAKSARZAMEEN Store
              </span>
            </Link>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-4 sm:gap-6">
            <Link
              href={`${process.env.NEXT_PUBLIC_MAIN_SITE_URL || "/"}/contact`}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:inline-flex text-[12px] font-normal tracking-[0.01em] transition-colors ${actionClassName}`}
            >
              Call Us
            </Link>

            <Link
              href="/cart"
              className={`relative inline-flex items-center gap-2 transition-colors ${actionClassName}`}
              aria-label="View cart"
            >
              <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" />
              {itemCount > 0 && (
                <span
                  className={`absolute -right-2.5 -top-2.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-medium ${
                    darkChrome ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className={`inline-flex items-center gap-2 transition-colors ${actionClassName}`}
              aria-label="Login"
            >
              <User className="h-[18px] w-[18px] stroke-[1.5]" />
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
          id="store-drawer-menu"
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
            <label htmlFor="store-menu-search" className="sr-only">
              Search menu
            </label>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-black/45" />
              <input
                id="store-menu-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search categories or links"
                className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/42"
              />
            </div>
          </div>

          <nav className="mt-10">
            <SidebarMenu
              data={menuData}
              searchQuery={searchQuery}
              onNavigate={() => setMenuOpen(false)}
            />
          </nav>

          <div className="mt-12 border-t border-black/10 pt-8">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[12px] text-black/72">
              {actions.map((action) => (
                <Link
                  key={`${action.id}-footer`}
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
        </aside>
      </div>
    </>
  );
}
