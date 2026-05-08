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
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col overflow-hidden bg-white border-r border-[#E5E5E5] transition-transform duration-300 ease-out md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#E5E5E5] px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0f7a47]">
            <ShieldCheck className="h-[18px] w-[18px] text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#707072]">Admin Panel</span>
            <span className="block truncate text-sm font-black tracking-tighter text-[#111111]">PakSarZameen</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#707072] transition hover:bg-[#f3f3ee] hover:text-[#111111] md:hidden"
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
                <div key={n} className="h-9 animate-pulse rounded-xl bg-[#f3f3ee]" />
              ))}
            </div>
          )}

          {!loading && Array.from(groups.entries()).map(([groupLabel, items]) => (
            <div key={groupLabel}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072]">
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
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-150 ${
                          isActive
                            ? "bg-[#111111] text-white font-black"
                            : "text-[#707072] hover:bg-[#f3f3ee] hover:text-[#111111]"
                        }`}
                      >
                        <Icon
                          className={`h-[15px] w-[15px] shrink-0 transition-colors ${
                            isActive ? "text-white" : "text-[#707072]"
                          }`}
                        />
                        <span className="flex-1 truncate">{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {!loading && visibleItems.length === 0 && (
            <p className="px-3 py-2 text-xs text-[#707072]">No module access assigned.</p>
          )}
        </nav>

        {/* User + logout */}
        <div className="shrink-0 border-t border-[#E5E5E5] p-2.5 space-y-1">
          {session && (
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-[#f3f3ee]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f7a47]/10 text-[11px] font-black uppercase text-[#0f7a47]">
                {session.email.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-[#111111]">{session.email}</p>
                <p className="text-[10px] font-medium capitalize text-[#707072]">{session.role}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#707072] transition-all hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-[15px] w-[15px] shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
