import { NextResponse } from "next/server";
import { assertHealthcareUserActive, getDoctorByUserId, updateDoctor } from "@/services/healthcare/core-service";
import { getRequiredApiUser } from "@/server/route-auth";
import { doctorProfileUpdateSchema } from "@/lib/healthcare-validation";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const doctor = await getDoctorByUserId(user.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 403 });
    }

    return NextResponse.json({ data: doctor });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load doctor profile.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function PATCH(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const doctor = await getDoctorByUserId(user.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 403 });
    }

    const body = (await request.json()) as unknown;
    const parsed = doctorProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid doctor profile payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await updateDoctor({
      doctorId: doctor.doctorId,
      ...parsed.data,
    });

    return NextResponse.json({ data, message: "Doctor profile updated." });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to update doctor profile.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
