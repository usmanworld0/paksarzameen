# Customer Art Gallery Auth Implementation

## Overview
Google sign-in is wired into the main Next.js app with NextAuth.js and a Prisma adapter. Authenticated users can access the protected upload page, submit artwork to Cloudinary, and have the image metadata stored in PostgreSQL with `approved = false` until moderation.

## Requirements
- Google OAuth via `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- NextAuth session secret and public callback URL via `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.
- Prisma-backed persistence for users, sessions, accounts, verification tokens, and gallery images.
- Protected `/upload-art` route.
- Public approved-image gallery API and user-specific upload API.

## Data Models
- `users`: NextAuth users.
- `accounts`: OAuth provider account linkage.
- `sessions`: persistent NextAuth sessions.
- `verification_tokens`: NextAuth token support.
- `images`: customer gallery uploads with Cloudinary metadata and moderation state.

## Implementation Notes
- `src/lib/auth.ts` centralizes NextAuth configuration and Prisma adapter wiring.
- `src/components/providers.tsx` exposes the session provider to client components.
- `src/features/auth/components/LoginWithGoogleButton.tsx` and `LogoutButton.tsx` keep auth actions modular.
- `src/features/auth/components/GalleryUploadForm.tsx` submits multiple image files to `/api/gallery/upload`.
- `src/app/api/gallery/upload/route.ts` requires an authenticated session, uploads each file to Cloudinary, and stores the resulting record with `approved = false`.
- `src/app/api/gallery/route.ts` returns only approved images.
- `src/app/api/gallery/user/route.ts` returns the current user’s uploads after session validation.

## Edge Cases
- Missing auth or Cloudinary env values fail fast at runtime.
- Cloudinary env validation is intentionally lazy (request-time) in `src/lib/cloudinary.ts` to avoid build-time crashes when Next.js collects route data for `/api/gallery/upload` during deployment.
- Non-image files are rejected before upload.
- If database persistence fails after a Cloudinary upload, the uploaded assets are cleaned up.
- Unauthenticated requests to protected routes return `401` or redirect to `/login`.

## Deployment Note (April 2026)
- Production build failure `CLOUDINARY_CLOUD_NAME is required for Cloudinary uploads` was resolved by moving Cloudinary configuration from module top-level execution to an `ensureCloudinaryConfigured()` guard invoked inside upload/delete functions.
- This preserves strict runtime validation while keeping `next build` stable in environments where secret values are injected only at runtime.
