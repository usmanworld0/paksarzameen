import { NextResponse } from "next/server";
import {
  assertHealthcareUserActive,
  createAppointmentMessage,
  getAppointmentById,
  getDoctorByUserId,
  listAppointmentMessages,
  markAppointmentMessagesRead,
} from "@/lib/healthcare";
import { getRequiredApiUser } from "@/server/route-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

async function isAllowedForAppointment(userId: string, appointmentId: string) {
  const appointment = await getAppointmentById(appointmentId);
  if (!appointment) return { allowed: false, appointment: null as Awaited<ReturnType<typeof getAppointmentById>> };

  if (appointment.patientUserId === userId) {
    return { allowed: true, appointment };
  }

  const doctor = await getDoctorByUserId(userId);
  if (doctor && doctor.doctorId === appointment.doctorId) {
    return { allowed: true, appointment };
  }

  return { allowed: false, appointment };
}

export async function GET(_: Request, context: RouteContext) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const { id } = await context.params;
    const access = await isAllowedForAppointment(user.id, id);
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const data = await listAppointmentMessages(id);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load messages.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const { id } = await context.params;
    const access = await isAllowedForAppointment(user.id, id);
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = (await request.json()) as { body?: string; attachmentUrl?: string };
    const text = String(body.body ?? "").trim();
    if (!text) {
      return NextResponse.json({ error: "Message body is required." }, { status: 400 });
    }

    const attachmentUrl = typeof body.attachmentUrl === "string" ? body.attachmentUrl : null;
    const data = await createAppointmentMessage(id, user.id, user.email ?? null, text, attachmentUrl);
    return NextResponse.json({ data, message: "Message sent." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create message.";
    const statusCode = message.startsWith("SUSPENDED:") || message.includes("Forbidden")
      ? 403
      : message.includes("required") || message.includes("Invalid")
        ? 400
        : 500;
    return NextResponse.json({ error: message.replace(/^SUSPENDED:/, "") }, { status: statusCode });
  }
}

export async function PATCH(_: Request, context: RouteContext) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const { id } = await context.params;
    const access = await isAllowedForAppointment(user.id, id);
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const updatedCount = await markAppointmentMessagesRead(id, user.id);
    return NextResponse.json({ data: { updatedCount }, message: "Read receipts updated." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update read receipts.";
    const statusCode = message.startsWith("SUSPENDED:") ? 403 : 500;
    return NextResponse.json({ error: message.replace(/^SUSPENDED:/, "") }, { status: statusCode });
  }
}
