# VERCEL DASHBOARD ENV UPLOAD GUIDE
## Step-by-Step Instructions

### Prerequisites
- Vercel account with `paksarzameen` project
- Access to Supabase dashboard (for keys)

---

## Method 1: Vercel Web Dashboard (Easiest)

### Step 1: Navigate to Vercel Project Settings
1. Go to https://vercel.com/dashboard
2. Click on project: `paksarzameen`
3. Click **Settings** tab
4. Click **Environment Variables** (left sidebar)

### Step 2: Add Public Supabase Variables

#### 2a. Add `NEXT_PUBLIC_SUPABASE_URL`
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://tcwvgasmeauczrwaiisd.supabase.co`
- **Environments:** Production ✓
- Click **Save**

#### 2b. Add `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Key:** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Value:** `sb_publishable_yEvZEUjfhHU-3t3QtHRwig_PDtIYU33`
- **Environments:** Production ✓
- Click **Save**

### Step 3: Add Secret Supabase Variables

#### 3a. Add `SUPABASE_SERVICE_ROLE_KEY`
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `<YOUR_SUPABASE_SERVICE_ROLE_KEY>`
- **Environments:** Production ✓
- ⚠️ **IMPORTANT:** Do NOT use `NEXT_PUBLIC_` prefix (keeps it server-side only)
- Click **Save**

### Step 4: Verify Variables Are Set
You should see:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` → Production
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → Production
- [ ] `SUPABASE_SERVICE_ROLE_KEY` → Production

---

## Method 2: Vercel CLI (Fast)

### Prerequisites
```bash
npm install -g vercel
vercel login
```

### Upload All Variables at Once
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

Or use the provided PowerShell script:
```bash
.\env.vercel.ps1
```

---

## Step 5: Redeploy Application

After variables are added, you MUST redeploy:

### Using Dashboard
1. Go to Vercel Dashboard > `paksarzameen`
2. Click **Deployments**
3. Click the latest deployment
4. Click **Redeploy**
5. Select **Latest Commit**
6. Click **Redeploy**

### Using CLI
```bash
vercel deploy --prod
```

---

## Step 6: Verify Deployment

### 6a. Check Supabase Connection
```bash
curl https://paksarzameenwfo.com/api/health/supabase
```

Expected response:
```json
{
  "status": "healthy",
  "supabaseConnection": true,
  "env": {
    "hasSupabaseUrl": true,
    "hasPublishableKey": true,
    "hasServiceRoleKey": true
  }
}
```

### 6b. Check Healthcare Endpoint
```bash
curl https://paksarzameenwfo.com/api/healthcare/doctors
```

Should return doctor data (NOT mock data or error).

---

## Troubleshooting

### Issue: Environment variables not working after deploy

**Solution:**
1. Double-check variable names exactly (including `NEXT_PUBLIC_` prefix)
2. Redeploy again (sometimes takes 2 deploys to activate)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check Vercel build logs for errors

### Issue: "Invalid API key" error on healthcare endpoint

**Solution:**
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set (without `NEXT_PUBLIC_` prefix)
2. Check key is correct in Supabase dashboard
3. Make sure you're using Production environment in Vercel
4. Redeploy

### Issue: Tables don't exist in database

**Solution:**
1. Run SQL schema scripts in Supabase SQL Editor
2. Scripts location: `docs/database/`
3. Run in order:
   - `healthcare_schema_init.sql` (creates tables)
   - `healthcare_doctors_seed.sql` (adds test data)

---

## Variables Reference

| Variable | Type | Value | Environment |
|----------|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | `https://tcwvgasmeauczrwaiisd.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | `sb_publishable_yEvZEUjfhHU-3t3QtHRwig_PDtIYU33` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | `<YOUR_SUPABASE_SERVICE_ROLE_KEY>` | Production |

---

## Security Notes

⚠️ **IMPORTANT:**
- `NEXT_PUBLIC_` variables ARE sent to browser (safe to expose)
- `SUPABASE_SERVICE_ROLE_KEY` is NEVER sent to browser (keep private)
- NEVER commit `.env` files to git
- NEVER share service role key publicly
- Rotate keys every 6-12 months

---

## After Everything is Set Up

1. ✅ Env variables uploaded
2. ✅ Application redeployed
3. ✅ Database schema initialized (SQL scripts run in Supabase)
4. ✅ Health check shows healthy
5. ✅ Healthcare endpoints return live data

**You're done!** 🎉
