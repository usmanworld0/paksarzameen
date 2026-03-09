"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel – immersive branding */}
      <div className="admin-login-panel relative hidden w-[55%] items-center justify-center lg:flex overflow-hidden">
        <div className="admin-login-glow absolute inset-0" />

        {/* Decorative geometric lines */}
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
          {/* Logo mark */}
          <div className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.08] backdrop-blur-sm">
            <ShieldCheck className="h-9 w-9 text-brand-green" />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/65">
            Admin Portal
          </p>
          <h2 className="mt-4 text-4xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Commonwealth Lab
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/55">
            Premium artisan marketplace — connecting Pakistan&apos;s finest
            craftspeople with the world.
          </p>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["Products", "Categories", "Artisans", "Sales", "Analytics"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/45"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Brand footer */}
          <div className="mt-16 flex items-center justify-center gap-3 text-white/20">
            <div className="h-px w-12 bg-white/10" />
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase">
              PakSarZameen
            </span>
            <div className="h-px w-12 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Right panel – login form */}
      <div className="flex flex-1 items-center justify-center bg-[#faf9f6] px-6 sm:px-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile brand */}
          <div className="mb-10 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-green/8 ring-1 ring-brand-green/10">
              <ShieldCheck className="h-7 w-7 text-brand-green" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Commonwealth Lab
            </p>
          </div>

          <div>
            <h1 className="text-3xl font-light text-neutral-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Sign in to access your admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="h-12 rounded-lg border-neutral-200 bg-white px-4 text-[15px] text-neutral-900 placeholder:text-neutral-300 focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="h-12 rounded-lg border-neutral-200 bg-white px-4 pr-12 text-[15px] text-neutral-900 placeholder:text-neutral-300 focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="h-12 w-full rounded-lg text-[12px] font-semibold uppercase tracking-[0.2em]"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="mt-10 flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-neutral-200" />
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-300">
              Secure Access
            </p>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <p className="mt-4 text-center text-[11px] text-neutral-300">
            PakSarZameen &middot; Commonwealth Lab Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
