import crypto from "crypto";

import {
  createPasswordResetTokenRecord,
  createUserWithProfile,
  findUserByEmail,
  findUserByEmailWithProfile,
  findValidResetToken,
  markUserResetTokensUsed,
  consumeResetToken,
  updateUserPassword,
  type UserRole,
} from "@/db/users";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  safeText,
  assertValidPassword,
  isValidEmail,
  normalizeEmail,
  isValidCnic,
  normalizeCnic,
} from "@/server/validation";

export async function signupWithEmailPassword(input: {
  name: string;
  email: string;
  cnic: string;
  password: string;
  role?: UserRole;
}) {
  const email = normalizeEmail(input.email);
  const name = safeText(input.name, 80);
  const cnic = normalizeCnic(input.cnic);
  const role = input.role ?? "donor";

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Please provide a valid email address.");
  }

  if (!isValidCnic(cnic)) {
    throw new Error("Please provide a valid CNIC format (e.g., 12345-1234567-1).");
  }

  assertValidPassword(input.password);

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUserWithProfile({
    name,
    email,
    cnic,
    passwordHash,
    role,
  });

  return user;
}

export async function validateUserCredentials(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);

  if (!isValidEmail(email)) {
    return null;
  }

  const user = await findUserByEmail(email);
  if (!user?.passwordHash) {
    return null;
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    return null;
  }

  return user;
}

export async function generatePasswordResetToken(input: { email: string; cnic: string }) {
  const email = normalizeEmail(input.email);
  const cnic = normalizeCnic(input.cnic);

  if (!isValidCnic(cnic)) {
    throw new Error("Please provide a valid CNIC format (e.g., 12345-1234567-1).");
  }

  const user = await findUserByEmail(email);

  if (!user || !user.email) {
    return null;
  }

  await markUserResetTokensUsed(user.id);

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(`${token}:${cnic}`).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await createPasswordResetTokenRecord({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  return {
    token,
    expiresAt,
    user,
  };
}

export async function resetPasswordWithEmailCnic(input: { email: string; cnic: string; password: string }) {
  const email = normalizeEmail(input.email);
  const cnic = normalizeCnic(input.cnic);

  if (!isValidEmail(email)) {
    throw new Error("Please provide a valid email address.");
  }

  if (!isValidCnic(cnic)) {
    throw new Error("Please provide a valid CNIC format (e.g., 12345-1234567-1).");
  }

  assertValidPassword(input.password);

  const user = await findUserByEmailWithProfile(email);

  if (!user?.profile?.cnic || normalizeCnic(user.profile.cnic) !== cnic) {
    throw new Error("The provided email and CNIC do not match our records.");
  }

  await markUserResetTokensUsed(user.id);

  const passwordHash = await hashPassword(input.password);
  await updateUserPassword(user.id, passwordHash);

  return true;
}

export async function resetPasswordWithToken(input: { token: string; cnic: string; password: string }) {
  assertValidPassword(input.password);

  const cnic = normalizeCnic(input.cnic);
  if (!isValidCnic(cnic)) {
    throw new Error("Please provide a valid CNIC format (e.g., 12345-1234567-1).");
  }

  const tokenHash = crypto.createHash("sha256").update(`${input.token}:${cnic}`).digest("hex");
  const resetRecord = await findValidResetToken(tokenHash);

  if (!resetRecord) {
    throw new Error("Invalid or expired reset token.");
  }

  const passwordHash = await hashPassword(input.password);
  await updateUserPassword(resetRecord.userId, passwordHash);
  await consumeResetToken(resetRecord.id);

  return true;
}
