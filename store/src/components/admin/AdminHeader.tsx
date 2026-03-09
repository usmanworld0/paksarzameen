"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  X,
  Bell,
  ChevronRight,
  LogOut,
  Store,
  Search,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STORE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "/";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const BREADCRUMB_LABELS: Record<string, string> = {
  admin: "Dashboard",
  products: "Products",
  categories: "Categories",
  artists: "Artisans",
  sales: "Sales & Discounts",
  analytics: "Analytics",
  settings: "Settings",
  new: "New",
};

export function AdminHeader({ onToggleSidebar, sidebarOpen }: AdminHeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  const segments = pathname?.split("/").filter(Boolean) || [];
  const breadcrumbs = segments.map((seg, i) => ({
    label: BREADCRUMB_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100/80 bg-white/80 backdrop-blur-xl" suppressHydrationWarning>
      <div className="flex h-[64px] items-center gap-3 px-4 sm:px-6">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden h-9 w-9 rounded-lg"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Breadcrumbs */}
        <nav className="hidden items-center gap-1.5 text-[11px] md:flex" aria-label="Breadcrumb">
          {mounted && breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3 text-neutral-200" />}
              {crumb.isLast ? (
                <span className="font-semibold uppercase tracking-[0.12em] text-neutral-800">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="uppercase tracking-[0.12em] text-neutral-400 transition-colors hover:text-brand-green"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5" suppressHydrationWarning>
          {/* Search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-neutral-400 hover:text-neutral-700"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* View Store */}
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12px] font-medium text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-700"
          >
            <Store className="h-3.5 w-3.5" />
            Store
          </a>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-neutral-400 hover:text-neutral-700">
            <Bell className="h-4 w-4" />
            <span className="admin-pulse-dot" />
          </Button>

          {/* User menu */}
          {mounted && (
            <div className="relative ml-1">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-green/20 to-brand-green/10 text-xs font-bold text-brand-green ring-1 ring-brand-green/10">
                  {session?.user?.name?.[0]?.toUpperCase() || "A"}
                </span>
                <span className="hidden sm:block text-left">
                  <span className="block text-[12px] font-semibold text-neutral-700">
                    {session?.user?.name || "Admin"}
                  </span>
                  <span className="block text-[10px] text-neutral-400">
                    Administrator
                  </span>
                </span>
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-neutral-100 bg-white p-1.5 shadow-xl shadow-black/5">
                    <div className="border-b border-neutral-100 px-3 py-2.5 mb-1">
                      <p className="text-[13px] font-semibold text-neutral-800">{session?.user?.name || "Admin"}</p>
                      <p className="text-[11px] text-neutral-400">{session?.user?.email}</p>
                    </div>
                    <Link
                      href="/admin/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50"
                    >
                      <Settings className="h-3.5 w-3.5" /> Settings
                    </Link>
                    <Link
                      href={STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50 sm:hidden"
                    >
                      <Store className="h-3.5 w-3.5" /> View Store
                    </Link>
                    <div className="my-1 h-px bg-neutral-100" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/admin/login" })}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search bar (expandable) */}
      {showSearch && (
        <div className="border-t border-neutral-100/60 px-4 py-3 sm:px-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-300" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search products, categories, artists..."
              className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50/50 pl-10 pr-4 text-sm text-neutral-700 placeholder:text-neutral-300 focus:border-brand-green/30 focus:outline-none focus:ring-2 focus:ring-brand-green/10"
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowSearch(false);
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
