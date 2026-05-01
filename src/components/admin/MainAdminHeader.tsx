"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Bell, ChevronRight } from "lucide-react";

type MainAdminHeaderProps = {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
};

const BREADCRUMB_LABELS: Record<string, string> = {
  admin: "Control Center",
  users: "Users & Tenants",
  "blood-requests": "Blood Requests",
  healthcare: "HealthCare",
  dogs: "Dogs",
  "adoption-requests": "Adoption Requests",
  "dog-updates": "Dog Updates",
};

export function MainAdminHeader({ onToggleSidebar, sidebarOpen }: MainAdminHeaderProps) {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const label = BREADCRUMB_LABELS[segment] ?? segment;
      return { href, label, isLast: index === segments.length - 1 };
    });
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-[#e5e5e5] bg-white/94 backdrop-blur-xl">
      <div className="flex min-h-[72px] items-center gap-3 px-5 sm:px-8">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 md:hidden"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden md:block">
          <p className="text-[1rem] font-medium uppercase tracking-[0.18em] text-[#707072]">Operations workspace</p>
          <nav className="mt-2 flex items-center gap-1.5 text-[11px]" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {index > 0 ? <ChevronRight className="h-3 w-3 text-neutral-200" /> : null}
                {crumb.isLast ? (
                  <span className="font-semibold uppercase tracking-[0.12em] text-neutral-800">
                    {crumb.label}
                  </span>
                ) : (
                  <span className="uppercase tracking-[0.12em] text-neutral-400">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            onClick={() => setShowSearch((prev) => !prev)}
            aria-label="Toggle search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="admin-pulse-dot" />
          </button>
        </div>
      </div>

      {showSearch ? (
        <div className="border-t border-neutral-100/60 px-5 py-4 sm:px-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-300" />
            <input
              type="text"
              placeholder="Search admin modules..."
              className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50/60 pl-10 pr-4 text-sm text-neutral-700 placeholder:text-neutral-300 focus:border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
