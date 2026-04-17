import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/blood-bank/components/AdminLoginForm";
import { requireAdminUser } from "@/lib/supabase/authorization";
import { getAdminSessionDefaultRoute, getAdminSessionFromCookies } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin access uses the main Supabase login flow.",
};

export default async function AdminLoginPage() {
  const sessionCookie = await getAdminSessionFromCookies();
  if (sessionCookie) {
    redirect(getAdminSessionDefaultRoute(sessionCookie));
  }

  const session = await requireAdminUser();
  if (session) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
