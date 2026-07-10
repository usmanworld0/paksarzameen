"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Search, X } from "lucide-react";

import type { NavigationEntry } from "./navigation-data";

type NavigationOverlayProps = {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  entries: NavigationEntry[];
};

function isActiveLink(pathname: string, href: string) {
  const [pathOnly] = href.split("#");

  if (pathOnly === "/") {
    return pathname === "/";
  }

  return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);
}

export function NavigationOverlay({ open, onClose, triggerRef, entries }: NavigationOverlayProps) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const leftPanelRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [mounted, setMounted] = useState(open);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [queryValue, setQueryValue] = useState("");

  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  useEffect(() => {
    if (open) {
      setMounted(true);
    }
  }, [open]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted, open]);

  useLayoutEffect(() => {
    if (!mounted || !overlayRef.current || !leftPanelRef.current) {
      return;
    }

    const overlay = overlayRef.current;
    const leftPanel = leftPanelRef.current;
    const panelItems = Array.from(leftPanel.querySelectorAll("[data-menu-item]")) as HTMLElement[];
    const visualPieces = Array.from(overlay.querySelectorAll("[data-visual-piece]")) as HTMLElement[];

    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(leftPanel, { x: -36, opacity: 0 });
    gsap.set(panelItems, { y: 22, opacity: 0 });
    gsap.set(visualPieces, { y: 26, opacity: 0, scale: 0.96 });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power4.out" },
      onReverseComplete: () => {
        setMounted(false);
      },
    });

    tl.to(overlay, { autoAlpha: 1, duration: 0.16 }, 0)
      .to(leftPanel, { x: 0, opacity: 1, duration: 0.8 }, 0)
      .to(panelItems, { y: 0, opacity: 1, stagger: 0.06, duration: 0.62 }, 0.16)
      .to(visualPieces, { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.65 }, 0.24);

    timelineRef.current = tl;

    if (open) {
      tl.play(0);
      window.requestAnimationFrame(() => {
        const focusTarget = overlay.querySelector<HTMLElement>(focusableSelector);
        focusTarget?.focus();
      });
    }

    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, [focusableSelector, mounted, open]);

  useEffect(() => {
    if (!timelineRef.current) {
      return;
    }

    if (open) {
      timelineRef.current.play(0);
    } else {
      timelineRef.current.reverse();
    }
  }, [open]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const overlay = overlayRef.current;
      if (!overlay) {
        return;
      }

      const focusable = [
        ...Array.from(overlay.querySelectorAll<HTMLElement>(focusableSelector)),
        ...(triggerRef.current ? [triggerRef.current] : []),
      ].filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      const activeIndex = activeElement ? focusable.indexOf(activeElement) : -1;
      const lastIndex = focusable.length - 1;

      if (event.shiftKey) {
        if (activeIndex <= 0) {
          event.preventDefault();
          focusable[lastIndex].focus();
        }
      } else if (activeIndex === lastIndex) {
        event.preventDefault();
        focusable[0].focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [focusableSelector, mounted, onClose, triggerRef]);

  const groupedColumns = [
    {
      title: "Landing Page",
      items: entries[0]?.children ?? [],
    },
    {
      title: "Awards & Honors",
      items: entries.slice(1, 4),
    },
    {
      title: "Partnerships & Collaborations",
      items: entries.slice(4, 7),
    },
    {
      title: "Support",
      items: entries.slice(7),
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      id="psz-navigation-overlay"
      className="fixed inset-0 z-[80] overflow-hidden bg-[#0b3150]"
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Primary navigation"
      onMouseDown={(event) => {
        if (event.target === overlayRef.current) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_14%,rgba(19,86,133,0.45),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_80%_82%,rgba(15,122,71,0.2),transparent_26%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[1600px] flex-col px-[2.2rem] pb-[2.2rem] pt-[2.4rem] md:px-[4rem] md:pb-[3rem] md:pt-[3rem]">
        <section
          ref={leftPanelRef}
          className="flex h-full min-h-0 flex-col text-white"
        >
          <div className="flex flex-col gap-4 border-b border-white/15 pb-5 md:flex-row md:items-center md:justify-center md:gap-8">
            <form
              className="relative mx-auto flex w-full max-w-[58rem] items-stretch overflow-hidden rounded-[1rem] border border-white/18 bg-white"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <label htmlFor="psz-nav-search" className="sr-only">
                Search navigation
              </label>
              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <Search className="h-5 w-5 text-[#6b7280]" />
                <input
                  id="psz-nav-search"
                  value={queryValue}
                  onChange={(event) => setQueryValue(event.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-[1.5rem] font-normal text-[#111111] outline-none placeholder:text-[#7d8693]"
                />
              </div>
              <button
                type="submit"
                className="min-w-[10rem] bg-[#44b14b] px-5 py-3 text-[1.35rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#3da445]"
              >
                Submit
              </button>
            </form>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-[2.2rem] top-[2.4rem] inline-flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:right-[4rem] md:top-[3rem]"
              aria-label="Close menu"
            >
              <X className="h-8 w-8 stroke-[2.5]" />
            </button>
          </div>
          <div className="mt-6 grid gap-8 lg:grid-cols-4">
            {groupedColumns.map((column) => (
              <section key={column.title} className="space-y-4">
                <div className="pb-3">
                  <h3 className="text-[1.8rem] font-semibold uppercase tracking-[0.03em] text-white">
                    {column.title}
                  </h3>
                  <div className="mt-3 h-px w-full bg-[#44b14b]" />
                </div>
                <div className="space-y-4">
                  {column.items.map((item, itemIndex) => {
                    const href = item.href;
                    if (!href) {
                      return null;
                    }

                    const active = isActiveLink(pathname, href);
                    const external = "external" in item && Boolean(item.external);
                    const isHovered = hoveredKey ? hoveredKey === `${column.title}-${itemIndex}` : active;

                    return (
                      <Link
                        key={item.label}
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className={`group flex items-center justify-between gap-3 text-[1.45rem] leading-[1.15] transition-all duration-300 ${
                          isHovered ? "translate-x-1 text-white" : "text-white/78 hover:translate-x-1 hover:text-white"
                        }`}
                        onMouseEnter={() => setHoveredKey(`${column.title}-${itemIndex}`)}
                        onMouseLeave={() => setHoveredKey(null)}
                        onClick={onClose}
                        data-menu-item
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="h-4 w-4 flex-shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <svg data-visual-piece viewBox="0 0 1200 160" className="h-20 w-full opacity-70" aria-hidden="true">
              <path
                d="M20 120C140 38 270 34 374 88C464 134 548 126 650 78C750 28 860 32 976 92C1048 126 1120 118 1180 72"
                stroke="#44b14b"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="120" cy="90" r="4" fill="#ffffff" fillOpacity="0.9" />
              <circle cx="322" cy="76" r="5" fill="#44b14b" />
              <circle cx="572" cy="102" r="4" fill="#ffffff" fillOpacity="0.9" />
              <circle cx="842" cy="82" r="5" fill="#44b14b" />
              <circle cx="1096" cy="90" r="4" fill="#ffffff" fillOpacity="0.9" />
            </svg>
          </div>
        </section>
      </div>
    </div>
  );
}
