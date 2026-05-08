"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type LoginState = {
  email: string;
  password: string;
};

export function AdminLoginForm() {
  const [supabaseError] = useState(() => {
    try {
      createClient();
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Supabase is not configured.";
    }
  });
  const supabase = supabaseError ? null : createClient();
  const [credentials, setCredentials] = useState<LoginState>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setHint(null);
    setRedirectTo(null);

    try {
      const formData = new FormData();
      formData.set("email", credentials.email.trim().toLowerCase());
      formData.set("password", credentials.password);

      const loginResponse = await fetch("/api/admin/login", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const loginPayload = (await loginResponse.json()) as {
        success?: boolean;
        role?: "admin" | "tenant" | "user";
        error?: string;
        code?: string;
        hint?: string;
        redirectTo?: string;
        session?: {
          accessToken?: string;
          refreshToken?: string;
        };
      };

      if (!loginResponse.ok) {
        setHint(loginPayload.hint ?? null);
        if (loginPayload.code === "USER_ACCOUNT_REDIRECT" && loginPayload.redirectTo) {
          setRedirectTo(loginPayload.redirectTo);
        }
        throw new Error(loginPayload.error ?? "Unable to login.");
      }

      if (loginPayload.role === "user") {
        if (!supabase) {
          throw new Error(supabaseError ?? "Supabase is not configured.");
        }

        const accessToken = loginPayload.session?.accessToken;
        const refreshToken = loginPayload.session?.refreshToken;
        if (!accessToken || !refreshToken) {
          throw new Error("Unable to start user session. Please try again.");
        }

        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (setSessionError) {
          throw new Error(setSessionError.message || "Unable to start user session.");
        }
      }

      window.location.assign(loginPayload.redirectTo || "/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to login.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f3ee] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white">
            <ShieldCheck className="h-7 w-7 text-[#0f7a47]" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Admin Portal</p>
          <h1 className="mt-2 text-2xl font-black tracking-tighter text-[#111111]">PakSarZameen</h1>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7 shadow-[0_8px_32px_rgba(0,0,0,0.07)] sm:p-9">
          <div className="space-y-1 mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Secure Access</p>
            <h2 className="text-2xl font-black tracking-tighter text-[#111111]">Welcome back</h2>
            <p className="text-sm font-medium text-[#707072]">
              Centralized access login for admin, tenant, and user dashboards
            </p>
            <p className="text-xs font-medium text-[#707072]">
              Default access: abdullahtanseer@gmail.com / CommonWe@lth!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5">
                Email Address
              </span>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5">
                Password
              </span>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 pr-12 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#707072] transition hover:text-[#111111]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            {hint ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
                <p>{hint}</p>
                {redirectTo ? (
                  <button
                    type="button"
                    onClick={() => window.location.assign(redirectTo)}
                    className="mt-2 rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-200"
                  >
                    Go to User Login
                  </button>
                ) : null}
              </div>
            ) : null}

            {supabaseError ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
                <p>{supabaseError}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#111111] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E5E5E5]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#707072]">Secure Access</p>
            <div className="h-px flex-1 bg-[#E5E5E5]" />
          </div>

          <p className="mt-4 text-center text-[11px] font-medium text-[#707072]">
            PakSarZameen · Main Web Admin Panel
          </p>
        </div>
      </div>
    </main>
  );
}
