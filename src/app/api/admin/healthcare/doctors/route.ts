import { NextResponse } from "next/server";
import { createDoctor, listDoctorsWithFilters } from "@/services/healthcare/core-service";
import { getRequiredAdminApiUser } from "@/server/route-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceRoleKey } from "@/lib/supabase/env";
import { doctorCreateSchema, doctorListQuerySchema } from "@/lib/healthcare-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
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
  const admin = await getRequiredAdminApiUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!hasSupabaseServiceRoleKey()) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server." }, { status: 503 });
  }

  try {
    const rate = consumeRateLimit({
      key: `healthcare:admin:doctor-create:${admin.id}`,
      max: 50,
      windowMs: 24 * 60 * 60 * 1000,
    });

    if (!rate.allowed) {
      return NextResponse.json({ error: "Daily doctor creation limit exceeded." }, { status: 429 });
    }

    const body = (await request.json()) as unknown;
    const parsed = doctorCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid doctor creation payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const password = parsed.data.password;
    const fullName = parsed.data.fullName;
    const specialization = parsed.data.specialization ?? "";
    const bio = parsed.data.bio ?? "";
    const experienceYears = parsed.data.experienceYears ?? null;
    const consultationFee = parsed.data.consultationFee ?? null;

    const supabaseAdmin = getSupabaseAdminClient();
    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "user",
        is_doctor: true,
      },
    });

    if (createError || !createdUser.user) {
      return NextResponse.json({ error: createError?.message ?? "Unable to create doctor auth user." }, { status: 400 });
    }

    const userId = createdUser.user.id;
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email,
      role: "user",
    });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const data = await createDoctor({
      userId,
      email,
      fullName,
      specialization: specialization || null,
      bio: bio || null,
      experienceYears,
      consultationFee,
    });

    return NextResponse.json({ data, message: "Doctor account created." }, { status: 201 });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to create doctor account.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
