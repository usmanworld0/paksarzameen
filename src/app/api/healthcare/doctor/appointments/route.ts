import { NextResponse } from "next/server";
import {
  assertHealthcareUserActive,
  getDoctorByUserId,
  listAppointmentsForDoctor,
  updateAppointmentByDoctor,
} from "@/services/healthcare/core-service";
import { getRequiredApiUser } from "@/server/route-auth";
import { doctorAppointmentQuerySchema, doctorAppointmentStatusSchema } from "@/lib/healthcare-validation";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const doctor = await getDoctorByUserId(user.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 403 });
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

    const data = await listAppointmentsForDoctor(doctor.doctorId, parsed.data);
    return NextResponse.json({ data });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load doctor appointments.");
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
    const parsed = doctorAppointmentStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid appointment status payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await updateAppointmentByDoctor({
      appointmentId: parsed.data.appointmentId,
      doctorId: doctor.doctorId,
      status: parsed.data.status,
    });

    return NextResponse.json({ data, message: "Appointment updated." });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to update appointment.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
