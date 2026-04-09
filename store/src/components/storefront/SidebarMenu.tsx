"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import { cn, normalizeImageSrc } from "@/lib/utils";
import type { StorefrontMenuNode } from "@/types/storefront";

type SidebarMenuProps = {
  data: StorefrontMenuNode[];
  onNavigate?: () => void;
  searchQuery?: string;
};

function filterTree(nodes: StorefrontMenuNode[], query: string): StorefrontMenuNode[] {
  if (!query.trim()) return nodes;

  const lower = query.trim().toLowerCase();

  const filteredNodes: StorefrontMenuNode[] = [];

  for (const node of nodes) {
    const filteredChildren = node.children ? filterTree(node.children, lower) : [];
    const matchedSelf =
      node.label.toLowerCase().includes(lower) ||
      (node.description ?? "").toLowerCase().includes(lower);

    if (!matchedSelf && filteredChildren.length === 0) {
      continue;
    }

    filteredNodes.push({
      ...node,
      children: filteredChildren,
    });
  }

  return filteredNodes;
}

function MenuNode({
  node,
  depth,
  expanded,
  onToggle,
  onNavigate,
}: {
  node: StorefrontMenuNode;
  depth: number;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  onNavigate?: () => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isOpen = Boolean(expanded[node.id]);

  return (
    <li>
      <div className="group flex items-start justify-between gap-4">
        {node.href ? (
          <Link
            href={node.href}
            target={node.external ? "_blank" : undefined}
            rel={node.external ? "noopener noreferrer" : undefined}
            onClick={onNavigate}
            className={cn(
              "block transition-opacity hover:opacity-65",
              depth === 0
                ? "text-[clamp(1.8rem,3.5vw,2.7rem)] leading-[1.02] tracking-[-0.03em]"
                : "text-[clamp(1.05rem,2.2vw,1.25rem)] leading-[1.2] tracking-[-0.01em]"
            )}
          >
            {node.label}
          </Link>
        ) : (
          <p
            className={cn(
              depth === 0
                ? "text-[clamp(1.8rem,3.5vw,2.7rem)] leading-[1.02] tracking-[-0.03em]"
                : "text-[clamp(1.05rem,2.2vw,1.25rem)] leading-[1.2] tracking-[-0.01em]"
            )}
          >
            {node.label}
          </p>
        )}

        {hasChildren && (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            aria-expanded={isOpen}
            aria-label={`Expand ${node.label}`}
            className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/10 transition hover:border-black/30"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
          </button>
        )}
      </div>

      {/* Intentionally hide descriptions and preview images in the sidebar dropdown
          — render only category names for a modern, minimal dropdown experience. */}

      {hasChildren && isOpen && (
        <ul className={cn("mt-4 space-y-4 border-l border-black/10 pl-4", depth === 0 && "mt-6")}> 
          {node.children?.map((child) => (
            <MenuNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function SidebarMenu({ data, onNavigate, searchQuery = "" }: SidebarMenuProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const node of data) {
      initial[node.id] = true;
    }
    return initial;
  });

  const filteredData = useMemo(() => filterTree(data, searchQuery), [data, searchQuery]);

  // Ensure key store links are always available in the sidebar
  const staticNodes: StorefrontMenuNode[] = [
    { id: "home", label: "Home", href: "/" },
    { id: "design-your-own", label: "Design Your Own", href: "/customizations" },
    { id: "customers-art-gallery", label: "Customer's Art Gallery", href: "/customers-art-gallery" },
    { id: "contact", label: "Contact", href: "/contact" },
  ];

  const mergedData = useMemo(() => {
    const result: StorefrontMenuNode[] = [...staticNodes];
    for (const node of filteredData) {
      if (!result.some((n) => n.href && node.href && n.href === node.href)) {
        result.push(node);
      }
    }
    return result;
  }, [filteredData]);

  function handleToggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (mergedData.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-black/60">
        No navigation items matched your search.
      </div>
    );
  }

  return (
    <ul className="space-y-7">
      {mergedData.map((node) => (
        <MenuNode
          key={node.id}
          node={node}
          depth={0}
          expanded={expanded}
          onToggle={handleToggle}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
}
