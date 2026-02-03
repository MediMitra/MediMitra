# Email Verification with OTP - Setup Guide

This guide explains how to set up email verification with OTP (One-Time Password) for user registration in MediMitra.

## Overview

The email verification system sends a 6-digit OTP to the user's email during registration. The OTP is valid for 10 minutes and must be verified before completing the registration process.

## Gmail SMTP Configuration

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter a name like "MediMitra Email Service"
5. Click **Generate**
6. Copy the 16-character password (you'll use this in the next step)

### Step 3: Configure Environment Variables

You need to set up the following environment variables for your backend:

**For Development (Local):**

Create a `.env` file in your backend folder or set environment variables:

```bash
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
```

**For Production (Render/Railway/Heroku):**

Add these environment variables in your hosting platform:
- `MAIL_USERNAME`: Your Gmail address
- `MAIL_PASSWORD`: The 16-character app password you generated

### Step 4: Update application.properties (Already Done)

The `application.properties` file has been updated with the Gmail SMTP configuration:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:your-email@gmail.com}
spring.mail.password=${MAIL_PASSWORD:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

## Database Migration

The system requires a new table for storing OTPs. Run your Spring Boot application, and it will automatically create the `email_otps` table due to `spring.jpa.hibernate.ddl-auto=update`.

Alternatively, you can manually create the table:

```sql
CREATE TABLE email_otps (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE
);

-- Add index for faster lookups
CREATE INDEX idx_email_otps_email ON email_otps(email);
```

Also, add the `email_verified` column to the users table:

```sql
ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;
```

## How It Works

### Registration Flow:

1. **User fills registration form** → Enters name, email, password, and phone
2. **Click "Create Account"** → System sends OTP to user's email
3. **Email Verification Screen** → User enters the 6-digit OTP
4. **OTP Verified** → User account is created with `email_verified = true`
5. **Welcome Email** → System sends a welcome email to the user
6. **Redirect to Home** → User is logged in and redirected to the medicines page

### API Endpoints:

1. **POST /api/auth/send-otp** - Send OTP to email
   ```json
   {
     "email": "user@example.com",
     "name": "John Doe"
   }
   ```

2. **POST /api/auth/verify-otp** - Verify OTP
   ```json
   {
     "email": "user@example.com",
     "otp": "123456"
   }
   ```

3. **POST /api/auth/register-verified** - Complete registration after email verification
   ```json
   {
     "name": "John Doe",
     "email": "user@example.com",
     "password": "password123",
     "phone": "+91-9876543210"
   }
   ```

## Testing

### Local Testing:

1. **Start Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Registration:**
   - Go to http://localhost:5173/register
   - Fill in the registration form
   - Click "Create Account"
   - Check your email for the OTP
   - Enter the OTP and click "Verify Email"
   - You should be registered and redirected to the medicines page

### Testing Email Sending:

You can test if emails are being sent correctly by checking your Gmail's **Sent** folder after a registration attempt.

## Features

✅ **6-digit OTP** - Random, secure OTP generation
✅ **10-minute expiry** - OTPs expire after 10 minutes
✅ **Email validation** - Prevents duplicate registrations
✅ **Resend OTP** - Users can request a new OTP after 60 seconds
✅ **Welcome email** - Sent after successful verification
✅ **Beautiful UI** - Modern, responsive email verification interface
✅ **Countdown timer** - Shows remaining time for resend

## Security Considerations

- OTPs are stored in the database and marked as verified after use
- Expired OTPs are rejected
- Only the latest OTP is valid for a given email
- Old OTPs are deleted after successful registration
- Passwords are hashed using BCrypt before storage
- Email verification prevents automated bot registrations

## Troubleshooting

### Email not sending:
- Check if `MAIL_USERNAME` and `MAIL_PASSWORD` are correctly set
- Verify that you're using the App Password, not your regular Gmail password
- Check if 2-Factor Authentication is enabled on your Google account
- Look at the backend logs for any error messages

### OTP not working:
- OTP expires after 10 minutes - request a new one if expired
- Ensure you're entering the exact OTP from the email
- Check if the email address matches

### Database errors:
- Ensure the `email_otps` table exists
- Ensure the `email_verified` column exists in the `users` table
- Check database connection settings

## Production Deployment

### Backend (Render/Railway/Heroku):

1. Add environment variables:
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`

2. Ensure the database is accessible

3. Deploy the application

### Frontend (Vercel):

1. Update the API URL in `EmailVerification.tsx` and `Register.tsx`:
   - Change `http://localhost:8080` to your production backend URL

2. Deploy the application

## Free Tier Limits

Gmail SMTP has the following limits:
- **500 emails per day** for regular Gmail accounts
- **2000 emails per day** for Google Workspace accounts

For higher volumes, consider:
- SendGrid (12,000 emails/month free)
- Mailgun (5,000 emails/month free)
- Amazon SES (62,000 emails/month free)

## Support

If you encounter any issues, check:
1. Backend logs for error messages
2. Browser console for frontend errors
3. Email spam/junk folder
4. Environment variables are correctly set

---

**Note:** Keep your Gmail App Password secure and never commit it to version control!
