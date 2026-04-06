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
      variant="outline"
      className={className}
      onClick={() => {
        void signOut({ callbackUrl });
      }}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
