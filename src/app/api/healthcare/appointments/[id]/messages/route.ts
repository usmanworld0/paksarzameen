import { NextResponse } from "next/server";
import {
  assertHealthcareUserActive,
  createAppointmentMessage,
  getAppointmentById,
  getDoctorByUserId,
  listAppointmentMessages,
  markAppointmentMessagesRead,
} from "@/services/healthcare/core-service";
import { getRequiredApiUser } from "@/server/route-auth";
import { appointmentMessageCreateSchema } from "@/lib/healthcare-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

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
    const mapped = mapHealthcareError(error, "Failed to load messages.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rate = consumeRateLimit({
    key: `healthcare:appointment:message:${user.id}`,
    max: 30,
    windowMs: 60_000,
  });

  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded for messaging." }, { status: 429 });
  }

  try {
    await assertHealthcareUserActive(user.id);

    const { id } = await context.params;
    const access = await isAllowedForAppointment(user.id, id);
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = (await request.json()) as unknown;
    const parsed = appointmentMessageCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid message payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await createAppointmentMessage(
      id,
      user.id,
      user.email ?? null,
      parsed.data.body,
      parsed.data.attachmentUrl ?? null
    );
    return NextResponse.json({ data, message: "Message sent." }, { status: 201 });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to create message.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
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
    const mapped = mapHealthcareError(error, "Failed to update read receipts.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
