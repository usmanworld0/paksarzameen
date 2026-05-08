# Store Gallery Auth and Upload Flow

## Overview
Implemented a store-local manual signup flow for the customer art gallery so users can sign up with full name + email, upload artwork, and browse approved submissions without leaving the store app shell.

## What Changed
- Replaced Google gallery signup CTAs with a manual signup form collecting full name and email.
- Added backend tables for manual gallery signup/session management (`gallery_manual_signups`, `gallery_manual_sessions`) and switched manual auth to secure token sessions.
- Added local `/login` and `/upload-art` pages in the store app for the manual flow.
- Added store-local gallery APIs for approved listing, user uploads, and authenticated upload posting.
- Added admin approval backend APIs and admin panel route so admins can approve/unapprove uploaded artwork.
- Updated the customer gallery CTA to route internally to `/upload-art`.

## Key Files
- `store/src/lib/auth.ts`
- `store/src/lib/auth-env.ts`
- `store/src/lib/gallery.ts`
- `store/src/lib/manual-gallery-auth.ts`
- `store/src/app/api/auth/[...nextauth]/route.ts`
- `store/src/app/api/gallery/route.ts`
- `store/src/app/api/gallery/upload/route.ts`
- `store/src/app/api/gallery/user/route.ts`
- `store/src/app/api/gallery/user/manual-signup/route.ts`
- `store/src/app/api/gallery/user/manual-signout/route.ts`
- `store/src/app/api/gallery/admin/submissions/route.ts`
- `store/src/app/api/gallery/admin/submissions/[id]/route.ts`
- `store/src/app/login/page.tsx`
- `store/src/app/upload-art/page.tsx`
- `store/src/app/admin/gallery/page.tsx`
- `store/src/components/admin/GalleryApprovalsTable.tsx`
- `store/src/app/customers-art-gallery/page.tsx`

## Data Models Added
- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Image`
- `GalleryManualSignup`
- `GalleryManualSession`

These models map to the same table names used by the main app so gallery auth and upload data stay consistent.

## Validation
- Store production build passed successfully after the auth and gallery flow was added.