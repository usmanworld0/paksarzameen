import { redirect } from "next/navigation";

import { AdminUsersPanel } from "@/features/auth/components/AdminUsersPanel";
import { requireAdminUser } from "@/lib/supabase/authorization";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await requireAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminUsersPanel />;
}
