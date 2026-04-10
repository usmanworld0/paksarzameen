const PROD_STORE_URL = "https://store.paksarzameenwfo.com";
const DEFAULT_AUTH_SECRET = "psz-store-auth-secret-2026-commonwealth-admin";
const DEFAULT_ADMIN_EMAIL = "abdullahtanseer@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "CommonWe@lth!";

function getOptionalEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

export function getAuthSecret() {
  return process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? DEFAULT_AUTH_SECRET;
}

export function getAuthUrl() {
  return (
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production" ? PROD_STORE_URL : "http://localhost:3001")
  );
}

export function getHardcodedAdminCredentials() {
  return {
    email: DEFAULT_ADMIN_EMAIL,
    password: DEFAULT_ADMIN_PASSWORD,
  };
}

export function getGoogleAuthClientId() {
  return getOptionalEnv("GOOGLE_CLIENT_ID");
}

export function getGoogleAuthClientSecret() {
  return getOptionalEnv("GOOGLE_CLIENT_SECRET");
}

export function hasGoogleAuthConfig() {
  return Boolean(getGoogleAuthClientId() && getGoogleAuthClientSecret());
}