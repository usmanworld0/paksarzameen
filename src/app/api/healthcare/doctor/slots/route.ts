import { NextResponse } from "next/server";
import {
  addDoctorSlot,
  assertHealthcareUserActive,
  createDoctorSchedule,
  deleteDoctorSlot,
  getDoctorByUserId,
  listDoctorSlots,
  setDoctorSlotAvailability,
} from "@/services/healthcare/core-service";
import { getRequiredApiUser } from "@/server/route-auth";
import {
  doctorBulkScheduleCreateSchema,
  doctorSlotAvailabilitySchema,
  doctorSlotCreateSchema,
  doctorSlotDeleteSchema,
} from "@/lib/healthcare-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
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

    const data = await listDoctorSlots(doctor.doctorId);
    return NextResponse.json({ data });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load doctor slots.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rate = consumeRateLimit({
    key: `healthcare:doctor:slots:${user.id}`,
    max: 60,
    windowMs: 60 * 60 * 1000,
  });

  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many slot operations. Please try later." }, { status: 429 });
  }

  try {
    await assertHealthcareUserActive(user.id);

    const doctor = await getDoctorByUserId(user.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 403 });
    }

    const body = (await request.json()) as unknown;
    const singleParsed = doctorSlotCreateSchema.safeParse(body);
    if (singleParsed.success) {
      const data = await addDoctorSlot(doctor.doctorId, singleParsed.data.slotStart, singleParsed.data.slotEnd);
      return NextResponse.json({ data, message: "Slot added." }, { status: 201 });
    }

    const scheduleParsed = doctorBulkScheduleCreateSchema.safeParse(body);
    if (!scheduleParsed.success) {
      return NextResponse.json(
        {
          error: "Invalid slot payload.",
          details: {
            single: singleParsed.error.flatten(),
            schedule: scheduleParsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const data = await createDoctorSchedule({
      doctorId: doctor.doctorId,
      ...scheduleParsed.data,
    });
    return NextResponse.json(
      {
        data,
        message: `Schedule generated. Created ${data.created.length} slots, skipped ${data.skipped}.`,
      },
      { status: 201 }
    );
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to add slot.");
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
    const parsed = doctorSlotAvailabilitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid slot update payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await setDoctorSlotAvailability({
      doctorId: doctor.doctorId,
      slotId: parsed.data.slotId,
      isAvailable: parsed.data.isAvailable,
    });

    return NextResponse.json({ data, message: "Slot availability updated." });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to update slot.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function DELETE(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const doctor = await getDoctorByUserId(user.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 403 });
    }

    const url = new URL(request.url);
    const parsed = doctorSlotDeleteSchema.safeParse({
      slotId: url.searchParams.get("slotId") ?? "",
    });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid slot delete payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await deleteDoctorSlot({
      doctorId: doctor.doctorId,
      slotId: parsed.data.slotId,
    });

    return NextResponse.json({ data, message: "Slot deleted." });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to delete slot.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
