# PSZ Main Web: Blood Bank Authentication + User Management Implementation

## Overview
Implemented a production-oriented authentication and user management system for Paksarzameen Blood Bank using NextAuth credentials (email/password), Prisma + PostgreSQL (Neon), and Tailwind-based pages/components.

## Implemented Scope
- Email/password signup and login flow
- JWT-based authenticated sessions
- Bcrypt password hashing and verification
- Password reset token flow with hashed token storage and email delivery
- Protected profile CRUD API and dashboard UI
- Optional profile image upload via Cloudinary
- Emergency donor matching API using rule-based scoring

## Data Model Changes
- Extended users table/model with:
  - password_hash
  - role (donor | admin | hospital)
- Added user_profile table/model:
  - user_id, cnic, phone, city, blood_group, availability_status, last_donation_date, emergency_contact, profile_image
- Added password_reset_tokens table/model:
  - id, user_id, token_hash, expires_at, used

## API Endpoints Added
- POST /api/auth/signup
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- GET /api/profile
- PUT /api/profile
- DELETE /api/profile
- POST /api/profile/upload-image
- POST /api/blood-bank/emergency-match

## Auth Flow
- Credentials provider id: email-password
- Signup creates user + empty profile (availability defaults to unavailable)
- Login validates bcrypt password hash and issues JWT session
- Session includes user id and role
- The public `/login` page now signs users in through the same NextAuth credentials provider used by signup, instead of using Supabase password auth.

## Password Reset Flow
1. User submits email, CNIC, and a new password on the forgot-password page
2. Server verifies the email against the account and confirms CNIC from `user_profile.cnic`
3. Server updates the password hash directly and invalidates any previously issued reset tokens for that user
4. The legacy `/reset-password` token route remains available for backward compatibility, but the primary recovery UX is now a single direct reset screen

## CNIC Storage Update
- CNIC is persisted on `user_profile.cnic` during signup, not on `users.cnic`, so Prisma auth queries no longer depend on a missing column in the live database.
- The profile API now exposes CNIC from `user_profile` for downstream healthcare and recovery flows.

## Donor Matching Logic
For emergency requests, each donor is scored with:
- +50 if blood-group compatible
- +30 if donor city matches requested city
- +20 if availability is available
- -40 if donor is not eligible (last donation within 90 days)

Output is ranked and limited to top 5 donors.

## Security Notes
- Passwords hashed using bcrypt (bcryptjs)
- Reset tokens stored hashed (not raw)
- Profile APIs require authenticated session
- Sensitive values are environment-driven
- The shared `/login` page now checks for Supabase public config before creating a server client, so missing auth env renders the sign-in UI instead of crashing the page.
- The shared `/login` and `/dashboard` pages now use `getServerSession(authOptions)` so the login redirect and dashboard guard match the credentials session created by the user auth flow.

## Routes/Pages Added
- /signup
- /login (refactored to email/password)
- /forgot-password
- /reset-password
- /dashboard (profile management)

## Key Files
- src/lib/auth.ts
- src/server/auth-service.ts
- src/db/users.ts
- src/server/profile-service.ts
- src/server/donor-matching.ts
- src/app/api/auth/*
- src/app/api/profile/*
- src/app/api/blood-bank/emergency-match/route.ts
- src/features/auth/components/*
- src/features/blood-bank/components/EmergencyBloodRequest.tsx
