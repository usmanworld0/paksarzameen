import { NextResponse } from "next/server";
import { addDoctorSlot, assertHealthcareUserActive, getDoctorByUserId, listDoctorSlots } from "@/services/healthcare/core-service";
import { getRequiredApiUser } from "@/server/route-auth";
import { doctorSlotCreateSchema } from "@/lib/healthcare-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

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

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const doctor = await getDoctorByUserId(user.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 403 });
    }

    const body = (await request.json()) as unknown;
    const parsed = doctorSlotCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid slot payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await addDoctorSlot(doctor.doctorId, parsed.data.slotStart, parsed.data.slotEnd);
    return NextResponse.json({ data, message: "Slot added." }, { status: 201 });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to add slot.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
