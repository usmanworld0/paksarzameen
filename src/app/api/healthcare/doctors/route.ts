import { NextResponse } from "next/server";
import {
  getDemoAvailableDoctorSlots,
  getDemoDoctorsWithFilters,
  listAvailableDoctorSlots,
  listDoctorsWithFilters,
} from "@/services/healthcare/core-service";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";
import { doctorListQuerySchema } from "@/lib/healthcare-validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const allowDemoFallback =
    process.env.NODE_ENV !== "production" || process.env.HEALTHCARE_ALLOW_DEMO_FALLBACK === "true";

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

    const [doctors, slots] = await Promise.all([
      listDoctorsWithFilters(parsed.data),
      listAvailableDoctorSlots(),
    ]);

    if (!doctors.length) {
      if (!allowDemoFallback) {
        return NextResponse.json(
          {
            error:
              "Healthcare doctors are unavailable from the live database in production. Check Supabase RLS policies and deployment environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY).",
            code: "HEALTHCARE_LIVE_DATA_UNAVAILABLE",
          },
          { status: 503 }
        );
      }

      return NextResponse.json({
        data: {
          doctors: getDemoDoctorsWithFilters(parsed.data),
          slots: getDemoAvailableDoctorSlots(),
        },
        message: "Showing demo doctors until live healthcare data is available.",
      });
    }

    return NextResponse.json({ data: { doctors, slots } });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load doctors.");

    if (mapped.code === "HEALTHCARE_SCHEMA_NOT_INITIALIZED" && allowDemoFallback) {
      return NextResponse.json({
        data: {
          doctors: getDemoDoctorsWithFilters({}),
          slots: getDemoAvailableDoctorSlots(),
        },
        message: "Showing demo doctors because healthcare schema is not initialized.",
      });
    }

    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
