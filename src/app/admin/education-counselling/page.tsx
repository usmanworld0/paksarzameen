import { redirect } from "next/navigation";
import { requireAdminOrModuleUser } from "@/lib/supabase/authorization";
import { AdminCounsellingPanel } from "./AdminCounsellingPanel";

export const dynamic = "force-dynamic";

export default async function AdminCounsellingPage() {
  const session = await requireAdminOrModuleUser("education_counselling", "view");
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f3f3ee] py-6">
      <AdminCounsellingPanel />
    </main>
  );
}
