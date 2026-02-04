# 🔐 SECURITY WARNING - IMPORTANT!

## ⚠️ NEVER Commit These Files or Information to GitHub:

### Files to Keep Private:
- `.env` files (already in .gitignore)
- `backend/.env` files
- Any file containing passwords, API keys, or secrets

### Information to NEVER Include in Code:
- Database passwords
- Database usernames  
- SMTP/Email passwords
- JWT secrets
- OAuth client secrets
- API keys
- Personal email addresses
- Google Client IDs (keep them in environment variables)

## ✅ How to Configure Credentials Securely:

### For Local Development:
1. Copy `backend/.env.template` to `backend/.env`
2. Fill in your actual credentials in `.env` (this file is gitignored)
3. Never commit the `.env` file

### For Render Deployment:
1. Go to Render Dashboard → Your Service → Environment
2. Add environment variables manually in the Render UI:
   - `DB_USERNAME` - Your database username
   - `DB_PASSWORD` - Your database password  
   - `MAIL_USERNAME` - Your Gmail address
   - `MAIL_PASSWORD` - Your Gmail app password
   - `JWT_SECRET` - A strong random secret (32+ characters)
   - `GOOGLE_CLIENT_ID` - Your Google OAuth client ID

3. Update `render.yaml` to reference env vars without values:
   ```yaml
   envVars:
     - key: DB_PASSWORD
       sync: false  # This tells Render to use the value from dashboard
     - key: GOOGLE_CLIENT_ID
       sync: false
   ```

### For Vercel (Frontend) Deployment:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add environment variables:
   - `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth client ID
   - `VITE_API_BASE_URL` - Your backend API URL (e.g., https://your-backend.onrender.com/api)

3. Redeploy your frontend after adding variables

## 🚨 If Credentials Were Already Committed:

### Immediate Actions Required:
1. **Change ALL passwords immediately**:
   - Database password in Supabase
   - Gmail app password (revoke and create new)
   - Generate new JWT secret
   
2. **Remove from Git history**:
   ```powershell
   # This is complex - consider creating a new repository
   # OR use git filter-branch or BFG Repo Cleaner
   ```

3. **Update environment variables**:
   - Update `.env` files locally
   - Update Render environment variables
   - Redeploy applications

## 📝 Current Status:
- ✅ Credentials removed from source code
- ✅ `.gitignore` configured properly (frontend & backend)
- ✅ Template files created (.env.template)
- ✅ Google Client ID removed from public files
- ⚠️ You need to manually set environment variables in Render & Vercel
- ⚠️ Consider rotating all exposed credentials

## 🔗 Resources:
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [Supabase Database Settings](https://app.supabase.com)
- [Render Environment Variables](https://render.com/docs/environment-variables)
