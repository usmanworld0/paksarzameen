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
    <header className="sticky top-0 z-30 border-b border-[#E5E5E5] bg-white/90 backdrop-blur-md px-5 py-3">
      <div className="flex h-[44px] items-center gap-3">

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#707072] transition hover:border-[#111111]/30 hover:text-[#111111] md:hidden"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {/* Breadcrumb — desktop */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Breadcrumb">
          <a href="/admin" className="flex items-center gap-1 text-[#707072] transition hover:text-[#111111]">
            <Home className="h-3.5 w-3.5" />
          </a>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-[#E5E5E5]" />
              {crumb.isLast ? (
                <span className="text-sm font-black tracking-tight text-[#111111]">{crumb.label}</span>
              ) : (
                <a href={crumb.href} className="text-sm text-[#707072] transition hover:text-[#111111]">
                  {crumb.label}
                </a>
              )}
            </span>
          ))}
        </nav>

        {/* Mobile: current page title */}
        <span className="text-sm font-black tracking-tight text-[#111111] md:hidden">{currentLabel}</span>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSearch((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#707072] transition hover:border-[#111111]/30 hover:text-[#111111]"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#707072] transition hover:border-[#111111]/30 hover:text-[#111111]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="admin-pulse-dot" />
          </button>

          {/* Divider */}
          <div className="mx-1.5 h-5 w-px bg-[#E5E5E5]" />

          {/* User avatar */}
          {session && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f7a47]/10 text-[11px] font-black uppercase text-[#0f7a47]">
                {session.email.charAt(0)}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-black tracking-tight leading-none text-[#111111]">{session.email.split("@")[0]}</p>
                <p className="mt-0.5 text-[10px] font-medium capitalize leading-none text-[#707072]">{session.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search bar dropdown */}
      {showSearch && (
        <div className="border-t border-[#E5E5E5] px-0 pt-3">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#bbb]" />
            <input
              autoFocus
              type="text"
              placeholder="Search admin modules..."
              className="w-full rounded-xl border border-[#E5E5E5] bg-white py-2.5 pl-10 pr-4 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
            />
          </div>
        </div>
      )}
    </header>
  );
}
