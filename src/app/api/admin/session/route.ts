import { NextResponse } from "next/server";
import { getRequiredAdminApiUser } from "@/server/route-auth";
import { getAdminSessionFromCookies, getAdminSessionDefaultRoute } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionCookie = await getAdminSessionFromCookies();
  if (sessionCookie) {
    return NextResponse.json({
      data: {
        id: `admin-session:${sessionCookie.email}`,
        email: sessionCookie.email,
        role: sessionCookie.role,
        permissions: sessionCookie.permissions,
        redirectTo: getAdminSessionDefaultRoute(sessionCookie),
      },
    });
  }

  const session = await getRequiredAdminApiUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    data: {
      id: session.id,
      email: session.email,
      role: session.role,
      permissions: [],
      redirectTo: "/admin",
    },
  });
}
