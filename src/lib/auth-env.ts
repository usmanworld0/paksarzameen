const PROD_URL = "https://paksarzameenwfo.com";
const DEFAULT_AUTH_SECRET = "psz-main-web-auth-secret-2026-gallery-upload";

export function getAuthSecret() {
  return (
    process.env.NEXTAUTH_SECRET ??
    process.env.AUTH_SECRET ??
    DEFAULT_AUTH_SECRET
  );
}

export function getAuthUrl() {
  return (
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production" ? PROD_URL : "http://localhost:3000")
  );
}

export function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID || "";
}

export function getGoogleClientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET || "";
}

export function hasGoogleConfig() {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
