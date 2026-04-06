# Store Gallery Auth and Upload Flow

## Overview
Implemented a store-local Google authentication flow for the customer art gallery so users can sign in, upload artwork, and browse approved submissions without leaving the store app shell.

## What Changed
- Added a store-local NextAuth route with Google provider support and retained the existing admin credentials provider.
- Added local `/login` and `/upload-art` pages in the store app.
- Added store-local gallery APIs for approved listing, user uploads, and authenticated upload posting.
- Added store Prisma models for auth and gallery parity with the main app.
- Updated the customer gallery CTA to route internally to `/upload-art`.

## Key Files
- `store/src/lib/auth.ts`
- `store/src/lib/auth-env.ts`
- `store/src/lib/gallery.ts`
- `store/src/app/api/auth/[...nextauth]/route.ts`
- `store/src/app/api/gallery/route.ts`
- `store/src/app/api/gallery/upload/route.ts`
- `store/src/app/api/gallery/user/route.ts`
- `store/src/app/login/page.tsx`
- `store/src/app/upload-art/page.tsx`
- `store/src/app/customers-art-gallery/page.tsx`

## Data Models Added
- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Image`

These models map to the same table names used by the main app so gallery auth and upload data stay consistent.

## Validation
- Store production build passed successfully after the auth and gallery flow was added.