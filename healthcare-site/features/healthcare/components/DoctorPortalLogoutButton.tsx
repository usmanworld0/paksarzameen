"use client";

export function DoctorPortalLogoutButton({ callbackUrl = "/healthcare/doctor/sign-in", className }: { callbackUrl?: string; className?: string }) {
  async function handleLogout() {
    // Best-effort client-side sign-out: redirect to sign-in page.
    window.location.assign(callbackUrl);
  }

  return (
    <button type="button" onClick={() => void handleLogout()} className={className}>
      Sign out
    </button>
  );
}
