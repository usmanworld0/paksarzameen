import { NextResponse } from "next/server";
import {
  assertHealthcareUserActive,
  createOrUpdateDoctorSignupRequest,
  getDoctorByUserId,
  getDoctorSignupRequestByUserId,
} from "@/services/healthcare/core-service";
import { getRequiredApiUser } from "@/server/route-auth";
import { doctorSignupRequestUpdateSchema } from "@/lib/healthcare-validation";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const [doctor, request] = await Promise.all([
      getDoctorByUserId(user.id),
      getDoctorSignupRequestByUserId(user.id),
    ]);

    return NextResponse.json({
      data: {
        access:
          doctor
            ? "approved"
            : request?.status ?? "none",
        doctor,
        request,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load doctor access status.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function PUT(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const existingDoctor = await getDoctorByUserId(user.id);
    if (existingDoctor) {
      return NextResponse.json({ error: "Doctor account is already approved." }, { status: 409 });
    }

    const body = (await request.json()) as unknown;
    const parsed = doctorSignupRequestUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid doctor signup request payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await createOrUpdateDoctorSignupRequest({
      userId: user.id,
      email: user.email,
      ...parsed.data,
    });

    return NextResponse.json({ data, message: "Doctor application submitted for admin review." });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to save doctor application.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
