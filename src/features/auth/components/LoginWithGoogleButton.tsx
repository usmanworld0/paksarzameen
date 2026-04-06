"use client";

import { Chrome } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

type LoginWithGoogleButtonProps = {
  callbackUrl: string;
};

export function LoginWithGoogleButton({ callbackUrl }: LoginWithGoogleButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      className="w-full rounded-2xl bg-psz-green px-6 text-sm font-semibold text-white shadow-lg shadow-psz-green/20 transition hover:translate-y-[-1px] hover:bg-psz-green-light"
      onClick={() => {
        void signIn("google", { callbackUrl });
      }}
    >
      <Chrome className="h-4 w-4" />
      Login with Google
    </Button>
  );
}
