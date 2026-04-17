import { NextResponse } from "next/server";
import { addDoctorSlot, getDoctorByUserId, listDoctorSlots } from "@/lib/healthcare";
import { getRequiredApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
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
    const message = error instanceof Error ? error.message : "Failed to load doctor slots.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const doctor = await getDoctorByUserId(user.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 403 });
    }

    const body = (await request.json()) as { slotStart?: string; slotEnd?: string };
    const slotStart = String(body.slotStart ?? "").trim();
    const slotEnd = String(body.slotEnd ?? "").trim();

    if (!slotStart || !slotEnd) {
      return NextResponse.json({ error: "slotStart and slotEnd are required." }, { status: 400 });
    }

    const data = await addDoctorSlot(doctor.doctorId, slotStart, slotEnd);
    return NextResponse.json({ data, message: "Slot added." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add slot.";
    const statusCode = message.includes("Invalid") ? 400 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
