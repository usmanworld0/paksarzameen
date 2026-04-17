"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

type LoginState = {
  email: string;
  password: string;
};

export function AdminLoginForm() {
  const [credentials, setCredentials] = useState<LoginState>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

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
        error?: string;
        redirectTo?: string;
      };

      if (!loginResponse.ok) {
        throw new Error(loginPayload.error ?? "Unable to login.");
      }

      window.location.assign(loginPayload.redirectTo || "/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to login.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="admin-login-panel relative hidden w-[55%] items-center justify-center overflow-hidden lg:flex">
        <div className="admin-login-glow absolute inset-0" />

        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" viewBox="0 0 800 900" fill="none">
            <line x1="200" y1="0" x2="200" y2="900" stroke="white" strokeWidth="1" />
            <line x1="400" y1="0" x2="400" y2="900" stroke="white" strokeWidth="1" />
            <line x1="600" y1="0" x2="600" y2="900" stroke="white" strokeWidth="1" />
            <line x1="0" y1="300" x2="800" y2="300" stroke="white" strokeWidth="1" />
            <line x1="0" y1="600" x2="800" y2="600" stroke="white" strokeWidth="1" />
            <circle cx="400" cy="450" r="180" stroke="white" strokeWidth="1" />
            <circle cx="400" cy="450" r="280" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-lg px-16 text-center">
          <div className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.08] backdrop-blur-sm">
            <ShieldCheck className="h-9 w-9 text-emerald-400" />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/65">Admin Portal</p>
          <h2 className="mt-4 text-4xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            PakSarZameen Main Web
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/55">
            Unified operations console for blood donation, dog adoption, and tenant access control.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["Tenants", "Blood Bank", "Dog Adoption", "Permissions"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/45"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-center gap-3 text-white/20">
            <div className="h-px w-12 bg-white/10" />
            <span className="text-[10px] font-medium uppercase tracking-[0.25em]">PakSarZameen</span>
            <div className="h-px w-12 bg-white/10" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#faf9f6] px-6 sm:px-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <ShieldCheck className="h-7 w-7 text-emerald-700" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">PakSarZameen</p>
          </div>

          <div>
            <h1 className="text-3xl font-light text-neutral-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-neutral-400">Sign in to access your admin control center</p>
            <p className="mt-3 text-xs text-neutral-400">Default access: abdullahtanseer@gmail.com / CommonWe@lth!</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-[15px] text-neutral-900 placeholder:text-neutral-300 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 pr-12 text-[15px] text-neutral-900 placeholder:text-neutral-300 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-400 transition-colors hover:text-neutral-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="flex items-center gap-2.5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-emerald-700 px-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Signing In" : "Sign In"}
            </button>
          </form>

          <div className="mt-10 flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-neutral-200" />
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-300">Secure Access</p>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <p className="mt-4 text-center text-[11px] text-neutral-300">PakSarZameen · Main Web Admin Panel</p>
        </div>
      </div>
    </div>
  );
}
