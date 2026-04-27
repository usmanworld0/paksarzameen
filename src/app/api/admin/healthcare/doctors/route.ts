import { NextResponse } from "next/server";
import { listDoctorsWithFilters } from "@/services/healthcare/core-service";
import { getRequiredAdminApiUser } from "@/server/route-auth";
import { doctorListQuerySchema } from "@/lib/healthcare-validation";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await getRequiredAdminApiUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const parsed = doctorListQuerySchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      specialization: searchParams.get("specialization") ?? undefined,
      minExperience: searchParams.get("minExperience") ?? undefined,
      maxFee: searchParams.get("maxFee") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      sortOrder: searchParams.get("sortOrder") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid doctors query parameters.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await listDoctorsWithFilters(parsed.data);
    return NextResponse.json({ data });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load doctors.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function POST(request: Request) {
  void request;
  return NextResponse.json(
    {
      error:
        "Direct doctor creation from admin is disabled. Doctors must sign up through /healthcare/doctor/sign-up and await admin approval.",
    },
    { status: 405 }
  );
}
