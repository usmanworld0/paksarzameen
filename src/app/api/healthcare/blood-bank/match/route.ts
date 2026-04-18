import { NextResponse } from "next/server";
import { getRequiredApiUser } from "@/server/route-auth";
import { assertHealthcareUserActive } from "@/services/healthcare/core-service";
import { bloodMatchQuerySchema } from "@/lib/healthcare-validation";
import { getBloodDonorMatches } from "@/services/healthcare/core-service";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const { searchParams } = new URL(request.url);
    const parsed = bloodMatchQuerySchema.safeParse({
      bloodGroup: searchParams.get("bloodGroup"),
      urgencyLevel: searchParams.get("urgencyLevel"),
      city: searchParams.get("city") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid donor match query.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await getBloodDonorMatches({
      bloodGroup: parsed.data.bloodGroup,
      urgencyLevel: parsed.data.urgencyLevel,
      city: parsed.data.city,
    });

    return NextResponse.json({ data });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to fetch donor matches.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
