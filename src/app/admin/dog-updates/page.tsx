import { redirect } from "next/navigation";
import { requireAdminOrModuleUser } from "@/lib/supabase/authorization";
import { AdminDogUpdatesPanel } from "@/features/dog-adoption/components/AdminDogUpdatesPanel";

export const dynamic = "force-dynamic";

export default async function AdminDogUpdatesPage() {
  const session = await requireAdminOrModuleUser("dog_adoption", "view");
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminDogUpdatesPanel />;
}
