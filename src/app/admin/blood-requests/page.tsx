import { redirect } from "next/navigation";

import { AdminBloodRequestsPanel } from "@/features/blood-bank/components/AdminBloodRequestsPanel";
import { requireAdminOrModuleUser } from "@/lib/supabase/authorization";

export const dynamic = "force-dynamic";

export default async function AdminBloodRequestsPage() {
  const session = await requireAdminOrModuleUser("blood_bank", "view");
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminBloodRequestsPanel />;
}
