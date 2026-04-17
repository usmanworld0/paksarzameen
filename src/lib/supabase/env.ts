function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    return "";
  }
  return value;
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

export function getSupabasePublishableKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

export function hasSupabaseServiceRoleKey() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getAdminFallbackEmails() {
  const configured = process.env.ADMIN_FALLBACK_EMAILS;
  const defaults = ["abdullahtanseer@gmail.com", "admin@gmail.com"];

  const values = configured
    ? configured
        .split(",")
        .map((entry) => entry.trim().toLowerCase())
        .filter(Boolean)
    : defaults;

  return Array.from(new Set(values));
}
