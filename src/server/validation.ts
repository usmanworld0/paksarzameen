export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function assertValidPassword(password: string) {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    throw new Error("Password must include uppercase, lowercase, and a number.");
  }
}

export function safeText(value: unknown, max = 120) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, max);
}
