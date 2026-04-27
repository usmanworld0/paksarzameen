"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type DoctorPortalLogoutButtonProps = {
  callbackUrl?: string;
  className?: string;
};

export function DoctorPortalLogoutButton({
  callbackUrl = "/healthcare/doctor/sign-in",
  className,
}: DoctorPortalLogoutButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      window.location.assign(callbackUrl);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={isSubmitting}
      className={className}
    >
      {isSubmitting ? "Signing out..." : "Sign out"}
    </button>
  );
}
