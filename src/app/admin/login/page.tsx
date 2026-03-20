import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/blood-bank/components/AdminLoginForm";
import { getAdminSession } from "@/lib/main-admin-auth";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Secure admin access for PakSarZameen blood bank operations.",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
