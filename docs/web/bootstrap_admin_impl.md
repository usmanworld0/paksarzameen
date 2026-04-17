# Bootstrap Admin Implementation

## Overview
Added a one-time, server-only bootstrap flow for creating the first Supabase admin user.

## API Route
- `POST /api/bootstrap-admin`
- Accepts `email` and `password` in JSON body
- Uses `supabaseAdmin.auth.admin.createUser()` with `email_confirm: true`
- Inserts a matching `profiles` row with `role = 'admin'`

## Security Rules
- The route is disabled once an admin profile already exists unless `BOOTSTRAP_MODE=true`
- Service role key is only used on the server
- No credentials are hardcoded in code
- The temporary setup page is only available in development or bootstrap mode

## UI
- Added `/setup-admin`
- Minimal form posts email/password to the bootstrap route
- Shows success/error feedback

## Notes
- This flow is intended only for first-run initialization
- After first admin creation, normal login should use the main `/login` path
