# Email OTP Authentication Implementation

## Overview
Implemented passwordless email OTP authentication for the main Next.js app using App Router + NextAuth credentials provider + PostgreSQL persistence, with secure OTP hashing, short expiry, one-time consumption, and abuse controls.

## Implemented Scope
- Email OTP request endpoint: `POST /api/auth/send-otp`
- OTP verification endpoint: `POST /api/auth/verify-otp`
- NextAuth credentials provider (`email-otp`) with JWT session strategy
- Secure OTP storage and verification helpers in `src/lib/otp.ts`
- SMTP mail sender integration via Nodemailer in `src/lib/mailer.ts`
- New two-step OTP login UI in `src/features/auth/components/EmailOtpLoginForm.tsx`
- Login page rebuilt around OTP flow (`/login`)
- Protected dashboard route at `/dashboard`

## Security Controls
- OTP code is never stored in plaintext.
- Stored OTP uses SHA-256 hash with email-scoped secret salt.
- OTP expiry is enforced at 5 minutes.
- OTP is single-use: all active codes for the email are deleted after successful verification.
- Per-email rate limiting on OTP requests: maximum 3 requests/minute.
- Rate-limit responses include `Retry-After` header and retry seconds.
- Expired OTP records are cleaned before issue/verify operations.
- Verification ticket is short-lived and consumed once during sign-in.
- Expired OTP login tickets are cleaned periodically.

## Database Changes
- Added Prisma model: `OtpCode` mapped to `otp_codes`.
- Added SQL tracker entry for `otp_codes` table and indexes in `docs/database/supabase_schema_tracker.md`.

## Session/Auth Flow
1. User enters email on `/login`.
2. Frontend calls `/api/auth/send-otp`.
3. Backend generates OTP, stores hashed value, emails OTP.
4. User submits OTP to `/api/auth/verify-otp`.
5. Backend verifies and consumes OTP, upserts user, returns short-lived sign-in ticket.
6. Frontend calls `signIn("email-otp")` with email + ticket.
7. NextAuth validates ticket and issues JWT session.
8. User is redirected to callback URL or `/dashboard`.

## Environment Variables
Required:
- `DATABASE_URL`
- `NEXTAUTH_SECRET` (or `AUTH_SECRET`)
- `SMTP_USER`
- `SMTP_PASS`

Optional:
- `SMTP_HOST` (default: `smtp.gmail.com`)
- `SMTP_PORT` (default: `587`)
- `SMTP_FROM` (default: SMTP user)
- `OTP_HASH_SECRET` (falls back to auth secret)

## Notes
- `nodemailer` dependency added to root `package.json`.
- Prisma client regeneration failed locally due Windows DLL lock (`EPERM`), so OTP DB access in `src/lib/otp.ts` uses raw SQL via Prisma client methods to avoid generated-model type coupling until regeneration succeeds.

## Setup Steps (Local)
1. Populate environment variables in `.env.local` using `.env.example` as template.
2. Ensure `DATABASE_URL`, `NEXTAUTH_SECRET`, `SMTP_USER`, and `SMTP_PASS` are set.
3. Run `npm install` (if dependencies are not already installed).
4. Sync database schema with `npm run db:push`.
5. Start app using `npm run dev`.
6. Open `/login`, request OTP, and verify sign-in flow.

## Deployment Setup (Vercel)
1. Add the same required env vars in Project Settings -> Environment Variables.
2. Include optional vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM`, `OTP_HASH_SECRET`) as needed.
3. Redeploy after env updates so server routes use new values.
