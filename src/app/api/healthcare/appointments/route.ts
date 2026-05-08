import { NextResponse } from "next/server";
import {
  assertHealthcareUserActive,
  bookAppointment,
  listAppointmentsForPatient,
  updateAppointmentStatus,
} from "@/services/healthcare/core-service";
import { getRequiredApiUser } from "@/server/route-auth";
import { appointmentCancelSchema, appointmentCreateSchema, appointmentListQuerySchema } from "@/lib/healthcare-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { enforceAppointmentCancellationRule } from "@/services/healthcare/core-service";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await assertHealthcareUserActive(user.id);

    const { searchParams } = new URL(request.url);
    const parsed = appointmentListQuerySchema.safeParse({
      status: searchParams.get("status") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      sortOrder: searchParams.get("sortOrder") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid appointments query parameters.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await listAppointmentsForPatient(user.id, parsed.data);
    return NextResponse.json({ data });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load appointments.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rate = consumeRateLimit({
      key: `healthcare:appointment:create:${user.id}`,
      max: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please try again later." },
        { status: 429 }
      );
    }

    await assertHealthcareUserActive(user.id);

    const body = (await request.json()) as unknown;
    const parsed = appointmentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid appointment request payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await bookAppointment({
      doctorId: parsed.data.doctorId,
      patientUserId: user.id,
      slotId: parsed.data.slotId,
      reason: parsed.data.reason,
    });

    return NextResponse.json({ data, message: "Appointment booked." }, { status: 201 });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to book appointment.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function PATCH(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await assertHealthcareUserActive(user.id);

    const body = (await request.json()) as unknown;
    const parsed = appointmentCancelSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid cancellation payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    await enforceAppointmentCancellationRule({
      appointmentId: parsed.data.appointmentId,
      actingUserId: user.id,
      minimumHoursBeforeStart: 2,
    });

    const data = await updateAppointmentStatus(parsed.data.appointmentId, "cancelled");
    return NextResponse.json({ data, message: "Appointment cancelled." });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to update appointment.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
