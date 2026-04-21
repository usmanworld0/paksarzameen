import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  getSupabasePublishableKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

let cachedAdminClient: SupabaseClient | null = null;
let cachedAnonClient: SupabaseClient | null = null;

export function getSupabaseAdminClient() {
  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required for server admin operations.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for server admin operations.");
  }

  cachedAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedAdminClient;
}

export function getSupabaseAnonClient() {
  if (cachedAnonClient) {
    return cachedAnonClient;
  }

  const supabaseUrl = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required for Supabase operations.");
  }

  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required for Supabase operations.");
  }

  cachedAnonClient = createClient(supabaseUrl, publishableKey);
  return cachedAnonClient;
}

export function getSupabaseReadClient() {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) is required for Supabase read operations.");
  }

  // This helper is used by server-only services/routes.
  // Prefer service-role reads when available so a stale publishable key cannot break server data loading.
  const serviceRoleKey = getSupabaseServiceRoleKey();
  if (serviceRoleKey) {
    return getSupabaseAdminClient();
  }

  const publishableKey = getSupabasePublishableKey();
  if (publishableKey) {
    return getSupabaseAnonClient();
  }

  throw new Error(
    "Supabase read client is not configured. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or ANON alias), or provide SUPABASE_SERVICE_ROLE_KEY for server-side reads."
  );
}
