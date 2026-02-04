# 🔧 QUICK FIX: Email Not Sending on Render/Vercel

## The Problem
```
❌ Failed to send OTP: Mail server connection failed
MailConnectException: Couldn't connect to host, port: smtp.gmail.com, 587; timeout 5000
```

## The Solution

### 1. Update Backend Configuration

Edit `backend/src/main/resources/application.properties`:

**CHANGE THIS:**
```properties
spring.mail.port=587
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=30000
spring.mail.properties.mail.smtp.timeout=30000
```

**TO THIS:**
```properties
spring.mail.port=465
spring.mail.properties.mail.smtp.ssl.enable=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com
spring.mail.properties.mail.smtp.connectiontimeout=60000
spring.mail.properties.mail.smtp.timeout=60000
spring.mail.properties.mail.smtp.writetimeout=60000
```

### 2. Verify Environment Variables on Render

Go to Render Dashboard → Your Service → Environment

Check these variables:
```env
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=abcdefghijklmnop  ← 16 digits, NO SPACES
```

### 3. Redeploy

```bash
git add .
git commit -m "Fix email configuration for Render"
git push
```

Render will auto-deploy in 5-10 minutes.

### 4. Test

1. Go to your Vercel app
2. Try to register a new user
3. Check email for verification link
4. ✅ SUCCESS!

---

## Why This Works

| Issue | Port 587 (STARTTLS) | Port 465 (SSL) |
|-------|---------------------|----------------|
| **Render Support** | ❌ Often blocked | ✅ Works |
| **Vercel Support** | ❌ Often blocked | ✅ Works |
| **Security** | ⚠️ Upgrades connection | ✅ Encrypted from start |
| **Timeout Issues** | ❌ Common | ✅ Rare |

Cloud platforms block port 587 to prevent spam. Port 465 with SSL is the recommended solution.

---

## Still Not Working?

### Check Gmail Setup

1. **2FA Enabled?**
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **App Password Generated?**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Generate new password for "Mail"
   - Copy all 16 characters (remove spaces)
   - Update `MAIL_PASSWORD` on Render

3. **Less Secure Apps?**
   - NOT needed if using App Password
   - App Passwords are more secure

### Check Render Logs

1. Render Dashboard → Logs
2. Look for:
   ```
   ✅ "Email sent successfully"
   ❌ "Authentication failed" → Wrong password
   ❌ "Connection timeout" → Check port/SSL settings
   ```

### Test Email from Render Shell

1. Render Dashboard → Shell
2. Run:
   ```bash
   curl -v telnet://smtp.gmail.com:465
   ```
3. Should connect successfully

---

## Quick Checklist

- [ ] Port changed to `465` in application.properties
- [ ] SSL enabled (not STARTTLS)
- [ ] Timeout values set to `60000`
- [ ] `MAIL_PASSWORD` has no spaces (16 digits)
- [ ] Gmail 2FA enabled
- [ ] Valid App Password generated
- [ ] Code committed and pushed
- [ ] Render redeployed
- [ ] Tested registration flow

---

## Need Help?

See full deployment guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

Or check detailed troubleshooting in: [README.md](README.md#-known-issues--troubleshooting)
