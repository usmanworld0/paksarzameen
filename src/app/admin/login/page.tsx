import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/blood-bank/components/AdminLoginForm";
import { getAdminSession } from "@/lib/main-admin-auth";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Main website admin login for Blood Bank backend.",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
