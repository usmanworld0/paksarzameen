"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Bell, ChevronRight, Home } from "lucide-react";
import { useAdminClientSession } from "@/features/auth/utils/admin-session-client";

type Props = { onToggleSidebar: () => void; sidebarOpen: boolean };

const BREADCRUMB_LABELS: Record<string, string> = {
  admin: "Dashboard",
  users: "Users & Tenants",
  "blood-requests": "Blood Requests",
  healthcare: "HealthCare",
  dogs: "Dogs",
  "adoption-requests": "Adoption Requests",
  "dog-updates": "Dog Updates",
};

export function MainAdminHeader({ onToggleSidebar, sidebarOpen }: Props) {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const { session } = useAdminClientSession();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const label = BREADCRUMB_LABELS[segment] ?? segment;
      return { href, label, isLast: index === segments.length - 1 };
    });
  }, [pathname]);

  const currentLabel = breadcrumbs[breadcrumbs.length - 1]?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="flex h-[60px] items-center gap-3 px-4 sm:px-6">

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 md:hidden"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Breadcrumb — desktop */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Breadcrumb">
          <a href="/admin" className="flex items-center gap-1 text-slate-400 transition hover:text-slate-600">
            <Home className="h-3.5 w-3.5" />
          </a>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-slate-300" />
              {crumb.isLast ? (
                <span className="text-[13px] font-semibold text-slate-800">{crumb.label}</span>
              ) : (
                <a href={crumb.href} className="text-[13px] text-slate-400 transition hover:text-slate-600">
                  {crumb.label}
                </a>
              )}
            </span>
          ))}
        </nav>

        {/* Mobile: current page title */}
        <span className="text-[14px] font-semibold text-slate-800 md:hidden">{currentLabel}</span>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSearch((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="admin-pulse-dot" />
          </button>

          {/* Divider */}
          <div className="mx-1.5 h-5 w-px bg-slate-200" />

          {/* User avatar */}
          {session && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-[11px] font-bold uppercase text-white shadow-sm">
                {session.email.charAt(0)}
              </div>
              <div className="hidden lg:block">
                <p className="text-[12px] font-semibold leading-none text-slate-800">{session.email.split("@")[0]}</p>
                <p className="mt-0.5 text-[10px] capitalize leading-none text-slate-400">{session.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search bar dropdown */}
      {showSearch && (
        <div className="border-t border-slate-100 px-4 py-3 sm:px-6">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              autoFocus
              type="text"
              placeholder="Search admin modules..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-300 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
        </div>
      )}
    </header>
  );
}
