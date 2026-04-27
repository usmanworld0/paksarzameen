import { NextResponse } from "next/server";
import { reviewDoctorSignupRequest } from "@/services/healthcare/core-service";
import { getRequiredAdminApiUser } from "@/server/route-auth";
import { doctorSignupRequestReviewSchema } from "@/lib/healthcare-validation";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ requestId: string }> }) {
  const admin = await getRequiredAdminApiUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { requestId } = await context.params;
    const body = (await request.json()) as unknown;
    const parsed = doctorSignupRequestReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid doctor signup review payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await reviewDoctorSignupRequest({
      requestId,
      status: parsed.data.status,
      adminNote: parsed.data.adminNote ?? null,
      reviewedBy: admin.email,
    });

    return NextResponse.json({ data, message: `Doctor request ${parsed.data.status}.` });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to review doctor signup request.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
