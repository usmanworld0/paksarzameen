import { createClient as createSupabaseServerClient } from "@/utils/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminFallbackEmails, hasSupabaseServiceRoleKey } from "@/lib/supabase/env";
import {
  getAdminSessionFromCookies,
  hasAdminSessionPermission,
} from "@/lib/admin-session";

export type AppRole = "admin" | "tenant" | "user";
export type ModuleName = "blood_bank" | "dog_adoption" | string;
export type PermissionAction = "view" | "edit" | "manage";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: AppRole;
};

type TenantPermission = {
  can_view: boolean;
  can_edit: boolean;
  can_manage: boolean;
};

function normalizeRole(value: unknown): AppRole {
  const role = String(value ?? "").trim().toLowerCase();
  if (role === "admin" || role === "tenant" || role === "user") {
    return role;
  }

  return "user";
}

function mapActionColumn(action: PermissionAction) {
  if (action === "view") return "can_view";
  if (action === "edit") return "can_edit";
  return "can_manage";
}

export async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return null;
  }

  const email = String(profile?.email ?? user.email ?? "").trim().toLowerCase();
  const fallbackAdmins = getAdminFallbackEmails();
  const isFallbackAdmin = Boolean(email) && fallbackAdmins.includes(email);
  const baseRole = normalizeRole(profile?.role ?? user.user_metadata?.role);

  let role: AppRole = isFallbackAdmin ? "admin" : baseRole;
  if (role !== "admin" && hasSupabaseServiceRoleKey()) {
    try {
      const supabaseAdmin = getSupabaseAdminClient();
      const { data: adminProfile, error: adminProfileError } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle<{ role?: string }>();

      if (!adminProfileError && normalizeRole(adminProfile?.role) === "admin") {
        role = "admin";
      }
    } catch {
      // Ignore fallback failures and continue with the best known role.
    }
  }

  return {
    id: String(profile?.id ?? user.id),
    email,
    role,
  } satisfies AuthenticatedUser;
}

export async function hasTenantPermission(
  userId: string,
  moduleName: ModuleName,
  action: PermissionAction
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tenant_permissions")
    .select("can_view, can_edit, can_manage")
    .eq("user_id", userId)
    .eq("module", moduleName)
    .maybeSingle<TenantPermission>();

  if (error || !data) {
    return false;
  }

  const column = mapActionColumn(action);
  return Boolean(data[column]);
}

export async function requireAuthenticatedUser() {
  return getAuthenticatedUser();
}

export async function requireAdminUser() {
  const adminSession = await getAdminSessionFromCookies();
  if (adminSession?.role === "admin") {
    return {
      id: `admin-session:${adminSession.email}`,
      email: adminSession.email,
      role: "admin" as const,
    };
  }

  const user = await getAuthenticatedUser();
  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

export async function requireAdminOrModuleUser(
  moduleName: ModuleName,
  action: PermissionAction = "view"
) {
  const session = await getAdminSessionFromCookies();
  if (session) {
    if (session.role === "admin" || hasAdminSessionPermission(session, moduleName, action)) {
      return {
        id: `admin-session:${session.email}`,
        email: session.email,
        role: session.role,
      } as AuthenticatedUser;
    }
  }

  return requireModulePermission(moduleName, action);
}

export async function requireModulePermission(
  moduleName: ModuleName,
  action: PermissionAction = "view"
) {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  if (user.role === "admin") {
    return user;
  }

  if (user.role !== "tenant") return null;

  const allowed = await hasTenantPermission(user.id, moduleName, action);
  return allowed ? user : null;
}
