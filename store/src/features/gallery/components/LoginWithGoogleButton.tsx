"use client";

import { Chrome } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

type LoginWithGoogleButtonProps = {
  callbackUrl: string;
  className?: string;
};

export function LoginWithGoogleButton({ callbackUrl, className }: LoginWithGoogleButtonProps) {
  const resolveCallbackUrl = () => {
    if (typeof window === "undefined") {
      return callbackUrl;
    }

    if (callbackUrl.startsWith("/")) {
      return `${window.location.origin}${callbackUrl}`;
    }

    try {
      const resolved = new URL(callbackUrl);
      if (resolved.origin !== window.location.origin) {
        return `${window.location.origin}/upload-art`;
      }
      return resolved.toString();
    } catch {
      return `${window.location.origin}/upload-art`;
    }
  };

  return (
    <Button
      type="button"
      size="lg"
      className={className}
      onClick={() => {
        void signIn("google", { callbackUrl: resolveCallbackUrl() });
      }}
    >
      <Chrome className="h-4 w-4" />
      Continue with Google
    </Button>
  );
}