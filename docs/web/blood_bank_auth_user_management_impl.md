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
  - user_id, phone, city, blood_group, availability_status, last_donation_date, emergency_contact, profile_image
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

## Password Reset Flow
1. User submits email on forgot-password page
2. Server creates random reset token, stores SHA-256 hash with 30-minute expiry
3. Reset link is emailed via Nodemailer
4. Reset endpoint validates hashed token, updates password hash, marks token as used

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
