import { redirect } from "next/navigation";
import { AdminBloodRequestsPanel } from "@/features/blood-bank/components/AdminBloodRequestsPanel";
import { getAdminSession } from "@/lib/main-admin-auth";

export const dynamic = "force-dynamic";

export default async function MainAdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminBloodRequestsPanel />;
}
