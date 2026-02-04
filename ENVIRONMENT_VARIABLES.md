# Environment Variables Configuration

## Backend Environment Variables

Create a `.env` file in the backend folder (for local development) or set these in your hosting platform:

```bash
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL=jdbc:postgresql://aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Email Configuration (Gmail SMTP)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://your-frontend-url.vercel.app

# Logging Level (optional)
LOG_LEVEL=INFO
```

## Frontend Environment Variables

Create a `.env` file in the frontend folder:

```bash
# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Backend API URL
VITE_API_URL=http://localhost:8080

# For production:
# VITE_API_URL=https://your-backend-url.onrender.com
```

## Gmail SMTP Setup Steps

1. **Enable 2-Factor Authentication:**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "MediMitra Email Service"
   - Copy the 16-character password
   - Use this as `MAIL_PASSWORD`

## Production Deployment

### Backend (Render/Railway/Heroku):
Add all backend environment variables in your hosting platform's settings.

### Frontend (Vercel/Netlify):
Add frontend environment variables in your hosting platform's settings.

**Important:** Never commit `.env` files to version control!
