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
      onClick={() => {
        void signOut({ callbackUrl: "/customers-art-gallery" });
      }}
    >
      Sign out
    </Button>
  );
}