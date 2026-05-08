"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

type GalleryLogoutButtonProps = {
  className?: string;
};

export function GalleryLogoutButton({ className }: GalleryLogoutButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={async () => {
        // Try clearing manual cookie first (if present), then call next-auth signOut
        try {
          await fetch("/api/gallery/user/manual-signout", { method: "POST" });
        } catch (err) {
          // ignore
        }
        void signOut({ callbackUrl: "/customers-art-gallery" });
      }}
    >
      Sign out
    </Button>
  );
}