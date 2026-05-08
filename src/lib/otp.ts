import crypto from "crypto";

import { prisma } from "@/lib/prisma";

const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;
const OTP_RATE_LIMIT_WINDOW_MS = 60_000;
const OTP_RATE_LIMIT_MAX_REQUESTS = 3;
const LOGIN_TICKET_EXPIRY_MS = 2 * 60_000;
const LOGIN_TICKET_PREFIX = "otp-login:";

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  attemptsLeft: number;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getOtpHashSecret() {
  return process.env.OTP_HASH_SECRET ?? process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "psz-otp-secret-fallback";
}

function hashValue(raw: string, email: string) {
  return crypto
    .createHash("sha256")
    .update(`${raw}:${normalizeEmail(email)}:${getOtpHashSecret()}`)
    .digest("hex");
}

export function generateOtp() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(crypto.randomInt(min, max + 1));
}

export async function purgeExpiredOtps() {
  await prisma.$executeRaw`
    DELETE FROM otp_codes
    WHERE expires_at < NOW()
  `;
}

async function purgeExpiredLoginTickets() {
  await prisma.verificationToken.deleteMany({
    where: {
      identifier: {
        startsWith: LOGIN_TICKET_PREFIX,
      },
      expires: {
        lt: new Date(),
      },
    },
  });
}

async function getRateLimitInfo(email: string): Promise<RateLimitResult> {
  const normalized = normalizeEmail(email);
  const recentCodes = await prisma.$queryRaw<Array<{ created_at: Date }>>`
    SELECT created_at
    FROM otp_codes
    WHERE email = ${normalized}
      AND created_at >= NOW() - INTERVAL '1 minute'
    ORDER BY created_at DESC
  `;

  if (recentCodes.length < OTP_RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: true,
      retryAfterSeconds: 0,
      attemptsLeft: OTP_RATE_LIMIT_MAX_REQUESTS - recentCodes.length,
    };
  }

  const oldestInWindow = recentCodes[recentCodes.length - 1]?.created_at;
  const retryAt = oldestInWindow ? oldestInWindow.getTime() + OTP_RATE_LIMIT_WINDOW_MS : Date.now() + OTP_RATE_LIMIT_WINDOW_MS;
  const retryAfterMs = Math.max(0, retryAt - Date.now());

  return {
    allowed: false,
    retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    attemptsLeft: 0,
  };
}

export async function createOtpCode(email: string) {
  const normalized = normalizeEmail(email);

  await purgeExpiredOtps();

  const rateLimit = await getRateLimitInfo(normalized);
  if (!rateLimit.allowed) {
    return {
      ok: false as const,
      reason: "rate_limited" as const,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    };
  }

  const otp = generateOtp();
  const hashedOtp = hashValue(otp, normalized);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000);
  const id = crypto.randomUUID();

  await prisma.$executeRaw`
    INSERT INTO otp_codes (id, email, otp, expires_at, created_at)
    VALUES (${id}::uuid, ${normalized}, ${hashedOtp}, ${expiresAt}, NOW())
  `;

  return {
    ok: true as const,
    otp,
    expiresAt,
    attemptsLeft: rateLimit.attemptsLeft,
  };
}

export async function verifyAndConsumeOtp(email: string, otp: string) {
  const normalized = normalizeEmail(email);
  await purgeExpiredOtps();

  const latestMatches = await prisma.$queryRaw<Array<{ id: string; otp: string; expires_at: Date }>>`
    SELECT id, otp, expires_at
    FROM otp_codes
    WHERE email = ${normalized}
      AND expires_at >= NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const latestOtp = latestMatches[0];

  if (!latestOtp) {
    return { ok: false as const, reason: "expired_or_missing" as const };
  }

  const incomingHash = hashValue(otp, normalized);
  const matches = crypto.timingSafeEqual(Buffer.from(incomingHash), Buffer.from(latestOtp.otp));

  if (!matches) {
    return { ok: false as const, reason: "invalid" as const };
  }

  await prisma.$executeRaw`
    DELETE FROM otp_codes
    WHERE email = ${normalized}
  `;

  return { ok: true as const };
}

export async function createLoginTicket(email: string) {
  const normalized = normalizeEmail(email);
  await purgeExpiredLoginTickets();
  const ticket = crypto.randomBytes(24).toString("hex");
  const token = hashValue(ticket, normalized);
  const expires = new Date(Date.now() + LOGIN_TICKET_EXPIRY_MS);

  await prisma.verificationToken.create({
    data: {
      identifier: `${LOGIN_TICKET_PREFIX}${normalized}`,
      token,
      expires,
    },
  });

  return {
    ticket,
    expires,
  };
}

export async function consumeLoginTicket(email: string, ticket: string) {
  const normalized = normalizeEmail(email);
  await purgeExpiredLoginTickets();
  const identifier = `${LOGIN_TICKET_PREFIX}${normalized}`;
  const token = hashValue(ticket, normalized);

  const record = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier,
        token,
      },
    },
  });

  if (!record) {
    return false;
  }

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier,
        token,
      },
    },
  });

  return record.expires >= new Date();
}

export function getOtpExpiryMinutes() {
  return OTP_EXPIRY_MINUTES;
}
