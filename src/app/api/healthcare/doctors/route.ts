import { NextResponse } from "next/server";
import { assertHealthcareUserActive, listDoctors, listAvailableDoctorSlots } from "@/services/healthcare/core-service";
import { getRequiredApiUser } from "@/server/route-auth";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ data: { doctors: [], slots: [] } });
    }

    const [doctors, slots] = await Promise.all([listDoctors(), listAvailableDoctorSlots()]);
    return NextResponse.json({ data: { doctors, slots } });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load doctors.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
