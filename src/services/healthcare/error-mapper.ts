export type HealthcareApiError = {
  code: string;
  message: string;
  status: number;
};

const DEFAULT_ERROR: HealthcareApiError = {
  code: "HEALTHCARE_INTERNAL_ERROR",
  message: "An internal healthcare service error occurred.",
  status: 500,
};

export function mapHealthcareError(error: unknown, fallbackMessage: string): HealthcareApiError {
  const raw = error instanceof Error ? error.message : fallbackMessage;
  const normalized = raw.replace(/^SUSPENDED:/, "");
  const lower = normalized.toLowerCase();

  if (raw.startsWith("SUSPENDED:")) {
    return { code: "HEALTHCARE_USER_SUSPENDED", message: normalized, status: 403 };
  }

  if (lower.includes("unauthorized")) {
    return { code: "HEALTHCARE_UNAUTHORIZED", message: normalized, status: 401 };
  }

  if (lower.includes("forbidden")) {
    return { code: "HEALTHCARE_FORBIDDEN", message: normalized, status: 403 };
  }

  if (lower.includes("not found")) {
    return { code: "HEALTHCARE_NOT_FOUND", message: normalized, status: 404 };
  }

  if (
    lower.includes("could not find the table") ||
    lower.includes("relation") && lower.includes("does not exist") ||
    lower.includes("schema cache")
  ) {
    return {
      code: "HEALTHCARE_SCHEMA_NOT_INITIALIZED",
      message:
        "Healthcare schema is not initialized in Supabase. Run docs/database/healthcare_schema_init.sql in the Supabase SQL Editor and retry.",
      status: 503,
    };
  }

  if (
    lower.includes("invalid") ||
    lower.includes("required") ||
    lower.includes("conflict") ||
    lower.includes("cannot") ||
    lower.includes("already")
  ) {
    return { code: "HEALTHCARE_VALIDATION_ERROR", message: normalized, status: 400 };
  }

  if (lower.includes("rate limit") || lower.includes("too many")) {
    return { code: "HEALTHCARE_RATE_LIMITED", message: normalized, status: 429 };
  }

  if (!normalized) {
    return { ...DEFAULT_ERROR, message: fallbackMessage };
  }

  return {
    ...DEFAULT_ERROR,
    message: normalized,
  };
}
