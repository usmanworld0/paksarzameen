"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type RefObject, useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Award, BookOpen, Globe, Heart, Link2, ArrowUpRight } from "lucide-react";

type NavigationOverlayProps = {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  entries: any[];
};

const CATEGORIES = [
  { id: "explore", label: "Explore PSZ", icon: Globe },
  { id: "departments", label: "Departments", icon: BookOpen },
  { id: "portals", label: "Direct Portals", icon: Link2 },
  { id: "impact", label: "Impact & Work", icon: Award },
  { id: "involved", label: "Get Involved", icon: Heart },
] as const;

const SUB_ITEMS: Record<
  string,
  Array<{ label: string; href: string; count?: string; badge?: string; external?: boolean }>
> = {
  explore: [
    { label: "About PakSarZameen", href: "/about", count: "2026" },
    { label: "What is PSZ? (Problem)", href: "/#home-problem", count: "1 Impact" },
    { label: "What We Do (Solution)", href: "/#home-solution", count: "12 Initiatives" },
    { label: "Life at PSZ & Team", href: "/#home-team", count: "12 Members" },
  ],
  departments: [
    { label: "Mahkma Shajarkari", href: "/#departments-heading", count: "1.2M Trees", badge: "Live" },
    { label: "Mahkma Taleem", href: "/#departments-heading", count: "45 Schools" },
    { label: "Mahkma Sehat", href: "/#departments-heading", count: "12 Hubs" },
    { label: "Mahkma Falah & Welfare", href: "/#departments-heading", count: "200+ Cases" },
    { label: "Mahkma Khel", href: "/#departments-heading", count: "8 Fields" },
    { label: "Mahkma Ziraat", href: "/#departments-heading", count: "2 Farms" },
  ],
  portals: [
    { label: "Adopt a Dog / Shelter", href: "/dog-adoption", count: "150+ Dogs", badge: "Active" },
    { label: "HealthCare & Medical AI", href: "/healthcare", count: "24/7 Aid" },
    { label: "Official Commonwealth Store", href: "https://store.paksarzameenwfo.com", external: true, badge: "New" },
    { label: "Education Counselling", href: "https://education.paksarzameenwfo.com", external: true, count: "180+ Placements" },
  ],
  impact: [
    { label: "Awards & Honors", href: "/impact", count: "6 Milestones" },
    { label: "Guinness World Record", href: "/impact", count: "1 Drive" },
    { label: "News & Field Reports", href: "/news", count: "48 Stories" },
  ],
  involved: [
    { label: "Volunteer Application", href: "/volunteer", count: "8.5K Registered" },
    { label: "Partnerships & Support", href: "/get-involved", count: "12 Partners" },
    { label: "FAQ & Policies", href: "/policies#faq", count: "24 Answers" },
    { label: "Contact & Desk", href: "/contact", count: "24/7 Desk" },
  ],
};

export function NavigationOverlay({ open, onClose }: NavigationOverlayProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("explore");
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const currentItems = SUB_ITEMS[activeTab] || [];

  return (
    <>
      {/* Backdrop Overlay to close dropdown */}
      <div
        className="fixed inset-0 top-[70px] z-[80] bg-black/15 backdrop-blur-[2px] transition-all"
        onClick={onClose}
      />

      {/* Awwwards Dropdown Panel Container */}
      <div
        ref={panelRef}
        className="fixed top-[70px] left-0 z-[85] w-full border-b border-[#e5e5e5] bg-[#ffffff] text-[#111111] shadow-2xl transition-all"
      >
        <div className="mx-auto flex max-w-[1720px] flex-col md:flex-row px-6 py-8 sm:px-10 lg:px-14">
          {/* Left Column: Awwwards Category Tabs list */}
          <div className="w-full md:w-[280px] flex-shrink-0 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r border-[#eeeeee] pb-4 md:pb-0 pr-0 md:pr-8">
            {CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = activeTab === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() => setActiveTab(cat.id)}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-3.5 px-4 py-3 text-[14px] font-semibold rounded-lg transition-all text-left ${
                    isActive
                      ? "bg-[#f2f2f2] text-black border border-black/5 shadow-sm"
                      : "text-[#555555] hover:text-black hover:bg-black/[0.03] border border-transparent"
                  }`}
                >
                  <IconComponent className={`h-[17px] w-[17px] ${isActive ? "text-black" : "text-[#888]"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Sub-items detailed listing */}
          <div className="flex-grow pt-6 md:pt-0 pl-0 md:pl-12 lg:pl-16">
            <div className="grid gap-x-12 gap-y-4 sm:grid-cols-2 max-w-[960px]">
              {currentItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={onClose}
                  className="group flex items-center justify-between py-2 border-b border-[#f3f3f3] hover:border-[#111111]/25 transition-all text-[14px] font-medium text-[#222222] hover:text-black"
                >
                  <div className="flex items-center gap-2">
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="rounded-[4px] bg-[#111111] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-wider text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[#777777] group-hover:text-black">
                    {item.count && (
                      <span className="text-[12.5px] font-normal opacity-85">
                        {item.count}
                      </span>
                    )}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
