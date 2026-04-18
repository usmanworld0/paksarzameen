import { NextResponse } from "next/server";
import { getHealthCareAnalytics } from "@/lib/healthcare";
import { getRequiredAdminApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getRequiredAdminApiUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        data: {
          doctorsTotal: 0,
          activePatientsTotal: 0,
          appointmentsTotal: 0,
          donorChatMessagesTotal: 0,
          appointmentMessagesTotal: 0,
          suspendedUsersTotal: 0,
          appointmentsByStatus: {},
        },
      });
    }

    const data = await getHealthCareAnalytics();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load healthcare analytics.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
