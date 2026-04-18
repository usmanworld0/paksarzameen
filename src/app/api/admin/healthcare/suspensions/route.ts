import { NextResponse } from "next/server";
import { setHealthcareUserSuspension } from "@/services/healthcare/core-service";
import { getRequiredAdminApiUser } from "@/server/route-auth";
import { suspensionSchema } from "@/lib/healthcare-validation";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

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

    const body = (await request.json()) as unknown;
    const parsed = suspensionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid suspension payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const userId = parsed.data.userId;
    const isSuspended = parsed.data.isSuspended;
    const reason = parsed.data.reason?.trim() ?? "";

    if (isSuspended && reason.length > 0 && reason.length < 5) {
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
    const mapped = mapHealthcareError(error, "Failed to update suspension.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
