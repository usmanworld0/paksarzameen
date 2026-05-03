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
  ShieldCheck,
  Droplets,
} from "lucide-react";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";

type Props = { open: boolean; onClose: () => void };

const NAV_ITEMS = [
  { label: "Control Center",     href: "/admin",                   icon: LayoutDashboard, group: "Overview" },
  { label: "Users & Tenants",    href: "/admin/users",             icon: Users,           group: "Management" },
  { label: "Blood Requests",     href: "/admin/blood-requests",    icon: Droplets,        group: "Management" },
  { label: "HealthCare",         href: "/admin/healthcare",        icon: HeartPulse,      group: "Management" },
  { label: "Dogs",               href: "/admin/dogs",              icon: PawPrint,        group: "Dog Adoption" },
  { label: "Adoption Requests",  href: "/admin/adoption-requests", icon: ClipboardList,   group: "Dog Adoption" },
  { label: "Dog Updates",        href: "/admin/dog-updates",       icon: ImagePlus,       group: "Dog Adoption" },
] as const;

export function MainAdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const { session, loading } = useAdminClientSession();

  const visibleItems = useMemo(
    () => NAV_ITEMS.filter((item) => canAccessAdminRoute(session, item.href)),
    [session]
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof visibleItems[number][]>();
    for (const item of visibleItems) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return map;
  }, [visibleItems]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    window.location.href = "/admin/login";
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col overflow-hidden transition-transform duration-300 ease-out md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.06] px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-900/40">
            <ShieldCheck className="h-[18px] w-[18px] text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-white/35">Admin Panel</span>
            <span className="block truncate text-[13px] font-bold text-white/90">PakSarZameen</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/25 transition hover:bg-white/5 hover:text-white/60 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-5">
          {loading && (
            <div className="space-y-1 px-1">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-9 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          )}

          {!loading && Array.from(groups.entries()).map(([groupLabel, items]) => (
            <div key={groupLabel}>
              <p className="mb-1.5 px-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
                {groupLabel}
              </p>
              <ul className="space-y-0.5">
                {items.map(({ label, href, icon: Icon }) => {
                  const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={onClose}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-emerald-500/15 text-white"
                            : "text-white/45 hover:bg-white/[0.06] hover:text-white/80"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                            isActive
                              ? "bg-emerald-500/25"
                              : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                          }`}
                        >
                          <Icon
                            className={`h-[15px] w-[15px] transition-colors ${
                              isActive ? "text-emerald-400" : "text-white/30 group-hover:text-white/55"
                            }`}
                          />
                        </span>
                        <span className="flex-1 truncate">{label}</span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {!loading && visibleItems.length === 0 && (
            <p className="px-3 py-2 text-xs text-white/30">No module access assigned.</p>
          )}
        </nav>

        {/* User + logout */}
        <div className="shrink-0 border-t border-white/[0.06] p-2.5 space-y-1">
          {session && (
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/[0.04]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/20 text-[11px] font-bold uppercase text-emerald-300">
                {session.email.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-white/75">{session.email}</p>
                <p className="text-[10px] font-medium capitalize text-white/30">{session.role}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/35 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <LogOut className="h-[15px] w-[15px]" />
            </span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
