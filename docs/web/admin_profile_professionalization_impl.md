# Admin Panel and Profile Professionalization (Main Site)

## Overview
This implementation upgrades the main-site admin control center and authenticated user profile dashboard into a richer, operations-focused experience.

## What Was Added
- Professional admin analytics dashboard on the main control center:
  - KPI cards for users, queue load, and dog inventory.
  - 7-day trend chart for blood requests, adoption requests, and user growth.
  - Status-distribution visual bars for blood and adoption workflows.
- Sortable and filterable operations workspace:
  - Unified live queue across blood, adoption, and dog modules.
  - Module filter, status filter, search, and sorting options.
- Sortable and filterable user directory:
  - Email/city/blood-group search.
  - Role filter and sort modes.
  - Visibility of tenant module assignment summary.
- Profile dashboard intensification:
  - Expanded personal and medical fields (CNIC, DOB, gender, address, allergies, medical history, occupation, marital status).
  - Profile completion indicator.
  - Improved profile photo flow with preview avatar, upload action, and remove/reset behavior.

## New API Surface
- Added `GET /api/admin/users` for admin-only user directory data aggregation:
  - Sources from `profiles`, `user_profile`, and `tenant_permissions`.
  - Supports optional `search`, `role`, and `limit` query params.

## Profile API/Service Improvements
- `GET /api/profile` now provides normalized compatibility payloads:
  - Primary `data` envelope plus top-level mirrors (`user`, `profile`, `eligibility`) for older consumers.
- `profile-service` now reads/writes extended `user_profile` columns.
- Clear/reset path now clears all extended profile fields consistently.

## Files Updated
- `src/features/admin/components/AdminControlCenter.tsx`
- `src/app/api/admin/users/route.ts`
- `src/features/auth/components/ProfileDashboard.tsx`
- `src/app/api/profile/route.ts`
- `src/server/profile-service.ts`

## Notes
- This pass is intentionally schema-compatible with existing `user_profile` fields already tracked in the Supabase schema tracker.
- No new SQL table or column migration was required.
