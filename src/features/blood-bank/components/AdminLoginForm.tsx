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
      <h1 style={{ margin: 0, fontSize: "2.2rem", color: "#111827" }}>Main Site Admin Login</h1>
      <p style={{ marginTop: "0.7rem", fontSize: "1.25rem", color: "#4b5563" }}>
        Use the same admin credentials as the store panel.
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
  background: "#ffffff",
  borderRadius: "1.2rem",
  border: "1px solid #e5e7eb",
  boxShadow: "0 18px 45px rgba(17, 24, 39, 0.12)",
  padding: "2rem",
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
  border: "1px solid #d1d5db",
  borderRadius: "0.6rem",
  padding: "0.72rem 0.8rem",
  fontSize: "1.2rem",
};

const buttonStyle: CSSProperties = {
  marginTop: "0.5rem",
  border: "none",
  borderRadius: "0.6rem",
  padding: "0.8rem 1rem",
  background: "linear-gradient(135deg, #0f7a47, #0a8f48)",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

const errorStyle: CSSProperties = {
  margin: 0,
  color: "#b91c1c",
  fontSize: "1.2rem",
};
