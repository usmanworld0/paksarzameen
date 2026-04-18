import { NextResponse } from "next/server";
import { setHealthcareUserSuspension } from "@/lib/healthcare";
import { getRequiredAdminApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await getRequiredAdminApiUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const body = (await request.json()) as {
      userId?: string;
      isSuspended?: boolean;
      reason?: string;
    };

    const userId = String(body.userId ?? "").trim();
    const isSuspended = Boolean(body.isSuspended);
    const reason = String(body.reason ?? "").trim();

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    if (isSuspended && reason.length < 5) {
      return NextResponse.json({ error: "Suspension reason must be at least 5 characters." }, { status: 400 });
    }

    await setHealthcareUserSuspension({
      userId,
      isSuspended,
      reason: reason || null,
      actorUserId: admin.id,
    });

    return NextResponse.json({
      message: isSuspended ? "User suspended from healthcare module." : "User healthcare suspension removed.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update suspension.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
