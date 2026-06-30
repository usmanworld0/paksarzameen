import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/middleware";
import { getAdminFallbackEmails } from "@/lib/supabase/env";

type AppRole = "admin" | "tenant" | "user";

const NO_STORE_VALUE = "no-store, no-cache, max-age=0, must-revalidate";
const PUBLIC_FILE_PATTERN = /\.[^/]+$/;

function isPath(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

function isFreshDeploymentRequest(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (isPath(pathname, "/api")) return true;
  if (pathname.startsWith("/_next/")) return false;
  if (PUBLIC_FILE_PATTERN.test(pathname)) return false;

  const accept = request.headers.get("accept") ?? "";
  const isRscRequest = request.headers.get("rsc") === "1" || searchParams.has("_rsc");

  return accept.includes("text/html") || isRscRequest;
}

function withFreshDeploymentHeaders(response: NextResponse, request: NextRequest) {
  if (!isFreshDeploymentRequest(request)) return response;

  response.headers.set("Cache-Control", NO_STORE_VALUE);
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

function jsonUnauthorized(message: string, status = 401) {
  return NextResponse.json({ error: message }, { status });
}

function loginRedirect(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

function normalizeRole(value: unknown): AppRole {
  const role = String(value ?? "").trim().toLowerCase();
  if (role === "admin" || role === "tenant" || role === "user") {
    return role;
  }

  return "user";
}

async function getRoleAndPermissions(
  userId: string,
  user: User,
  supabase: ReturnType<typeof createClient>["supabase"]
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle<{ role: AppRole }>();

  const email = String(user.email ?? "").trim().toLowerCase();
  const fallbackAdmins = getAdminFallbackEmails();
  const isFallbackAdmin = Boolean(email) && fallbackAdmins.includes(email);
  const baseRole = normalizeRole(profile?.role ?? user.user_metadata?.role);
  const role: AppRole = isFallbackAdmin ? "admin" : baseRole;

  async function hasPermission(moduleName: string, action: "view" | "edit" | "manage") {
    if (role === "admin") return true;
    if (role === "user") return true;

    const { data: permission } = await supabase
      .from("tenant_permissions")
      .select("can_view, can_edit, can_manage")
      .eq("user_id", userId)
      .eq("module", moduleName)
      .maybeSingle<{ can_view: boolean; can_edit: boolean; can_manage: boolean }>();

    if (!permission) return false;

    if (action === "view") return Boolean(permission.can_view);
    if (action === "edit") return Boolean(permission.can_edit);
    return Boolean(permission.can_manage);
  }

  return { role, hasPermission };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = isPath(pathname, "/api");

  const authRequiredForPath =
    isPath(pathname, "/dog-adoption") ||
    isPath(pathname, "/my-adoptions") ||
    isPath(pathname, "/api/adoption-requests");

  const adminRequiredForPath =
    isPath(pathname, "/admin") || isPath(pathname, "/api/admin") || isPath(pathname, "/api/create-user");

  const requiresDogAdoptionPermission =
    isPath(pathname, "/dog-adoption") ||
    isPath(pathname, "/dog") ||
    isPath(pathname, "/my-adoptions") ||
    isPath(pathname, "/api/dogs") ||
    isPath(pathname, "/api/adoption-requests");

  const requiresBloodBankPermission =
    isPath(pathname, "/blood-bank") || isPath(pathname, "/api/blood-requests");

  const needsAuthContext =
    authRequiredForPath ||
    adminRequiredForPath ||
    requiresDogAdoptionPermission ||
    requiresBloodBankPermission;

  if (!needsAuthContext) {
    return withFreshDeploymentHeaders(NextResponse.next(), request);
  }

  const { supabase, response } = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (authRequiredForPath && !user) {
    if (isApi) return withFreshDeploymentHeaders(jsonUnauthorized("Unauthorized"), request);
    return withFreshDeploymentHeaders(loginRedirect(request), request);
  }

  if (!user) {
    return withFreshDeploymentHeaders(response, request);
  }

  const { role, hasPermission } = await getRoleAndPermissions(user.id, user, supabase);

  if (adminRequiredForPath && role !== "admin") {
    // Admin pages/APIs enforce role checks again at the route level.
    // Avoid hard middleware rejection here because profile reads can be incomplete in edge runtime.
    return withFreshDeploymentHeaders(response, request);
  }

  if (role === "tenant" && requiresDogAdoptionPermission) {
    const allowed = await hasPermission("dog_adoption", "view");
    if (!allowed) {
      if (isApi) return withFreshDeploymentHeaders(jsonUnauthorized("Forbidden", 403), request);
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return withFreshDeploymentHeaders(NextResponse.redirect(url), request);
    }
  }

  if (role === "tenant" && requiresBloodBankPermission) {
    const allowed = await hasPermission("blood_bank", "view");
    if (!allowed) {
      if (isApi) return withFreshDeploymentHeaders(jsonUnauthorized("Forbidden", 403), request);
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return withFreshDeploymentHeaders(NextResponse.redirect(url), request);
    }
  }

  return withFreshDeploymentHeaders(response, request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
