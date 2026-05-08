import { NextResponse } from "next/server";
import { getHealthCareAnalytics } from "@/services/healthcare/core-service";
import { getRequiredAdminApiUser } from "@/server/route-auth";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getRequiredAdminApiUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getHealthCareAnalytics();
    return NextResponse.json({ data });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load healthcare analytics.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
