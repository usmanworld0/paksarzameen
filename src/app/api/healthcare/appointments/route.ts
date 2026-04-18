import { NextResponse } from "next/server";
import {
  assertHealthcareUserActive,
  bookAppointment,
  getAppointmentById,
  listAppointmentsForPatient,
  updateAppointmentStatus,
} from "@/lib/healthcare";
import { getRequiredApiUser } from "@/server/route-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await assertHealthcareUserActive(user.id);

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ data: [] });
    }

    const data = await listAppointmentsForPatient(user.id);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load appointments.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await assertHealthcareUserActive(user.id);

    // Fetch full user data including CNIC from database
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { cnic: true },
    });

    if (!fullUser?.cnic) {
      return NextResponse.json(
        { error: "CNIC is required to book an appointment. Please complete your profile with CNIC information." },
        { status: 403 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const body = (await request.json()) as {
      doctorId?: string;
      slotId?: string;
      reason?: string;
    };

    const doctorId = String(body.doctorId ?? "").trim();
    const slotId = String(body.slotId ?? "").trim();
    const reason = String(body.reason ?? "").trim();

    if (!doctorId || !slotId || !reason) {
      return NextResponse.json({ error: "doctorId, slotId, and reason are required." }, { status: 400 });
    }

    const data = await bookAppointment({
      doctorId,
      patientUserId: user.id,
      slotId,
      reason,
    });

    return NextResponse.json({ data, message: "Appointment booked." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to book appointment.";
    const statusCode = message.includes("required") || message.includes("Slot") ? 400 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function PATCH(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await assertHealthcareUserActive(user.id);

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const body = (await request.json()) as {
      appointmentId?: string;
      status?: string;
    };

    const appointmentId = String(body.appointmentId ?? "").trim();
    const status = String(body.status ?? "").trim().toLowerCase();

    if (!appointmentId || status !== "cancelled") {
      return NextResponse.json(
        { error: "Only appointment cancellation is supported here. appointmentId and status=cancelled are required." },
        { status: 400 }
      );
    }

    const appointment = await getAppointmentById(appointmentId);
    if (!appointment || appointment.patientUserId !== user.id) {
      return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    }

    const slotStart = new Date(appointment.slotStart).getTime();
    const now = Date.now();
    const cancelWindowMs = 2 * 60 * 60 * 1000;
    if (slotStart - now < cancelWindowMs) {
      return NextResponse.json(
        { error: "Appointments can only be cancelled at least 2 hours before slot start." },
        { status: 400 }
      );
    }

    const data = await updateAppointmentStatus(appointmentId, "cancelled");
    return NextResponse.json({ data, message: "Appointment cancelled." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update appointment.";
    const statusCode = message.startsWith("SUSPENDED:") ? 403 : 500;
    return NextResponse.json({ error: message.replace(/^SUSPENDED:/, "") }, { status: statusCode });
  }
}
