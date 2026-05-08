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
      className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#E5E5E5] bg-white py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
      onClick={() => {
        void signIn("google", { callbackUrl });
      }}
    >
      <Chrome className="h-4 w-4" />
      Login with Google
    </Button>
  );
}
