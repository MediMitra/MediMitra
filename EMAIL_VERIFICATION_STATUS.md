# Email Verification Feature - Current Status

## ✅ Completed Tasks

### Backend Implementation
1. **Email Service** (`EmailService.java`)
   - Gmail SMTP integration configured
   - Sends OTP emails and welcome emails
   - Uses app password: `mgmzqmduvbjoutzw`

2. **Database Entities**
   - `EmailOtp.java` - Stores OTP records with 10-minute expiry
   - `User.java` - Added `emailVerified` field

3. **API Endpoints** (renamed to avoid ad blockers)
   - `POST /api/auth/send-code` - Send OTP to email
   - `POST /api/auth/verify-code` - Verify OTP
   - `POST /api/auth/register-verified` - Register user with verified email

4. **Configuration**
   - `EmailConfig.java` - JavaMailSender bean configuration
   - `application.properties` - Gmail SMTP settings
   - Environment variables: `MAIL_USERNAME`, `MAIL_PASSWORD`

### Frontend Implementation
1. **Components**
   - `EmailVerification.tsx` - 6-digit OTP input component
   - Updated `Register.tsx` to integrate email verification flow

2. **API Client**
   - Centralized `api.ts` with production backend URL
   - All components now use `authAPI` methods (no more localhost references)

3. **Production URL Configuration**
   - Backend URL: `https://medimitra-backend-xws5.onrender.com/api`
   - All components updated to use production URL

---

## ⏳ Pending Actions

### 1. Run Database Migration (REQUIRED)
You need to run the database migration script in Supabase to create the necessary tables and columns.

**Steps:**
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Open the file: `backend/email_verification_migration.sql`
4. Copy the entire content
5. Paste it into Supabase SQL Editor
6. Click "Run" to execute the migration

**What the migration does:**
- Adds `email_verified` column to `users` table
- Creates `email_otps` table for storing OTPs
- Creates indexes for faster lookups

### 2. Deploy Updated Frontend to Vercel
The frontend code has been updated to use the production backend URL. Deploy the changes:

```bash
cd frontend
git add .
git commit -m "Fix: Use production API URL for email verification"
git push
```

Vercel should automatically deploy the new changes.

### 3. Verify Email Settings in Render
Ensure the environment variables are set in Render dashboard:

- `MAIL_USERNAME` = `dheerajsinghnew1@gmail.com`
- `MAIL_PASSWORD` = `mgmzqmduvbjoutzw`

---

## 🧪 Testing Checklist

After running the migration and deploying:

1. **Test Registration Flow:**
   - Go to your Vercel website
   - Navigate to Registration page
   - Enter user details with a valid email
   - Check if OTP is sent to email
   - Enter the 6-digit OTP
   - Verify registration completes successfully

2. **Check Console for Errors:**
   - Open browser DevTools (F12)
   - Look for any `ERR_CONNECTION_REFUSED` or localhost errors
   - All API calls should go to `https://medimitra-backend-xws5.onrender.com`

3. **Verify Database:**
   - Check Supabase to confirm:
     - New users have `email_verified = true`
     - OTPs are stored in `email_otps` table
     - Old OTPs are properly expired

---

## 🔧 Troubleshooting

### Issue: "Failed to send email"
**Cause:** Database schema not updated
**Solution:** Run the migration script in Supabase (see Pending Actions #1)

### Issue: "ERR_CONNECTION_REFUSED" or localhost errors
**Cause:** Frontend using old code with localhost references
**Solution:** Deploy the updated frontend code to Vercel (see Pending Actions #2)

### Issue: Ad blocker blocking requests
**Cause:** Ad blocker extensions blocking `/send-otp` endpoints
**Solution:** Already fixed - endpoints renamed to `/send-code` and `/verify-code`

### Issue: Gmail not sending emails
**Possible causes:**
1. App password incorrect - Verify in Render environment variables
2. Gmail daily limit exceeded (500 emails/day for free tier)
3. Email blocked by Gmail - Check Gmail security settings

---

## 📝 How It Works

### Registration Flow:
1. User fills registration form
2. User submits form
3. Backend generates 6-digit OTP
4. Backend sends OTP to user's email via Gmail SMTP
5. Frontend shows OTP input modal
6. User enters OTP from email
7. Backend verifies OTP (valid for 10 minutes)
8. If valid, user is registered with `email_verified = true`
9. Welcome email sent to user
10. User is redirected to medicines page

### Gmail SMTP Configuration:
- **Host:** smtp.gmail.com
- **Port:** 587 (STARTTLS)
- **Username:** dheerajsinghnew1@gmail.com
- **App Password:** mgmzqmduvbjoutzw
- **Free Tier:** 500 emails/day

---

## 📁 Modified Files

### Backend
- `src/main/java/com/medimitra/service/EmailService.java` (NEW)
- `src/main/java/com/medimitra/config/EmailConfig.java` (NEW)
- `src/main/java/com/medimitra/model/EmailOtp.java` (NEW)
- `src/main/java/com/medimitra/repository/EmailOtpRepository.java` (NEW)
- `src/main/java/com/medimitra/dto/SendOtpRequest.java` (NEW)
- `src/main/java/com/medimitra/dto/VerifyOtpRequest.java` (NEW)
- `src/main/java/com/medimitra/dto/OtpResponse.java` (NEW)
- `src/main/java/com/medimitra/model/User.java` (MODIFIED)
- `src/main/java/com/medimitra/service/AuthService.java` (MODIFIED)
- `src/main/java/com/medimitra/controller/AuthController.java` (MODIFIED)
- `src/main/resources/application.properties` (MODIFIED)
- `pom.xml` (MODIFIED - added spring-boot-starter-mail)

### Frontend
- `src/components/EmailVerification.tsx` (NEW)
- `src/pages/auth/Register.tsx` (MODIFIED)
- `src/api/api.ts` (MODIFIED - added OTP methods)

### Database
- `backend/email_verification_migration.sql` (NEW - needs to be run)

---

## 🎯 Next Steps

1. ✅ **Run database migration in Supabase** (see Pending Actions #1)
2. ✅ **Deploy frontend changes to Vercel** (see Pending Actions #2)
3. ✅ **Test registration flow** (see Testing Checklist)
4. ✅ **Monitor logs** - Check Render logs for any email sending errors

---

## 🆘 Need Help?

If you encounter any issues:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify environment variables in Render
4. Ensure database migration was successful in Supabase
5. Test with a real email address to receive OTP
