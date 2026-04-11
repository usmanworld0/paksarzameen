"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, MailCheck, Shield } from "lucide-react";

type VerifyResponse = {
  ticket: string;
};

type Props = {
  callbackUrl: string;
};

export function EmailOtpLoginForm({ callbackUrl }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!cooldown) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  async function requestOtp() {
    setSending(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = (await response.json()) as {
        error?: string;
        retryAfterSeconds?: number;
      };

      if (!response.ok) {
        const retryAfter = data.retryAfterSeconds ?? 60;
        if (response.status === 429) {
          setCooldown(retryAfter);
        }

        setError(data.error ?? "Unable to send OTP right now.");
        return;
      }

      setStep("otp");
      setCooldown(60);
      setMessage("A verification code has been sent to your email.");
    } catch {
      setError("Network error while sending OTP.");
    } finally {
      setSending(false);
    }
  }

  async function verifyOtp() {
    setVerifying(true);
    setError(null);
    setMessage(null);

    try {
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, otp: otp.trim() }),
      });

      const verifyData = (await verifyResponse.json()) as VerifyResponse & { error?: string };
      if (!verifyResponse.ok) {
        setError(verifyData.error ?? "OTP verification failed.");
        return;
      }

      const signInResult = await signIn("email-otp", {
        email: normalizedEmail,
        ticket: verifyData.ticket,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        setError("Authentication failed. Please request a new code.");
        return;
      }

      router.push(callbackUrl || "/dashboard");
      router.refresh();
    } catch {
      setError("Network error while verifying OTP.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_22px_80px_rgba(6,50,30,0.12)] backdrop-blur-xl sm:p-8">
      <div className="mb-8 space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">Secure Access</p>
        <h2 className="text-3xl font-semibold tracking-tight text-emerald-950">Email OTP Sign In</h2>
        <p className="text-sm leading-6 text-emerald-900/70">Enter your email to receive a one-time code and continue to your dashboard.</p>
      </div>

      {step === "email" ? (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void requestOtp();
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-950">Email address</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            disabled={sending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
            {sending ? "Sending code..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void verifyOtp();
          }}
        >
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Code sent to <span className="font-semibold">{normalizedEmail}</span>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-950">6-digit OTP</span>
            <input
              type="text"
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-center text-xl tracking-[0.35em] text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              placeholder="000000"
            />
          </label>

          <button
            type="submit"
            disabled={verifying}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {verifying ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            {verifying ? "Verifying..." : "Verify and Sign In"}
          </button>

          <div className="flex items-center justify-between gap-3 text-sm">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError(null);
                setMessage(null);
              }}
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Change email
            </button>

            <button
              type="button"
              onClick={() => void requestOtp()}
              disabled={sending || cooldown > 0}
              className="font-medium text-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : sending ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {message ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
