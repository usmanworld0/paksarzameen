"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublishableKey, getSupabaseUrl } from "../../lib/supabase/env";

let browserClient: SupabaseClient | null = null;

export function createClient() {
  const supabaseUrl = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();

  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      "Supabase public environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, publishableKey);
  }

  return browserClient;
}
