import { NextResponse, type NextRequest } from "next/server";

import {
  getAdminFallbackEmails,
  hasSupabaseServiceRoleKey,
} from "@/lib/supabase/env";
import { getSupabaseAdminClient, getSupabaseAnonClient } from "@/lib/supabase/admin";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionDefaultRoute,
  getAdminSessionCookieOptions,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const email = String(body.get("email") ?? "").trim().toLowerCase();
    const password = String(body.get("password") ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const fallbackAdmins = getAdminFallbackEmails();
    const isFallbackAdminEmail = fallbackAdmins.includes(email);
    const fallbackPassword = process.env.ADMIN_FALLBACK_PASSWORD || "CommonWe@lth!";

    if (isFallbackAdminEmail && password === fallbackPassword) {
      const response = NextResponse.json(
        {
          success: true,
          mode: "fallback",
          role: "admin",
          redirectTo: "/admin",
        },
        { status: 200 }
      );
      response.cookies.set(
        ADMIN_SESSION_COOKIE_NAME,
        createAdminSessionToken(email, "admin", []),
        getAdminSessionCookieOptions()
      );
      return response;
    }

    const supabase = getSupabaseAnonClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message ?? "Login failed." }, { status: 401 });
    }

    let sessionRole: "admin" | "tenant" | null = null;
    let sessionPermissions: Array<{
      module: string;
      can_view: boolean;
      can_edit: boolean;
      can_manage: boolean;
    }> = [];

    // Use admin client to bypass RLS and check role + tenant permissions
    if (hasSupabaseServiceRoleKey()) {
      const supabaseAdmin = getSupabaseAdminClient();
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle<{ role?: string }>();

      const resolvedRole = String(profile?.role ?? data.user.user_metadata?.role ?? "user").toLowerCase();

      if (profileError) {
        await supabase.auth.signOut();
        return NextResponse.json(
          { error: "Unable to verify account role." },
          { status: 403 }
        );
      }

      if (isFallbackAdminEmail || resolvedRole === "admin") {
        sessionRole = "admin";
      } else if (resolvedRole === "tenant") {
        const { data: permissions, error: permissionsError } = await supabaseAdmin
          .from("tenant_permissions")
          .select("module, can_view, can_edit, can_manage")
          .eq("user_id", data.user.id)
          .returns<
            Array<{
              module: string;
              can_view: boolean;
              can_edit: boolean;
              can_manage: boolean;
            }>
          >();

        if (permissionsError) {
          await supabase.auth.signOut();
          return NextResponse.json(
            { error: "Unable to load tenant permissions." },
            { status: 403 }
          );
        }

        sessionPermissions = (permissions ?? []).filter(
          (permission) => permission.can_view || permission.can_edit || permission.can_manage
        );

        if (!sessionPermissions.length) {
          await supabase.auth.signOut();
          return NextResponse.json(
            { error: "This tenant account has no assigned module access." },
            { status: 403 }
          );
        }

        sessionRole = "tenant";
      }
    } else {
      const role = String(data.user.user_metadata?.role ?? "user").toLowerCase();
      if (isFallbackAdminEmail || role === "admin") {
        sessionRole = "admin";
      }
    }

    if (!sessionRole) {
      if (!data.session?.access_token || !data.session?.refresh_token) {
        return NextResponse.json(
          {
            error: "Unable to initialize user session.",
          },
          { status: 401 }
        );
      }

      const response = NextResponse.json(
        {
          success: true,
          role: "user",
          redirectTo: "/dashboard",
          session: {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
          },
        },
        { status: 200 }
      );

      // Ensure stale admin sessions do not leak into normal user access.
      response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", getAdminSessionCookieOptions(0));
      return response;
    }

    await supabase.auth.signOut();

    const sessionPreview = {
      email,
      role: sessionRole,
      permissions: sessionPermissions,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    };
    const redirectTo = getAdminSessionDefaultRoute(sessionPreview);

    const response = NextResponse.json(
      {
        success: true,
        role: sessionRole,
        redirectTo,
      },
      { status: 200 }
    );
    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      createAdminSessionToken(email, sessionRole, sessionPermissions),
      getAdminSessionCookieOptions()
    );

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to login.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

