import { redirect } from "next/navigation";
import { requireAdminOrModuleUser } from "@/lib/supabase/authorization";
import { AdminHealthCarePanel } from "@/features/healthcare/components/AdminHealthCarePanel";

export const dynamic = "force-dynamic";

export default async function AdminHealthCarePage() {
  const session = await requireAdminOrModuleUser("healthcare", "view");
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminHealthCarePanel />;
}
