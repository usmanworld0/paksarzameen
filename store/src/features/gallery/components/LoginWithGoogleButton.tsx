"use client";

import { Chrome } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

type LoginWithGoogleButtonProps = {
  callbackUrl: string;
  className?: string;
};

export function LoginWithGoogleButton({ callbackUrl, className }: LoginWithGoogleButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      className={className}
      onClick={() => {
        void signIn("google", { callbackUrl });
      }}
    >
      <Chrome className="h-4 w-4" />
      Continue with Google
    </Button>
  );
}