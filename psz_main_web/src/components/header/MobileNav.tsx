"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import type { NavLink } from "@/config/site";
import { Button } from "@/components/ui/button";

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden lg:hidden"
        >
          <div className="mb-4 space-y-1 rounded-2xl glass-strong p-4">
            {links.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-psz-gray-300 transition-all hover:bg-white/5 hover:text-white"
                  onClick={onNavigate}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: links.length * 0.05, duration: 0.3 }}
              className="pt-2"
            >
              <Button asChild variant="primary" size="md" className="w-full">
                <a
                  href={commonwealthUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onNavigate}
                >
                  {commonwealthLabel}
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
