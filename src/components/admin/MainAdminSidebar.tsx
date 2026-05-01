"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  HeartPulse,
  PawPrint,
  ClipboardList,
  ImagePlus,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";

type MainAdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const NAV_ITEMS = [
  { label: "Control Center", href: "/admin", icon: LayoutDashboard },
  { label: "Users & Tenants", href: "/admin/users", icon: Users },
  { label: "Blood Requests", href: "/admin/blood-requests", icon: HeartPulse },
  { label: "HealthCare", href: "/admin/healthcare", icon: HeartPulse },
  { label: "Dogs", href: "/admin/dogs", icon: PawPrint },
  { label: "Adoption Requests", href: "/admin/adoption-requests", icon: ClipboardList },
  { label: "Dog Updates", href: "/admin/dog-updates", icon: ImagePlus },
] as const;

export function MainAdminSidebar({ open, onClose }: MainAdminSidebarProps) {
  const pathname = usePathname();
  const { session, loading } = useAdminClientSession();

  const visibleNavItems = useMemo(
    () => NAV_ITEMS.filter((item) => canAccessAdminRoute(session, item.href)),
    [session]
  );

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/admin/login";
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-label="Close sidebar overlay"
        />
      ) : null}

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col overflow-hidden transform transition-transform duration-300 ease-out md:z-40 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-400/25">
              <ShieldCheck className="h-[18px] w-[18px] text-emerald-400" />
            </span>
            <span className="leading-tight">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-white/55">
                Admin
              </span>
              <span className="block text-[14px] font-semibold text-white/90">PakSarZameen</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-5 h-px bg-white/[0.06]" />

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
            Navigation
          </p>

          <ul className="space-y-1">
            {visibleNavItems.map(({ label, href, icon: Icon }) => {
              const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`admin-sidebar-link ${
                      isActive ? "admin-sidebar-link--active" : "admin-sidebar-link--inactive"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                        isActive ? "text-emerald-400" : "text-white/25"
                      }`}
                    />
                    <span className="flex-1">{label}</span>
                    {isActive ? <ChevronRight className="h-3 w-3 text-white/30" /> : null}
                  </Link>
                </li>
              );
            })}
            {!loading && !visibleNavItems.length ? (
              <li className="px-3 py-2 text-xs text-white/45">No module access assigned yet.</li>
            ) : null}
          </ul>
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <button
            type="button"
            onClick={() => void logout()}
            className="admin-sidebar-link admin-sidebar-link--inactive w-full hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            <span className="flex-1 text-left">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
