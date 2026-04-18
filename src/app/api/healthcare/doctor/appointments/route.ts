import { NextResponse } from "next/server";
import {
  assertHealthcareUserActive,
  getDoctorByUserId,
  listAppointmentsForDoctor,
  normalizeAppointmentStatus,
  updateAppointmentStatus,
} from "@/lib/healthcare";
import { getRequiredApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ data: [] });
    }

    const doctor = await getDoctorByUserId(user.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 403 });
    }

    const data = await listAppointmentsForDoctor(doctor.doctorId);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load doctor appointments.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const doctor = await getDoctorByUserId(user.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 403 });
    }

    const body = (await request.json()) as { appointmentId?: string; status?: string };
    const appointmentId = String(body.appointmentId ?? "").trim();
    if (!appointmentId) {
      return NextResponse.json({ error: "appointmentId is required." }, { status: 400 });
    }

    const status = normalizeAppointmentStatus(body.status);
    const data = await updateAppointmentStatus(appointmentId, status);
    if (data.doctorId !== doctor.doctorId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    return NextResponse.json({ data, message: "Appointment updated." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update appointment.";
    const statusCode = message.startsWith("SUSPENDED:")
      ? 403
      : message.includes("Invalid") || message.includes("cannot")
        ? 400
        : message.includes("not found")
          ? 404
          : 500;
    return NextResponse.json({ error: message.replace(/^SUSPENDED:/, "") }, { status: statusCode });
  }
}
