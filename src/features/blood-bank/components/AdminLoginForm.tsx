"use client";

import { type CSSProperties, FormEvent, useState } from "react";

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
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Login failed.");
      }

      window.location.href = "/admin";
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to login.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <span style={eyebrowStyle}>Secure Access</span>
      <h1 style={{ margin: 0, fontSize: "2.4rem", color: "#111827", letterSpacing: "-0.03em" }}>
        Blood Bank Admin Login
      </h1>
      <p style={{ marginTop: "0.7rem", fontSize: "1.25rem", color: "#4b5563", lineHeight: 1.7 }}>
        Sign in to review requests, update statuses, and keep emergency response organized.
      </p>

      <label style={labelStyle}>
        Email
        <input
          required
          type="email"
          value={credentials.email}
          onChange={(event) =>
            setCredentials((prev) => ({ ...prev, email: event.target.value }))
          }
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Password
        <input
          required
          type="password"
          value={credentials.password}
          onChange={(event) =>
            setCredentials((prev) => ({ ...prev, password: event.target.value }))
          }
          style={inputStyle}
        />
      </label>

      <button type="submit" disabled={isSubmitting} style={buttonStyle}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      {error ? <p style={errorStyle}>{error}</p> : null}
    </form>
  );
}

const formStyle: CSSProperties = {
  width: "min(460px, 94vw)",
  margin: "14rem auto 6rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,248,0.98) 100%)",
  borderRadius: "1.8rem",
  border: "1px solid rgba(15, 122, 71, 0.12)",
  boxShadow: "0 24px 60px rgba(17, 24, 39, 0.12)",
  padding: "2.2rem",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "0.45rem 0.8rem",
  borderRadius: "999px",
  background: "rgba(15, 122, 71, 0.08)",
  color: "#0f7a47",
  fontSize: "1.05rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  color: "#111827",
  fontSize: "1.2rem",
  fontWeight: 600,
};

const inputStyle: CSSProperties = {
  border: "1px solid #d6e0d9",
  borderRadius: "0.85rem",
  padding: "0.85rem 0.95rem",
  fontSize: "1.2rem",
  background: "rgba(255,255,255,0.95)",
};

const buttonStyle: CSSProperties = {
  marginTop: "0.5rem",
  border: "none",
  borderRadius: "0.95rem",
  padding: "0.95rem 1rem",
  background: "linear-gradient(135deg, #0f7a47, #0a8f48)",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 14px 34px rgba(15, 122, 71, 0.22)",
};

const errorStyle: CSSProperties = {
  margin: 0,
  color: "#b91c1c",
  fontSize: "1.2rem",
};
