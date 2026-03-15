import { NextResponse } from "next/server";
import { normalizeStatus, updateBloodRequestStatus } from "@/lib/blood-bank";
import { getAdminSession } from "@/lib/main-admin-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "DATABASE_URL is not configured." },
        { status: 500 }
      );
    }

    const { id } = await context.params;
    const body = (await request.json()) as { status?: string };
    const status = normalizeStatus(body.status);
    const updated = await updateBloodRequestStatus(id, status);
    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update status.";
    const statusCode = message.includes("Invalid") ? 400 : message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
