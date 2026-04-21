# 🚀 QUICK REFERENCE - ENV VARIABLES TO UPLOAD

## Copy-Paste Ready Values

### TO UPLOAD TO VERCEL (Production Environment):

```
Variable 1 (Public - Client & Server):
Key:   NEXT_PUBLIC_SUPABASE_URL
Value: https://tcwvgasmeauczrwaiisd.supabase.co

Variable 2 (Public - Client & Server):
Key:   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
Value: sb_publishable_yEvZEUjfhHU-3t3QtHRwig_PDtIYU33

Variable 3 (Secret - Server Only):
Key:   SUPABASE_SERVICE_ROLE_KEY
Value: <YOUR_SUPABASE_SERVICE_ROLE_KEY>
```

---

## Upload Methods

### Method 1: Vercel Dashboard
1. https://vercel.com/dashboard/paksarzameen
2. Settings → Environment Variables
3. Add 3 variables above for Production

### Method 2: CLI (Windows PowerShell)
```powershell
.\env.vercel.ps1
```

### Method 3: Manual CLI
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

---

## After Upload - 3 Steps to Go Live

1. **Redeploy Application**
   ```bash
   vercel deploy --prod
   ```
   ⏱️ Wait 2-3 minutes

2. **Run Database Scripts** (in Supabase SQL Editor)
   - `docs/database/healthcare_schema_init.sql`
   - `docs/database/healthcare_doctors_seed.sql`

3. **Verify** (should all pass ✅)
   ```bash
   curl https://paksarzameenwfo.com/api/health/supabase
   ```

---

## ⚠️ Security Notes

- ✅ `NEXT_PUBLIC_*` variables are sent to browser (safe)
- ❌ Do NOT add `NEXT_PUBLIC_` prefix to `SUPABASE_SERVICE_ROLE_KEY` (keeps it server-only)
- ❌ Do NOT commit `.env` files to git
- ❌ Do NOT share `SUPABASE_SERVICE_ROLE_KEY` publicly

---

## Verify Success

| Check | Command | Expected |
|-------|---------|----------|
| Health | `curl https://paksarzameenwfo.com/api/health/supabase` | `"status": "healthy"` |
| Doctors | `curl https://paksarzameenwfo.com/api/healthcare/doctors` | Real doctor data (JSON array) |
| Homepage | `curl https://paksarzameenwfo.com` | HTML (no 500 error) |

---

## Documents to Reference

- 📄 [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md) - Detailed setup guide
- 📄 [PRODUCTION_DEPLOYMENT_CHECKLIST.md](PRODUCTION_DEPLOYMENT_CHECKLIST.md) - Full checklist
- 📄 [.env.remote.example](.env.remote.example) - All variables documented
- 📄 [.env.vercel.ps1](.env.vercel.ps1) - PowerShell script
- 📄 [.env.vercel.sh](.env.vercel.sh) - Bash script

---

**Status:** ✅ Ready to Deploy  
**Time to Complete:** 20-30 minutes  
**Complexity:** Low  
**Risk:** Low (non-breaking changes)
