# PSZ Main Web - Blood Bank Implementation (2026-03-15)

## Overview
Implemented a full Blood Bank workflow on the main website with:
- Public emergency request form
- Persistent backend storage in the same PostgreSQL database used by the store
- Request status lifecycle tracking (`pending`, `in_progress`, `completed`, `cancelled`)
- Dedicated main-site admin panel at `/admin` with login and status management
- Prominent emergency contacts in navbar and homepage sections

## Requirements Implemented
- Collected details in public form:
  - Name
  - Needed time
  - CNIC
  - Location
  - Volume of blood
  - Contact number
  - Optional blood group
  - Optional notes
- Stored and managed request status in backend.
- Added emergency contacts globally:
  - Umar Hafeez: 03098237670
  - Ahmed Amir: 03233609157
- Added main-site admin panel at `/admin` (no redirect to store admin).
- Admin authentication aligned with store fallback credentials logic.
- Backend uses shared `DATABASE_URL` database.

## Backend Architecture
### Database Layer
- `src/lib/db.ts`
  - Shared Postgres pool via `pg`
  - Uses `DATABASE_URL`
  - Production SSL enabled with relaxed cert verification

### Domain Layer
- `src/lib/blood-bank.ts`
  - Input parsing/validation for public requests
  - Status normalization/validation
  - Idempotent schema bootstrap (`CREATE TABLE IF NOT EXISTS ...`)
  - CRUD-style operations:
    - `createBloodRequest`
    - `getBloodRequests`
    - `updateBloodRequestStatus`

### Admin Auth Layer
- `src/lib/main-admin-auth.ts`
  - Signed cookie session for main-site admin (`psz-main-admin-session`)
  - Credential check helper
  - Fallback credentials aligned with store:
    - `abdullahtanseer@gmail.com`
    - `CommonWe@lth!`
  - Env overrides supported:
    - `PSZ_ADMIN_EMAIL`
    - `PSZ_ADMIN_PASSWORD`
    - `PSZ_ADMIN_SESSION_SECRET`

## API Surface
### Public
- `POST /api/blood-requests`
  - Accepts request payload from Blood Bank form
  - Creates row with default status `pending`

### Admin
- `POST /api/admin/login`
  - Validates admin credentials
  - Sets signed session cookie
- `POST /api/admin/logout`
  - Clears session cookie
- `GET /api/admin/blood-requests`
  - Returns all requests (auth required)
- `PATCH /api/admin/blood-requests/[id]`
  - Updates request status (auth required)

## UI Surfaces
### Public pages/components
- `src/app/blood-bank/page.tsx`
  - Dedicated blood bank page with emergency context and call links
- `src/features/blood-bank/components/BloodBankRequestForm.tsx`
  - Public submission form
- `src/features/home/components/HomeClient.tsx`
  - Added landing-page emergency reference section and CTA to Blood Bank page
- `src/components/header/Navbar.tsx`
  - Added prominent `Blood Bank` nav item
  - Added emergency contacts strip with click-to-call links
- `src/config/site.ts`
  - Added `Blood Bank` nav link and centralized `emergencyContacts`

### Admin pages/components
- `src/app/admin/login/page.tsx`
  - Main-site admin login
- `src/features/blood-bank/components/AdminLoginForm.tsx`
  - Login form UI and API interaction
- `src/app/admin/page.tsx`
  - Auth-gated admin dashboard entry
- `src/features/blood-bank/components/AdminBloodRequestsPanel.tsx`
  - Requests table with status filtering and updates

## Routing Change
- Removed old redirect route:
  - Deleted `src/app/admin/[[...slug]]/route.ts`
- `/admin` now belongs to main site app and is no longer forwarded to store admin.

## Data Model
See `docs/database/supabase_schema_tracker.md` for SQL definitions.

Table added:
- `blood_bank_requests`

Indexes added:
- `blood_bank_requests_status_idx`
- `blood_bank_requests_needed_at_idx`

## Verification
- Main app production build successful after implementation.
- Build output includes:
  - `/blood-bank`
  - `/admin`
  - `/admin/login`
  - `/api/blood-requests`
  - `/api/admin/*` blood-request endpoints

## Notes
- The table is created lazily at runtime by API/service code if absent.
- This allows deployment without manual migration step, while schema tracker remains updated for controlled migration workflows.
