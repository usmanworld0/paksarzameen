# Healthcare Platform Setup Guide

## Overview
The healthcare module is now fully Supabase-backed with profile persistence and doctor/appointment management. All legacy Postgres dependencies have been removed.

## Diagnostic Health Check

**Before you start, check if your Supabase project is ready:**
1. Open your app and visit: `http://localhost:3000/api/health/supabase`
2. You should see one of two responses:

**✅ If healthy:**
```json
{
  "status": "healthy",
  "checks": {
    "supabaseConnection": true,
    "tablesExist": {
      "users": true,
      "user_profile": true,
      "healthcare_doctors": true,
      "profiles": true
    },
    "errors": []
  }
}
```

**❌ If unhealthy:**
```json
{
  "status": "unhealthy",
  "checks": {
    "errors": ["Table \"user_profile\" does not exist"]
  },
  "nextSteps": "Run docs/database/healthcare_schema_init.sql in Supabase SQL Editor"
}
```

## Quick Setup: Get Healthcare Running

### Step 1: Verify Environment Variables
Ensure your `.env.local` or `.env` has:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Step 2: Create Healthcare Schema
1. Open **Supabase Dashboard** → Your Project → **SQL Editor**
2. **Create a new query** and paste the entire contents of: `docs/database/healthcare_schema_init.sql`
3. Click **Run** (or Ctrl+Enter)
4. Wait for the message: ✅ `success` or ✅ `Query executed successfully`
5. **DO NOT close or continue until you see success**

### Step 3: Seed Sample Doctors (Optional but Recommended)
1. Still in SQL Editor, **Create a new query**
2. Paste: `docs/database/healthcare_doctors_seed.sql`
3. Click **Run**
4. Wait for success

### Step 4: Verify in Application
1. In your app terminal, restart: `npm run dev` (if not already running)
2. Visit `http://localhost:3000/api/health/supabase`
3. Confirm all checks show `true` and `errors: []`
4. Login to the app as a user
5. Navigate to `/healthcare` 
6. You should now see:
   - ✅ Doctor list with specializations
   - ✅ Available appointment slots
   - ✅ Your profile loading without errors

## Troubleshooting

### Error: "Failed to load profile"
**Cause**: user_profile table doesn't exist or has no rows for the user
**Solution**: 
1. Run `docs/database/healthcare_schema_init.sql` (Step 2 above)
2. Refresh your browser

### Error: "Healthcare schema is not initialized"
**Cause**: healthcare_doctors table doesn't exist
**Solution**: Run `docs/database/healthcare_schema_init.sql` in Supabase SQL Editor

### Error: "Unable to load doctors right now"
**Cause**: Could be schema not initialized OR Supabase auth issue
**Solution**:
1. Check `/api/health/supabase` to see which table is missing
2. Run the appropriate SQL script in Supabase
3. Refresh the browser

### Error: "error_code: 42P01" in browser console
**Cause**: Table does not exist in Supabase
**Solution**:
1. Copy the table name from the error (e.g., "healthcare_doctors")
2. Run `docs/database/healthcare_schema_init.sql` in Supabase SQL Editor
3. Reload the page

### No doctors showing after running seed script
**Cause**: Seed script didn't run successfully
**Solution**:
1. Go back to Supabase SQL Editor
2. Run: `SELECT COUNT(*) FROM healthcare_doctors;`
3. Should show `5` rows
4. If it shows `0`, re-run `docs/database/healthcare_doctors_seed.sql`

### Profile picture upload not working
**Cause**: Cloudinary not configured OR permission issue
**Solution**: Ensure these env vars are set:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Architecture Overview

### Key Tables
| Table | Purpose | Dependency |
|-------|---------|------------|
| `profiles` | Supabase Auth users | **Supabase Auth** |
| `user_profile` | User profile data (blood type, city, etc.) | `profiles(id)` |
| `healthcare_doctors` | Doctor profiles | Independent |
| `healthcare_doctor_slots` | Available appointment times | `healthcare_doctors(id)` |
| `healthcare_appointments` | Booked appointments | `healthcare_doctors`, `profiles`, `healthcare_doctor_slots` |
| `healthcare_appointment_messages` | Chat between doctor and patient | `healthcare_appointments` |
| `healthcare_blood_donor_chats` | Donor matching chat rooms | `profiles` |
| `healthcare_user_suspensions` | User access control | `profiles` |

### API Endpoints

#### Profile Management
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile
- `DELETE /api/profile` - Clear profile data
- `POST /api/profile/upload-image` - Upload profile picture

#### Healthcare (Patients)
- `GET /api/healthcare/doctors` - List all doctors and available slots
- `POST /api/healthcare/appointments` - Book an appointment
- `GET /api/healthcare/appointments` - Get user's appointments
- `POST /api/healthcare/quick-answer` - Ask AI health question

#### Healthcare (Doctors)
- `GET /api/healthcare/doctor/appointments` - Get doctor's appointments
- `POST /api/healthcare/doctor/appointments` - Respond to appointments
- `GET /api/healthcare/doctor/slots` - Get doctor's slots
- `POST /api/healthcare/doctor/slots` - Add new appointment slots

#### Admin
- `GET /api/admin/healthcare/doctors` - List all doctors (admin)
- `POST /api/admin/healthcare/doctors` - Create new doctor
- `GET /api/admin/healthcare/analytics` - Healthcare platform analytics
- `POST /api/admin/healthcare/suspensions` - Suspend/unsuspend users

#### Diagnostics
- `GET /api/health/supabase` - Check Supabase connectivity and schema

## Development Tasks

### Add a New Doctor
```bash
POST /api/admin/healthcare/doctors
Content-Type: application/json

{
  "email": "dr.new@example.com",
  "fullName": "Dr. Sarah Smith",
  "specialization": "Neurology",
  "bio": "Expert in brain and nervous system disorders",
  "experienceYears": 7,
  "consultationFee": 550
}
```

### Get Healthcare Analytics
```bash
GET /api/admin/healthcare/analytics
```

### Reset All Healthcare Data (Development Only)
```sql
-- In Supabase SQL Editor
TRUNCATE TABLE healthcare_appointments CASCADE;
TRUNCATE TABLE healthcare_appointment_messages CASCADE;
TRUNCATE TABLE healthcare_doctor_slots CASCADE;
TRUNCATE TABLE healthcare_doctors CASCADE;
```

## FAQ

**Q: Do I need both schema_init and doctors_seed?**
A: No. Schema init is required. Seed script is optional but recommended for immediate testing.

**Q: Can I delete the healthcare tables and rebuild?**
A: Yes. In Supabase SQL Editor, run the TRUNCATE commands above, then re-run healthcare_schema_init.sql.

**Q: What if I have existing data?**
A: The scripts use `CREATE TABLE IF NOT EXISTS` so existing data is preserved.

**Q: How do I export doctor data?**
A: In Supabase, go to SQL Editor and run:
```sql
SELECT * FROM healthcare_doctors;
```
Then use "Download as CSV" button.

**Q: Can users edit their own profile?**
A: Yes. They can via the profile UI or PUT /api/profile endpoint.

## Related Files
- Schema definitions: [docs/database/supabase_schema_tracker.md](supabase_schema_tracker.md)
- Profile service: [src/server/profile-service.ts](../src/server/profile-service.ts)
- Healthcare core: [src/services/healthcare/core-service.ts](../src/services/healthcare/core-service.ts)
- Error handling: [src/services/healthcare/error-mapper.ts](../src/services/healthcare/error-mapper.ts)

