"use client";

import { Chrome } from "lucide-react";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type LoginWithGoogleButtonProps = {
  callbackUrl: string;
  className?: string;
};

export function LoginWithGoogleButton({ callbackUrl, className }: LoginWithGoogleButtonProps) {
  const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const res = await fetch("/api/auth/providers");
        if (!mounted) return;
        if (!res.ok) {
          setGoogleAvailable(false);
          return;
        }
        const providers = await res.json();
        setGoogleAvailable(Boolean(providers?.google));
      } catch {
        if (mounted) setGoogleAvailable(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
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

  const handleClick = () => {
    if (googleAvailable === false) {
      // If provider isn't configured, open the login page which contains
      // the same CTA but will also surface a clearer message.
      window.location.href = "/login";
      return;
    }

    void signIn("google", { callbackUrl: resolveCallbackUrl() });
  };

  return (
    <Button
      type="button"
      size="lg"
      className={className}
      onClick={handleClick}
      disabled={googleAvailable === false}
    >
      <Chrome className="h-4 w-4" />
      {googleAvailable === false ? "Google sign-in unavailable" : "Continue with Google"}
    </Button>
  );
}