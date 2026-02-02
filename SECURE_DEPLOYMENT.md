# 🔒 Secure Environment Variables Setup

This guide explains how to securely manage sensitive information like API keys and client IDs for production deployment.

## ✅ Current Security Status

- ✅ `.env` files are ignored by Git (won't be committed)
- ✅ `.env.example` is tracked (shows what variables are needed)
- ✅ Hardcoded secrets removed from `application.properties`
- ✅ Environment variables used instead of hardcoded values

## 🚀 Production Deployment Setup

### For Render (Backend)

1. **Go to your Render dashboard** → Your MediMitra backend service
2. **Navigate to Environment**
3. **Add these environment variables:**

```bash
# Required for Google OAuth
GOOGLE_CLIENT_ID=864870563363-h7moljcd7926tt1af8fmbpaodqct0ntf.apps.googleusercontent.com

# Required for database connection
DB_PASSWORD=your-actual-database-password

# Required for JWT (generate a secure random string)
JWT_SECRET=your-super-secure-random-jwt-secret-here

# Database credentials (already configured)
DATABASE_URL=jdbc:postgresql://your-supabase-connection-string
DB_USERNAME=your-supabase-username

# Optional: Override CORS origins for production
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### For Vercel (Frontend)

1. **Go to your Vercel dashboard** → Your MediMitra frontend project
2. **Navigate to Settings → Environment Variables**
3. **Add this environment variable:**

```bash
VITE_GOOGLE_CLIENT_ID=864870563363-h7moljcd7926tt1af8fmbpaodqct0ntf.apps.googleusercontent.com
```

## 🔐 Security Best Practices

### 1. **Never Commit Secrets**
- ✅ `.env` files are in `.gitignore`
- ✅ Use environment variables in production
- ✅ Use placeholder values in code

### 2. **Generate Secure Secrets**
For JWT_SECRET, generate a secure random string:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Web.Security.Membership]::GeneratePassword(32, 4)

# Or use online generators like:
# https://www.uuidgenerator.net/
# https://passwordsgenerator.net/
```

### 3. **Environment Variable Format**
- **Frontend**: `VITE_*` prefix (Vite exposes these to client-side code)
- **Backend**: Direct variable names (Spring Boot reads them automatically)

### 4. **Google OAuth Security**
- ✅ Client ID is public (safe to expose in frontend)
- ✅ Server-side verification prevents tampering
- ✅ Authorized origins restrict usage

## 🧪 Testing Environment Variables

### Local Development
```bash
# Backend - create .env file in backend/ directory
GOOGLE_CLIENT_ID=864870563363-h7moljcd7926tt1af8fmbpaodqct0ntf.apps.googleusercontent.com
DB_PASSWORD=Dheeraj@#123
JWT_SECRET=your-dev-jwt-secret

# Frontend - .env file already created
VITE_GOOGLE_CLIENT_ID=864870563363-h7moljcd7926tt1af8fmbpaodqct0ntf.apps.googleusercontent.com
```

### Production Testing
1. **Deploy to staging first**
2. **Test Google Sign-In functionality**
3. **Verify environment variables are loaded**
4. **Check logs for any missing variables**

## 🚨 Security Checklist

- [x] `.env` files ignored in Git
- [x] No hardcoded secrets in code
- [x] Environment variables used
- [x] Production secrets set
- [x] CORS properly configured
- [x] HTTPS enabled in production

## 🔄 Updating Secrets

When you need to rotate secrets:

1. **Generate new values**
2. **Update in production environment**
3. **Update local `.env` files**
4. **Test thoroughly**
5. **Remove old secrets from any backup systems**

## 📞 Support

If you encounter issues:
1. Check application logs for missing environment variables
2. Verify Google OAuth configuration matches your domains
3. Ensure HTTPS is enabled for OAuth redirects
4. Test with different browsers/devices