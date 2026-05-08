import { NextResponse } from "next/server";
import { createOrUpdateDoctorSignupRequest } from "@/services/healthcare/core-service";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceRoleKey } from "@/lib/supabase/env";
import { doctorSignupSchema } from "@/lib/healthcare-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hasSupabaseServiceRoleKey()) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server." }, { status: 503 });
  }

  let createdUserId: string | null = null;

  try {
    const body = (await request.json()) as unknown;
    const parsed = doctorSignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid doctor signup payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const rate = consumeRateLimit({
      key: `healthcare:doctor-signup:${email}`,
      max: 3,
      windowMs: 24 * 60 * 60 * 1000,
    });

    if (!rate.allowed) {
      return NextResponse.json({ error: "Daily doctor signup limit exceeded for this email." }, { status: 429 });
    }

    const supabaseAdmin = getSupabaseAdminClient();
    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: {
        role: "user",
        is_doctor: true,
      },
    });

    if (createError || !createdUser.user) {
      return NextResponse.json({ error: createError?.message ?? "Unable to create doctor auth user." }, { status: 400 });
    }

    createdUserId = createdUser.user.id;

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: createdUserId,
      email,
      role: "user",
    });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(createdUserId);
      createdUserId = null;
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const signupRequest = await createOrUpdateDoctorSignupRequest({
      userId: createdUserId,
      email,
      fullName: parsed.data.fullName,
      specialization: parsed.data.specialization ?? null,
      bio: parsed.data.bio ?? null,
      experienceYears: parsed.data.experienceYears ?? null,
      consultationFee: parsed.data.consultationFee ?? null,
    });

    return NextResponse.json(
      {
        data: {
          request: signupRequest,
          user: {
            id: createdUserId,
            email,
          },
        },
        message: "Doctor account created. Your application is pending admin approval.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (createdUserId) {
      try {
        await getSupabaseAdminClient().auth.admin.deleteUser(createdUserId);
      } catch {
        // Ignore cleanup failures and report the original error.
      }
    }

    const mapped = mapHealthcareError(error, "Failed to create doctor account.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
