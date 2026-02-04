# 🚀 Deployment Guide: GitHub → Vercel & Render

## ⚠️ CRITICAL: Issues You WILL Face & How to Fix Them

### 🔴 Issue #1: Render Backend Will NOT Start After Push

**Problem:**
- `render.yaml` now has `sync: false` for credentials
- Render expects these values to be set in the dashboard
- **Without them, your backend WILL FAIL to start**

**Symptoms:**
```
❌ Error: spring.datasource.username is required
❌ Error: spring.datasource.password is required
❌ Email service will fail
❌ Google OAuth will fail
```

**Solution - BEFORE Pushing to GitHub:**

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service**: `medimitra-backend`
3. **Go to Environment tab**
4. **Add these environment variables:**

```bash
DB_USERNAME=postgres.gufhpybptyzcpofgljxc
DB_PASSWORD=Dheeraj@#123
MAIL_USERNAME=dheerajsinghnew1@gmail.com
MAIL_PASSWORD=mgmzqmduvbjoutzw
GOOGLE_CLIENT_ID=864870563363-h7moljcd7926tt1af8fmbpaodqct0ntf.apps.googleusercontent.com
```

5. **Save** (DON'T trigger redeploy yet)

---

### 🔴 Issue #2: Vercel Frontend Will NOT Work After Push

**Problem:**
- `vercel.json` has placeholder values
- Frontend needs real Google Client ID to function
- **Google Sign-In WILL NOT WORK**

**Symptoms:**
```
❌ Google Sign-In button won't work
❌ Console error: Invalid client ID
```

**Solution - BEFORE Pushing to GitHub:**

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your frontend project**: `medi-mitra` or similar
3. **Go to Settings → Environment Variables**
4. **Add these variables:**

```bash
VITE_API_BASE_URL=https://medimitra-backend-xws5.onrender.com/api
VITE_GOOGLE_CLIENT_ID=864870563363-h7moljcd7926tt1af8fmbpaodqct0ntf.apps.googleusercontent.com
```

5. **Apply to**: Production, Preview, and Development
6. **Save**

---

### 🔴 Issue #3: Previously Committed .env Files

**Problem:**
- If `frontend/.env` was previously committed to Git, it's still tracked
- Changes to `.gitignore` don't remove already-tracked files

**Check:**
```powershell
cd "e:\Projects\MediMitra-1\MediMitra-main"
git ls-files | Select-String "\.env"
```

**Solution (if .env is tracked):**
```powershell
# Remove from Git tracking (keeps local file)
git rm --cached frontend/.env
git rm --cached backend/.env

# Commit the removal
git add .gitignore
git commit -m "Remove .env files from tracking and secure credentials"
```

---

## ✅ STEP-BY-STEP DEPLOYMENT PROCESS

### Step 1: Set Environment Variables (DO THIS FIRST!)

#### Render (Backend):
1. Go to https://dashboard.render.com
2. Select `medimitra-backend` service
3. Click **Environment** tab
4. Click **Add Environment Variable** for each:
   - `DB_USERNAME` = `postgres.gufhpybptyzcpofgljxc`
   - `DB_PASSWORD` = `Dheeraj@#123`
   - `MAIL_USERNAME` = `dheerajsinghnew1@gmail.com`
   - `MAIL_PASSWORD` = `mgmzqmduvbjoutzw`
   - `GOOGLE_CLIENT_ID` = `864870563363-h7moljcd7926tt1af8fmbpaodqct0ntf.apps.googleusercontent.com`
5. **Save** (don't redeploy yet)

#### Vercel (Frontend):
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `VITE_API_BASE_URL` = `https://medimitra-backend-xws5.onrender.com/api`
   - `VITE_GOOGLE_CLIENT_ID` = `864870563363-h7moljcd7926tt1af8fmbpaodqct0ntf.apps.googleusercontent.com`
5. Select **Production**, **Preview**, and **Development**
6. Click **Save**

### Step 2: Update vercel.json (Important!)

The `vercel.json` currently has placeholder values. You have TWO options:

**Option A: Remove env from vercel.json (Recommended)**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Option B: Keep it but understand it's a fallback**
- The `env` section in `vercel.json` is a fallback
- Dashboard variables take precedence
- But it's visible in Git, so use placeholders

### Step 3: Check Git Status

```powershell
cd "e:\Projects\MediMitra-1\MediMitra-main"

# Check what's tracked
git ls-files | Select-String "\.env"

# If any .env files appear, remove them:
git rm --cached frontend/.env
git rm --cached backend/.env
```

### Step 4: Commit Changes

```powershell
# Add all security fixes
git add .gitignore
git add render.yaml
git add frontend/vercel.json
git add backend/src/main/resources/application.properties
git add *.md
git add backend/.env.template
git add frontend/.env.template

# Commit
git commit -m "Security: Remove hardcoded credentials and use environment variables"
```

### Step 5: Push to GitHub

```powershell
git push origin main
```

### Step 6: Verify Deployments

#### Check Render:
1. Go to Render Dashboard
2. Watch the deployment logs
3. Look for:
   - ✅ "Started MediMitraApplication"
   - ✅ "Tomcat started on port(s): 8080"
   - ❌ Any error about missing environment variables

#### Check Vercel:
1. Go to Vercel Dashboard
2. Deployments tab
3. Click latest deployment
4. Check build logs
5. After deployment, test Google Sign-In

---

## 🛠️ Troubleshooting

### Render Backend Fails to Start

**Error**: "required property missing"
```bash
# Check your Render environment variables
# Make sure ALL these are set:
DB_USERNAME
DB_PASSWORD
MAIL_USERNAME
MAIL_PASSWORD
GOOGLE_CLIENT_ID
JWT_SECRET
DATABASE_URL
```

**Fix**:
1. Go to Render → Environment
2. Verify all variables are set
3. Click **Manual Deploy** → **Deploy latest commit**

### Vercel Frontend Build Fails

**Error**: "VITE_GOOGLE_CLIENT_ID is undefined"
```bash
# This is OK during build!
# Vercel injects env vars at runtime
```

**If Google Sign-In doesn't work**:
1. Go to Vercel → Settings → Environment Variables
2. Verify `VITE_GOOGLE_CLIENT_ID` is set
3. Redeploy: Deployments → ••• → Redeploy

### Database Connection Error on Render

**Error**: "Connection refused" or "Authentication failed"

**Check**:
1. `DATABASE_URL` is correct in render.yaml
2. `DB_USERNAME` matches your Supabase username
3. `DB_PASSWORD` is correct
4. Supabase allows connections from Render IPs

---

## 🔐 Security Best Practices Going Forward

### DO:
✅ Use environment variables in Render/Vercel dashboards
✅ Keep `.env` files in `.gitignore`
✅ Use `.env.template` files for documentation
✅ Rotate credentials if exposed

### DON'T:
❌ Commit `.env` files
❌ Hardcode credentials in source code
❌ Share credentials in documentation
❌ Push sensitive data to GitHub

---

## 📋 Quick Checklist Before Push

- [ ] Set all environment variables in Render Dashboard
- [ ] Set all environment variables in Vercel Dashboard
- [ ] Remove `.env` files from Git tracking
- [ ] Verify `.gitignore` includes `.env` files
- [ ] Test locally first
- [ ] Update `vercel.json` (remove hardcoded values or remove env section)
- [ ] Commit changes
- [ ] Push to GitHub
- [ ] Monitor deployment logs
- [ ] Test deployed applications

---

## 🆘 Emergency Rollback

If deployment fails:

### Render:
```bash
# In Render Dashboard:
1. Go to your service
2. Click "Manual Deploy"
3. Select previous successful commit
4. Click "Deploy"
```

### Vercel:
```bash
# In Vercel Dashboard:
1. Go to Deployments
2. Find last working deployment
3. Click ••• → Promote to Production
```

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs/environment-variables
- **Vercel Docs**: https://vercel.com/docs/environment-variables
- **Supabase Docs**: https://supabase.com/docs
- **Google OAuth Setup**: https://console.cloud.google.com/

---

**Remember**: Once you set environment variables in the dashboards, they persist across deployments. You only need to do this ONCE (unless you rotate credentials).
