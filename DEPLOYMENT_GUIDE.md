# 🚀 MediMitra Deployment Guide

## Complete Guide for Deploying to Render (Backend) and Vercel (Frontend)

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub repository with your code
- ✅ [Render account](https://render.com) (Free tier available)
- ✅ [Vercel account](https://vercel.com) (Free tier available)
- ✅ [Supabase account](https://supabase.com) with PostgreSQL database
- ✅ Gmail account with 2FA enabled and App Password generated
- ✅ [Google Cloud Console](https://console.cloud.google.com) project (for OAuth)

---

## 🗄️ Part 1: Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name:** medimitra
   - **Database Password:** (Save this securely!)
   - **Region:** Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 2. Get Connection Details

1. In Supabase Dashboard → Settings → Database
2. Copy the following:
   - **Host:** `aws-0-us-east-1.pooler.supabase.com`
   - **Database:** `postgres`
   - **Port:** `5432`
   - **User:** `postgres.[your-project-ref]`
   - **Password:** Your database password

3. **Session Mode Connection String** (for Spring Boot):
   ```
   jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

---

## 📧 Part 2: Email Setup (Gmail)

### 1. Enable 2-Factor Authentication

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Under "Signing in to Google" → Enable "2-Step Verification"
3. Follow the setup process

### 2. Generate App Password

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
   - Enter: `MediMitra Backend`
4. Click **Generate**
5. **Copy the 16-digit password** (e.g., `abcd efgh ijkl mnop`)
6. **Important:** Remove spaces → `abcdefghijklmnop`

---

## 🔐 Part 3: Google OAuth Setup (Optional)

### 1. Create Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: "MediMitra"
3. Enable **Google+ API**

### 2. Configure OAuth Consent Screen

1. APIs & Services → OAuth consent screen
2. Select **External** → Create
3. Fill in:
   - **App name:** MediMitra
   - **User support email:** your-email@gmail.com
   - **Developer contact:** your-email@gmail.com
4. Save and continue

### 3. Create OAuth Credentials

1. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
2. Application type: **Web application**
3. Name: `MediMitra Web Client`
4. **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://your-app.vercel.app
   ```
5. **Authorized redirect URIs:**
   ```
   http://localhost:5173
   https://your-app.vercel.app
   ```
6. Click **Create**
7. **Copy Client ID** (you'll need this later)

---

## 🖥️ Part 4: Deploy Backend to Render

### 1. Prepare Your Code

Ensure `application.properties` has:
```properties
spring.mail.port=465
spring.mail.properties.mail.smtp.ssl.enable=true
spring.mail.properties.mail.smtp.connectiontimeout=60000
spring.mail.properties.mail.smtp.timeout=60000
```

### 2. Push to GitHub

```bash
cd backend
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 3. Create Render Web Service

1. Go to [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `medimitra-backend`
   - **Region:** Oregon (or closest)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Java
   - **Build Command:** `mvn clean install`
   - **Start Command:** `java -jar target/medimitra-backend-1.0.0.jar`
   - **Instance Type:** Free

### 4. Add Environment Variables

Click **Advanced** → **Add Environment Variable**

```env
# Database Configuration
DATABASE_URL=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres
DB_USERNAME=postgres.abcdefghijklmno
DB_PASSWORD=your-supabase-database-password

# Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=abcdefghijklmnop

# JWT Secret (Generate a random 32+ character string)
JWT_SECRET=MediMitra2024SecureJWTSecretKeyForProductionEnvironment

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com

# CORS (will update after Vercel deployment)
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://*.vercel.app

# Logging
LOG_LEVEL=INFO
MAIL_DEBUG=false
SHOW_SQL=false
```

### 5. Deploy

1. Click **Create Web Service**
2. Wait for deployment (~10 minutes first time)
3. Once deployed, copy your backend URL:
   ```
   https://medimitra-backend.onrender.com
   ```

### 6. Test Backend

Open browser and test:
```
https://medimitra-backend.onrender.com/api/medicines
```

You should see JSON response (empty array is fine).

---

## 🌐 Part 5: Deploy Frontend to Vercel

### 1. Push to GitHub

```bash
cd frontend
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. **Import Git Repository** (select your repo)
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 3. Add Environment Variables

Click **Environment Variables** and add:

```env
VITE_API_BASE_URL=https://medimitra-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
```

### 4. Deploy

1. Click **Deploy**
2. Wait for deployment (~3 minutes)
3. Once deployed, copy your frontend URL:
   ```
   https://your-app.vercel.app
   ```

---

## 🔄 Part 6: Update CORS Settings

### 1. Update Render Environment Variable

1. Go to Render Dashboard → Your Web Service
2. Environment → Edit `CORS_ALLOWED_ORIGINS`
3. Update to:
   ```
   https://your-app.vercel.app,https://*.vercel.app
   ```
4. Save changes (this will trigger a redeploy)

### 2. Update Google OAuth Redirect URIs

1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add to **Authorized JavaScript origins:**
   ```
   https://your-app.vercel.app
   ```
4. Add to **Authorized redirect URIs:**
   ```
   https://your-app.vercel.app
   ```
5. Save

---

## ✅ Part 7: Post-Deployment Testing

### 1. Test Email Functionality

1. Open your Vercel app: `https://your-app.vercel.app`
2. Click **Register**
3. Fill in registration form
4. Submit and check email for verification link
5. ✅ If email received → Email setup successful!
6. ❌ If no email → Check Render logs

### 2. Check Render Logs

1. Render Dashboard → Your Web Service → Logs
2. Look for email-related errors:
   ```
   ✅ Good: "Email sent successfully to..."
   ❌ Bad: "MailConnectException: Couldn't connect..."
   ```

### 3. Common Email Issues

**If you see connection timeout:**
```
MailConnectException: Couldn't connect to host, port: smtp.gmail.com, 587
```

**Fix:**
1. Check `MAIL_PASSWORD` is correct (16 digits, no spaces)
2. Verify port is `465` in application.properties
3. Ensure SSL is enabled (not STARTTLS)
4. Check timeout values are `60000`

### 4. Test All Features

- ✅ User registration with email verification
- ✅ Login with credentials
- ✅ Google OAuth login
- ✅ Browse medicines
- ✅ Add to cart
- ✅ Checkout and place order
- ✅ Receive order confirmation email with PDF invoice
- ✅ Store login and dashboard
- ✅ Admin login and dashboard

---

## 🔧 Troubleshooting

### Backend Not Starting

**Symptom:** Render shows "Deploy failed" or continuous restarts

**Solution:**
1. Check Render logs for errors
2. Verify all environment variables are set
3. Check database connection string is correct
4. Ensure `PORT` environment variable is available

### Email Not Sending

**Symptom:** Registration works but no verification email

**Solution:**
1. Check Render logs for email errors
2. Verify Gmail App Password (no spaces)
3. Confirm port is `465` (not `587`)
4. Check `application.properties` has SSL enabled
5. Test email manually from Render shell:
   ```bash
   # In Render Shell
   curl -v telnet://smtp.gmail.com:465
   ```

### CORS Errors

**Symptom:** Frontend shows "CORS policy" errors in browser console

**Solution:**
1. Check `CORS_ALLOWED_ORIGINS` includes your Vercel URL
2. Ensure URL has `https://` (not `http://`)
3. Restart Render service after changing CORS
4. Clear browser cache

### Database Connection Pool Exhausted

**Symptom:** "HikariPool - Connection is not available"

**Solution:**
1. In `application.properties`:
   ```properties
   spring.datasource.hikari.maximum-pool-size=5
   spring.datasource.hikari.minimum-idle=1
   ```
2. Use Session Pooler (not Transaction Pooler) in Supabase

### Google OAuth Not Working

**Symptom:** "Redirect URI mismatch" error

**Solution:**
1. Add production URL to Google Cloud Console
2. Ensure CORS allows your domain
3. Check `VITE_GOOGLE_CLIENT_ID` is set in Vercel

---

## 📊 Monitoring

### Render Dashboard

- **Metrics:** CPU, Memory, Response time
- **Logs:** Real-time application logs
- **Events:** Deployment history

### Vercel Dashboard

- **Analytics:** Page views, visitor data
- **Deployments:** Build logs and status
- **Functions:** API route performance

### Supabase Dashboard

- **Database:** Table editor, SQL editor
- **Logs:** Query logs, error logs
- **Usage:** API requests, bandwidth

---

## 🔄 Updating Your Deployment

### Deploy New Changes

1. Make code changes locally
2. Test locally:
   ```bash
   # Backend
   cd backend
   mvn spring-boot:run
   
   # Frontend
   cd frontend
   npm run dev
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```

4. **Auto-Deploy:**
   - Render: Automatically deploys on push
   - Vercel: Automatically deploys on push

### Rollback Deployment

**Render:**
1. Dashboard → Deploys
2. Click on previous successful deploy
3. Click "Rollback to this version"

**Vercel:**
1. Dashboard → Deployments
2. Find previous deployment
3. Click "Promote to Production"

---

## 💰 Cost Optimization

### Free Tier Limits

**Render (Free):**
- 750 hours/month
- Spins down after 15 min inactivity
- 512 MB RAM

**Vercel (Free):**
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless functions

**Supabase (Free):**
- 500 MB database
- 2 GB bandwidth

### Upgrade Recommendations

**When to upgrade:**
- > 1000 daily active users
- Need 24/7 uptime (no spin-down)
- Database > 500 MB
- Need more than 512 MB RAM

---

## 🎉 Congratulations!

Your MediMitra application is now live!

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://medimitra-backend.onrender.com
- **Database:** Supabase (managed)

### Next Steps

1. ⭐ Star the repository
2. 📧 Test all email flows
3. 🔐 Set up monitoring/alerts
4. 📱 Test on mobile devices
5. 🚀 Share with users!

---

## 📞 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review Render/Vercel logs
3. Open GitHub issue with logs
4. Contact via email

---

**Happy Deploying! 🚀**
