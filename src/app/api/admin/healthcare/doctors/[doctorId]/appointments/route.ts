import { NextResponse } from "next/server";
import { getDoctorById, listAppointmentsForDoctor } from "@/services/healthcare/core-service";
import { getRequiredAdminApiUser } from "@/server/route-auth";
import { doctorAppointmentQuerySchema } from "@/lib/healthcare-validation";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ doctorId: string }> }
) {
  const admin = await getRequiredAdminApiUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { doctorId } = await context.params;
    const doctor = await getDoctorById(doctorId);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = doctorAppointmentQuerySchema.safeParse({
      status: searchParams.get("status") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      sortOrder: searchParams.get("sortOrder") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid doctor appointments query parameters.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await listAppointmentsForDoctor(doctorId, parsed.data);
    return NextResponse.json({ data });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load doctor appointments.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
