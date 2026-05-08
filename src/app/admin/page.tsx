import { redirect } from "next/navigation";
import { AdminControlCenter } from "@/features/admin/components/AdminControlCenter";
import { requireAdminUser } from "@/lib/supabase/authorization";
import { getAdminSessionDefaultRoute, getAdminSessionFromCookies } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function MainAdminPage() {
  const sessionCookie = await getAdminSessionFromCookies();
  if (sessionCookie?.role === "tenant") {
    const defaultRoute = getAdminSessionDefaultRoute(sessionCookie);
    if (defaultRoute !== "/admin/login") {
      redirect(defaultRoute);
    }
    redirect("/admin/login");
  }

  const session = await requireAdminUser();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f3f3ee]">
      <AdminControlCenter />
    </main>
  );
}
