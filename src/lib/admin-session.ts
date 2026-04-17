import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE_NAME = "psz_admin_session";

export type AdminSessionRole = "admin" | "tenant";
export type AdminSessionPermissionAction = "view" | "edit" | "manage";

export type AdminSessionPermission = {
  module: string;
  can_view: boolean;
  can_edit: boolean;
  can_manage: boolean;
};

type AdminSessionPayload = {
  email: string;
  role: AdminSessionRole;
  permissions: AdminSessionPermission[];
  exp: number;
};

function getAdminSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "psz-admin-dev-secret"
  );
}

function signPayload(payloadB64: string) {
  return createHmac("sha256", getAdminSessionSecret()).update(payloadB64).digest("base64url");
}

export function createAdminSessionToken(
  email: string,
  role: AdminSessionRole = "admin",
  permissions: AdminSessionPermission[] = [],
  ttlSeconds = 60 * 60 * 24 * 7
) {
  const payload: AdminSessionPayload = {
    email: email.trim().toLowerCase(),
    role,
    permissions,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(payloadB64);
  return `${payloadB64}.${signature}`;
}

function safeEquals(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export function parseAdminSessionToken(token: string | undefined | null) {
  if (!token) return null;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedSignature = signPayload(payloadB64);
  if (!safeEquals(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as AdminSessionPayload;

    if (payload.role !== "admin" && payload.role !== "tenant") return null;
    if (!payload.email) return null;
    if (!Array.isArray(payload.permissions)) return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return parseAdminSessionToken(token);
}

export function hasAdminSessionPermission(
  session: Awaited<ReturnType<typeof getAdminSessionFromCookies>>,
  moduleName: string,
  action: AdminSessionPermissionAction = "view"
) {
  if (!session) return false;
  if (session.role === "admin") return true;

  const permission = session.permissions.find((entry) => entry.module === moduleName);
  if (!permission) return false;

  if (action === "view") return Boolean(permission.can_view);
  if (action === "edit") return Boolean(permission.can_edit);
  return Boolean(permission.can_manage);
}

export function getAdminSessionDefaultRoute(
  session: Awaited<ReturnType<typeof getAdminSessionFromCookies>>
) {
  if (!session) return "/admin/login";
  if (session.role === "admin") return "/admin";

  if (hasAdminSessionPermission(session, "dog_adoption", "manage")) {
    return "/admin/dogs";
  }
  if (hasAdminSessionPermission(session, "healthcare", "manage")) {
    return "/admin/healthcare";
  }
  if (hasAdminSessionPermission(session, "blood_bank", "manage")) {
    return "/admin/blood-requests";
  }
  if (hasAdminSessionPermission(session, "dog_adoption", "view")) {
    return "/admin/adoption-requests";
  }
  if (hasAdminSessionPermission(session, "healthcare", "view")) {
    return "/admin/healthcare";
  }
  if (hasAdminSessionPermission(session, "blood_bank", "view")) {
    return "/admin/blood-requests";
  }

  return "/admin/login";
}

export function getAdminSessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
