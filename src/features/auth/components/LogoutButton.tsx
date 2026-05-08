"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  callbackUrl?: string;
  className?: string;
};

export function LogoutButton({ callbackUrl = "/", className }: LogoutButtonProps) {
  return (
    <Button
      type="button"
      className={`inline-flex items-center gap-2 rounded-xl bg-[#111111] py-2.5 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed${className ? ` ${className}` : ""}`}
      onClick={() => {
        void signOut({ callbackUrl });
      }}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
