import { NextResponse } from "next/server";
import { createDoctor, listDoctors } from "@/lib/healthcare";
import { getRequiredAdminApiUser } from "@/server/route-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceRoleKey } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getRequiredAdminApiUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ data: [] });
    }

    const data = await listDoctors();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load doctors.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getRequiredAdminApiUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!hasSupabaseServiceRoleKey()) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server." }, { status: 503 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const body = (await request.json()) as {
      email?: string;
      password?: string;
      fullName?: string;
      specialization?: string;
      bio?: string;
      experienceYears?: number;
      consultationFee?: number;
    };

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const fullName = String(body.fullName ?? "").trim();
    const specialization = String(body.specialization ?? "").trim();
    const bio = String(body.bio ?? "").trim();
    const experienceYears =
      typeof body.experienceYears === "number" && Number.isFinite(body.experienceYears)
        ? Math.max(0, Math.floor(body.experienceYears))
        : null;
    const consultationFee =
      typeof body.consultationFee === "number" && Number.isFinite(body.consultationFee)
        ? Math.max(0, Number(body.consultationFee))
        : null;

    if (!email || !password || password.length < 8 || !fullName) {
      return NextResponse.json(
        { error: "email, fullName, and password (min 8 chars) are required." },
        { status: 400 }
      );
    }

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
    const message = error instanceof Error ? error.message : "Failed to create doctor account.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
