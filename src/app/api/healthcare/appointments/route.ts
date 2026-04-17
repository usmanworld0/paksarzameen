import { NextResponse } from "next/server";
import { bookAppointment, listAppointmentsForPatient } from "@/lib/healthcare";
import { getRequiredApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
