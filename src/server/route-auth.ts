import {
  requireAdminOrModuleUser,
  requireAdminUser,
  requireAuthenticatedUser,
  requireModulePermission,
  type AppRole,
  type ModuleName,
  type PermissionAction,
} from "@/lib/supabase/authorization";
import { headers } from "next/headers";
import { getSupabaseAnonClient, getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminFallbackEmails, hasSupabaseServiceRoleKey } from "@/lib/supabase/env";

type RouteUser = {
  id: string;
  email: string;
  role: AppRole;
};

function normalizeRole(value: unknown): AppRole {
  const role = String(value ?? "").trim().toLowerCase();
  if (role === "admin" || role === "tenant" || role === "user") {
    return role;
  }

  return "user";
}

async function resolveUserFromBearerToken() {
  const requestHeaders = await headers();
  const authorization = requestHeaders.get("authorization") ?? "";

  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const accessToken = authorization.slice(7).trim();
  if (!accessToken) {
    return null;
  }

  try {
    const supabase = getSupabaseAnonClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return null;
    }

    const email = String(user.email ?? "").trim().toLowerCase();
    const fallbackAdmins = getAdminFallbackEmails();
    const isFallbackAdmin = Boolean(email) && fallbackAdmins.includes(email);

    let role = normalizeRole(user.user_metadata?.role);
    if (isFallbackAdmin) {
      role = "admin";
    }

    if (role !== "admin" && hasSupabaseServiceRoleKey()) {
      const supabaseAdmin = getSupabaseAdminClient();
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle<{ role?: string }>();

      if (!profileError && normalizeRole(profile?.role) === "admin") {
        role = "admin";
      }
    }

    return {
      id: user.id,
      email,
      role,
    } satisfies RouteUser;
  } catch {
    return null;
  }
}

export async function getRequiredApiUser() {
  const cookieUser = await requireAuthenticatedUser();
  if (cookieUser) {
    return cookieUser;
  }

  return resolveUserFromBearerToken();
}

export async function getRequiredAdminApiUser() {
  const cookieAdmin = await requireAdminUser();
  if (cookieAdmin) {
    return cookieAdmin;
  }

  const bearerUser = await resolveUserFromBearerToken();
  if (bearerUser?.role === "admin") {
    return bearerUser;
  }

  return null;
}

export async function getRequiredModuleApiUser(
  moduleName: ModuleName,
  action: PermissionAction = "view"
) {
  return requireModulePermission(moduleName, action);
}

export async function getRequiredAdminOrModuleApiUser(
  moduleName: ModuleName,
  action: PermissionAction = "view"
) {
  return requireAdminOrModuleUser(moduleName, action);
}
