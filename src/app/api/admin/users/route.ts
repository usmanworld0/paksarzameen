import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRequiredAdminApiUser } from "@/server/route-auth";

type ProfileRow = {
  id: string;
  email: string | null;
  role: string | null;
  created_at: string | null;
};

type UserProfileRow = {
  user_id: string;
  city: string | null;
  blood_group: string | null;
  availability_status: string | null;
  profile_image: string | null;
};

type TenantPermissionRow = {
  user_id: string;
  module: string;
  can_view: boolean;
  can_edit: boolean;
  can_manage: boolean;
};

type UserDirectoryItem = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  city: string;
  bloodGroup: string;
  availabilityStatus: string;
  profileImage: string;
  modules: Array<{
    module: string;
    canView: boolean;
    canEdit: boolean;
    canManage: boolean;
  }>;
};

function normalizeRole(value: string | null) {
  const role = (value ?? "user").toLowerCase();
  if (role === "admin" || role === "tenant" || role === "user") {
    return role;
  }
  return "user";
}

function parseLimit(searchParams: URLSearchParams) {
  const parsed = Number.parseInt(searchParams.get("limit") ?? "250", 10);
  if (!Number.isFinite(parsed)) return 250;
  return Math.max(1, Math.min(parsed, 500));
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await getRequiredAdminApiUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(request.url);

    const search = (searchParams.get("search") ?? "").trim();
    const roleFilter = normalizeRole(searchParams.get("role"));
    const limit = parseLimit(searchParams);

    let query = supabase
      .from("profiles")
      .select("id,email,role,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (search) {
      query = query.ilike("email", `%${search}%`);
    }

    if ((searchParams.get("role") ?? "").trim()) {
      query = query.eq("role", roleFilter);
    }

    const { data: profiles, count, error } = await query.returns<ProfileRow[]>();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const profileRows = profiles ?? [];
    const userIds = profileRows.map((row) => row.id);
    if (!userIds.length) {
      return NextResponse.json({ data: [], meta: { total: 0 } });
    }

    const [userProfileResult, tenantPermissionResult] = await Promise.all([
      supabase
        .from("user_profile")
        .select("user_id,city,blood_group,availability_status,profile_image")
        .in("user_id", userIds)
        .returns<UserProfileRow[]>(),
      supabase
        .from("tenant_permissions")
        .select("user_id,module,can_view,can_edit,can_manage")
        .in("user_id", userIds)
        .returns<TenantPermissionRow[]>(),
    ]);

    if (userProfileResult.error) {
      return NextResponse.json({ error: userProfileResult.error.message }, { status: 500 });
    }

    if (tenantPermissionResult.error) {
      return NextResponse.json({ error: tenantPermissionResult.error.message }, { status: 500 });
    }

    const profileByUserId = new Map(
      (userProfileResult.data ?? []).map((row) => [row.user_id, row])
    );
    const permissionsByUserId = new Map<string, TenantPermissionRow[]>();

    for (const row of tenantPermissionResult.data ?? []) {
      const current = permissionsByUserId.get(row.user_id) ?? [];
      current.push(row);
      permissionsByUserId.set(row.user_id, current);
    }

    const data: UserDirectoryItem[] = profileRows.map((row) => {
      const profile = profileByUserId.get(row.id);
      const modules = (permissionsByUserId.get(row.id) ?? []).map((item) => ({
        module: item.module,
        canView: Boolean(item.can_view),
        canEdit: Boolean(item.can_edit),
        canManage: Boolean(item.can_manage),
      }));

      return {
        id: row.id,
        email: row.email ?? "",
        role: normalizeRole(row.role),
        createdAt: row.created_at ?? new Date(0).toISOString(),
        city: profile?.city ?? "",
        bloodGroup: profile?.blood_group ?? "",
        availabilityStatus: profile?.availability_status ?? "unavailable",
        profileImage: profile?.profile_image ?? "",
        modules,
      };
    });

    return NextResponse.json({
      data,
      meta: {
        total: count ?? data.length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load admin users.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
