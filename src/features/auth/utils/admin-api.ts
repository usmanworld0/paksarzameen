"use client";

import { createClient } from "@/utils/supabase/client";

export async function getAdminAuthHeaders() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {} as Record<string, string>;
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function adminFetch(input: string, init?: RequestInit) {
  const authHeaders = await getAdminAuthHeaders();
  const headers = new Headers(init?.headers ?? undefined);

  for (const [name, value] of Object.entries(authHeaders)) {
    if (!headers.has(name)) {
      headers.set(name, value);
    }
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });
}
