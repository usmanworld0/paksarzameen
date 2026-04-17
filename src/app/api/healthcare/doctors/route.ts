import { NextResponse } from "next/server";
import { listDoctors, listAvailableDoctorSlots } from "@/lib/healthcare";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ data: { doctors: [], slots: [] } });
    }

    const [doctors, slots] = await Promise.all([listDoctors(), listAvailableDoctorSlots()]);
    return NextResponse.json({ data: { doctors, slots } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load doctors.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
