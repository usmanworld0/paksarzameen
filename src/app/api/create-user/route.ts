import { NextResponse } from "next/server";

import { getRequiredAdminApiUser } from "@/server/route-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceRoleKey } from "@/lib/supabase/env";

type Role = "admin" | "tenant" | "user";

type TenantPermissionInput = {
  module: string;
  can_view?: boolean;
  can_edit?: boolean;
  can_manage?: boolean;
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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
    const supabaseAdmin = getSupabaseAdminClient();
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      role?: Role;
      permissions?: TenantPermissionInput[];
    };

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = String(body.role ?? "user").toLowerCase() as Role;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password is required and must be at least 8 characters." },
        { status: 400 }
      );
    }
    if (!["admin", "tenant", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
      },
    });

    if (createError || !createdUser.user) {
      return NextResponse.json(
        { error: createError?.message ?? "Unable to create auth user." },
        { status: 400 }
      );
    }

    const userId = createdUser.user.id;

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email,
      role,
    });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (role === "tenant") {
      const permissions = Array.isArray(body.permissions) ? body.permissions : [];

      if (permissions.length) {
        const rows = permissions.map((permission) => ({
          user_id: userId,
          module: String(permission.module ?? "").trim().toLowerCase(),
          can_view: Boolean(permission.can_view),
          can_edit: Boolean(permission.can_edit),
          can_manage: Boolean(permission.can_manage),
        }));

        if (rows.some((row) => !row.module)) {
          return NextResponse.json({ error: "Permission module is required." }, { status: 400 });
        }

        const { error: permissionError } = await supabaseAdmin
          .from("tenant_permissions")
          .insert(rows);

        if (permissionError) {
          await supabaseAdmin.from("profiles").delete().eq("id", userId);
          await supabaseAdmin.auth.admin.deleteUser(userId);
          return NextResponse.json({ error: permissionError.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json(
      {
        data: {
          id: userId,
          email,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
