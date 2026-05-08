"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  Tag,
  LogOut,
  Store,
  X,
  ChevronRight,
  Settings,
  BarChart3,
  ShieldCheck,
  Percent,
  ImagePlus,
} from "lucide-react";
import { signOut } from "next-auth/react";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Artisans", href: "/admin/artists", icon: Users },
  { label: "Sales", href: "/admin/sales", icon: Tag },
  { label: "Coupons", href: "/admin/coupons", icon: Percent },
  { label: "Gallery", href: "/admin/gallery", icon: ImagePlus },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col overflow-hidden transform transition-transform duration-300 ease-out md:z-40 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[72px] items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/15 ring-1 ring-brand-green/20">
              <ShieldCheck className="h-[18px] w-[18px] text-brand-green" />
            </span>
            <span className="leading-tight">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-white/55">
                Admin
              </span>
              <span className="block text-[14px] font-semibold text-white/90">
                Paksarzameen Store
              </span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/30 hover:bg-white/5 hover:text-white/60 md:hidden transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/[0.06]" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
            Navigation
          </p>
          <ul className="space-y-1">
            {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
              const isActive =
                href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`admin-sidebar-link ${
                      isActive
                        ? "admin-sidebar-link--active"
                        : "admin-sidebar-link--inactive"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                        isActive
                          ? "text-brand-green"
                          : "text-white/25"
                      }`}
                    />
                    <span className="flex-1">{label}</span>
                    {isActive && (
                      <ChevronRight className="h-3 w-3 text-white/30" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/[0.06] p-3 space-y-0.5">
          <a
            href={process.env.NEXT_PUBLIC_SITE_URL ?? "/"}
            className="admin-sidebar-link admin-sidebar-link--inactive"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            <Store className="h-[18px] w-[18px] flex-shrink-0" />
            <span className="flex-1">View Store</span>
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="admin-sidebar-link w-full text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            <span className="flex-1 text-left">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
