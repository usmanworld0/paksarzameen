import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "psz-main-admin-session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;
const DEFAULT_ADMIN_SESSION_SECRET = "psz-main-admin-secret-2026";
const DEFAULT_ADMIN_EMAIL = "abdullahtanseer@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "CommonWe@lth!";

export function getMainAdminCredentials() {
  return {
    email: process.env.PSZ_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL,
    password: process.env.PSZ_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD,
  };
}

function getSessionSecret() {
  return process.env.PSZ_ADMIN_SESSION_SECRET ?? DEFAULT_ADMIN_SESSION_SECRET;
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromBase64Url(value: string) {
  const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(base64, "base64").toString("utf8");
}

function sign(data: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function isValidAdminCredentials(email: string, password: string) {
  const creds = getMainAdminCredentials();
  return (
    email.trim().toLowerCase() === creds.email.trim().toLowerCase() &&
    password === creds.password
  );
}

export function createAdminSessionToken(email: string) {
  const payload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  if (signature !== expectedSignature) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as {
      email?: string;
      exp?: number;
    };

    if (!parsed.email || !parsed.exp) return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      email: parsed.email,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}
