import { redirect } from "next/navigation";
import { AdminControlCenter } from "@/features/admin/components/AdminControlCenter";
import { requireAdminUser } from "@/lib/supabase/authorization";
import { getAdminSessionDefaultRoute, getAdminSessionFromCookies } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function MainAdminPage() {
  const sessionCookie = await getAdminSessionFromCookies();
  if (sessionCookie?.role === "tenant") {
    redirect(getAdminSessionDefaultRoute(sessionCookie));
  }

  const session = await requireAdminUser();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminControlCenter />;
}
