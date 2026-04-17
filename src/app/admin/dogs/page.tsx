import { redirect } from "next/navigation";
import { requireAdminOrModuleUser } from "@/lib/supabase/authorization";
import { AdminDogsPanel } from "@/features/dog-adoption/components/AdminDogsPanel";

export const dynamic = "force-dynamic";

export default async function AdminDogsPage() {
  const session = await requireAdminOrModuleUser("dog_adoption", "view");
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminDogsPanel />;
}
