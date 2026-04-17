import { redirect } from "next/navigation";
import { requireAdminOrModuleUser } from "@/lib/supabase/authorization";
import { AdminAdoptionRequestsPanel } from "@/features/dog-adoption/components/AdminAdoptionRequestsPanel";

export const dynamic = "force-dynamic";

export default async function AdminAdoptionRequestsPage() {
  const session = await requireAdminOrModuleUser("dog_adoption", "view");
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminAdoptionRequestsPanel />;
}
