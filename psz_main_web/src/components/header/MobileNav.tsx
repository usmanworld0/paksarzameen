"use client";

import Link from "next/link";

import type { NavLink } from "@/config/site";

type MobileNavProps = {
  isOpen: boolean;
  links: NavLink[];
  commonwealthLabel: string;
  commonwealthUrl: string;
  onNavigate: () => void;
};

export function MobileNav({
  isOpen,
  links,
  commonwealthLabel,
  commonwealthUrl,
  onNavigate,
}: MobileNavProps) {
  return (
    <div
      className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="mb-3 space-y-1 rounded-2xl border border-psz-forest/15 bg-white/95 p-3 shadow-panel backdrop-blur">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-psz-charcoal transition-colors hover:bg-psz-forest/10"
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        ))}
        <a
          href={commonwealthUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block rounded-xl border border-psz-sand/70 bg-psz-forest px-3 py-2 text-center text-sm font-semibold text-psz-cream transition-all hover:-translate-y-px hover:bg-psz-charcoal"
          onClick={onNavigate}
        >
          {commonwealthLabel}
        </a>
      </div>
    </div>
  );
}
