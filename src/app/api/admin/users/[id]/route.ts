import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceRoleKey } from "@/lib/supabase/env";
import { getRequiredAdminApiUser } from "@/server/route-auth";
import { isValidCnic, isValidEmail, normalizeCnic, normalizeEmail, safeText } from "@/server/validation";

type Role = "admin" | "tenant" | "user";

type TenantPermissionInput = {
  module: string;
  can_view?: boolean;
  can_edit?: boolean;
  can_manage?: boolean;
};

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getRequiredAdminApiUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseServiceRoleKey()) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as {
      email?: string;
      role?: Role;
      cnic?: string;
      phone?: string;
      city?: string;
      bloodGroup?: string;
      availabilityStatus?: "available" | "unavailable";
      lastDonationDate?: string | null;
      emergencyContact?: string;
      profileImage?: string;
      dateOfBirth?: string | null;
      gender?: string;
      address?: string;
      allergies?: string;
      medicalHistory?: string;
      occupation?: string;
      maritalStatus?: string;
      permissions?: TenantPermissionInput[];
    };

    const email = normalizeEmail(String(body.email ?? ""));
    const role = String(body.role ?? "user").toLowerCase() as Role;

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!["admin", "tenant", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const normalizedCnic = body.cnic ? normalizeCnic(body.cnic) : "";
    if (normalizedCnic && !isValidCnic(normalizedCnic)) {
      return NextResponse.json(
        { error: "Please provide a valid CNIC format (e.g., 12345-1234567-1)." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdminClient();

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
      email,
      user_metadata: { role },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id,
      email,
      role,
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const { error: userProfileError } = await supabaseAdmin.from("user_profile").upsert(
      {
        user_id: id,
        cnic: normalizedCnic || null,
        phone: safeText(body.phone ?? "", 30) || null,
        city: safeText(body.city ?? "", 80) || null,
        blood_group: safeText(body.bloodGroup ?? "", 3).toUpperCase() || null,
        availability_status: body.availabilityStatus === "available" ? "available" : "unavailable",
        last_donation_date: body.lastDonationDate || null,
        emergency_contact: safeText(body.emergencyContact ?? "", 30) || null,
        profile_image: safeText(body.profileImage ?? "", 500) || null,
        date_of_birth: body.dateOfBirth || null,
        gender: safeText(body.gender ?? "", 40) || null,
        address: safeText(body.address ?? "", 400) || null,
        allergies: safeText(body.allergies ?? "", 400) || null,
        medical_history: safeText(body.medicalHistory ?? "", 1200) || null,
        occupation: safeText(body.occupation ?? "", 100) || null,
        marital_status: safeText(body.maritalStatus ?? "", 40) || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (userProfileError) {
      return NextResponse.json({ error: userProfileError.message }, { status: 500 });
    }

    if (role === "tenant") {
      const permissions = Array.isArray(body.permissions) ? body.permissions : [];
      if (permissions.length) {
        const rows = permissions.map((permission) => ({
          user_id: id,
          module: String(permission.module ?? "").trim().toLowerCase(),
          can_view: Boolean(permission.can_view),
          can_edit: Boolean(permission.can_edit),
          can_manage: Boolean(permission.can_manage),
        }));

        if (rows.some((row) => !row.module)) {
          return NextResponse.json({ error: "Permission module is required." }, { status: 400 });
        }

        const { error: deleteError } = await supabaseAdmin.from("tenant_permissions").delete().eq("user_id", id);
        if (deleteError) {
          return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        const { error: insertError } = await supabaseAdmin.from("tenant_permissions").insert(rows);
        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
      }
    } else {
      const { error: deleteError } = await supabaseAdmin.from("tenant_permissions").delete().eq("user_id", id);
      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      data: {
        id,
        email,
        role,
      },
      message: "User updated successfully.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update user.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
