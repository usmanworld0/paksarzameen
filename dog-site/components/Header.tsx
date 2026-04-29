"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LikedDogsNavButton } from "./LikedDogsNavButton";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="dog-container">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className={`text-sm font-semibold tracking-wide transition-colors ${scrolled ? "text-white" : "text-neutral-900"}`}>
              Paksarzameen
            </span>
          </Link>

          <nav className={`flex items-center gap-4 text-sm transition-colors ${scrolled ? "text-white" : "text-neutral-700"}`}>
            <Link href="/dog-adoption" className="transition hover:opacity-80">
              Adoption
            </Link>
            <LikedDogsNavButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
