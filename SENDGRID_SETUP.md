# 📧 SendGrid Setup for Production Email

## Why SendGrid?

**Render's free tier blocks Gmail SMTP** (ports 587, 465, 25) to prevent spam abuse. This is why your emails work locally but fail in production with:
```
MailConnectException: Couldn't connect to host, port: smtp.gmail.com, 465; timeout 5000
```

**SendGrid** is a transactional email service that works with Render and offers:
- ✅ **100 emails/day FREE** tier
- ✅ Works on Render/Vercel free tier
- ✅ Better deliverability than Gmail
- ✅ Email analytics and tracking
- ✅ No port blocking issues

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create SendGrid Account

1. Go to [https://sendgrid.com/pricing/](https://sendgrid.com/pricing/)
2. Click **"Try for Free"**
3. Sign up with your email
4. Verify your email address

### Step 2: Create API Key

1. Log in to SendGrid Dashboard
2. Go to **Settings** → **API Keys** (left sidebar)
3. Click **"Create API Key"**
4. Configure:
   - **API Key Name:** `MediMitra Backend`
   - **API Key Permissions:** `Full Access` (or `Mail Send` only)
5. Click **"Create & View"**
6. **⚠️ IMPORTANT:** Copy the API key NOW (you won't see it again!)
   ```
   SG.abc123xyz789...
   ```

### Step 3: Verify Sender Identity

**Option A: Single Sender Verification** (Easiest for free tier)

1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in your details:
   - **From Name:** MediMitra
   - **From Email Address:** your-email@gmail.com
   - **Reply To:** your-email@gmail.com
   - **Company Address:** Your address
4. Click **"Create"**
5. Check your email and click verification link
6. ✅ Status should change to "Verified"

**Option B: Domain Authentication** (Better deliverability, requires domain)

1. Go to **Settings** → **Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Follow DNS setup instructions
4. Use for production with custom domain

### Step 4: Update Render Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your **medimitra-backend** service
3. Go to **Environment** tab
4. Update these variables:

```env
# SendGrid Configuration
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.your-sendgrid-api-key-here

# Sender Email (must be verified in SendGrid)
MAIL_FROM=your-email@gmail.com

# Optional
MAIL_DEBUG=false
```

**⚠️ CRITICAL:**
- `MAIL_USERNAME` must be literally `apikey` (not your email!)
- `MAIL_PASSWORD` is your SendGrid API key (starts with `SG.`)
- `MAIL_FROM` must match the email you verified in SendGrid

5. Click **"Save Changes"**
6. Render will automatically redeploy (~5 minutes)

### Step 5: Update EmailService.java (If Needed)

The `EmailService.java` should use the verified sender email:

```java
private String fromEmail = System.getenv().getOrDefault("MAIL_FROM", "your-email@gmail.com");
```

If you need to update it, I can help you modify the file.

### Step 6: Test

1. Wait for Render to finish redeploying
2. Go to your Vercel app
3. Try to register a new user
4. Check email inbox for verification email
5. ✅ SUCCESS!

---

## 🧪 Testing Locally with Gmail

For local development, you can still use Gmail:

Create `backend/.env.local`:
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-digit-app-password
MAIL_FROM=your-email@gmail.com
```

Or keep using your existing Gmail setup - it works fine locally!

---

## 📊 Monitor Email Delivery

### SendGrid Dashboard

1. Go to **Activity** → **Email Activity**
2. See all sent emails with status:
   - ✅ Delivered
   - 📬 Processed
   - ❌ Bounced
   - 🚫 Dropped

### Check Logs

**Render Logs:**
```bash
# Look for:
✅ "Email sent successfully to user@example.com"
❌ "Failed to send email: ..."
```

**SendGrid Activity Feed:**
- Real-time email status
- Bounce notifications
- Spam reports

---

## 🔧 Troubleshooting

### Issue: "550 Unauthenticated senders not allowed"

**Solution:**
- Verify sender email in SendGrid dashboard
- Check `MAIL_FROM` matches verified email
- Wait 5 minutes for verification to propagate

### Issue: "Invalid API key"

**Solution:**
- Check `MAIL_USERNAME=apikey` (literally)
- Verify `MAIL_PASSWORD` starts with `SG.`
- Regenerate API key if needed

### Issue: "Connection timeout"

**Solution:**
- Check `MAIL_HOST=smtp.sendgrid.net` (no typos)
- Verify `MAIL_PORT=587`
- Ensure `starttls.enable=true`

### Issue: Emails go to spam

**Solution:**
- Use domain authentication instead of single sender
- Add SPF/DKIM records to your domain
- Avoid spam trigger words in subject/body
- SendGrid provides better deliverability than Gmail

---

## 💰 Pricing

### Free Tier
- **100 emails/day** (3,000/month)
- Perfect for development and small apps
- Email analytics included

### Paid Tiers (if you grow)
- **Essentials:** $19.95/month - 50,000 emails/month
- **Pro:** $89.95/month - 100,000 emails/month

For MediMitra's use case, **free tier is sufficient** unless you have 100+ new users daily.

---

## 🔄 Alternative Email Services

If SendGrid doesn't work for you:

### 1. **Mailgun** (Alternative)
- Free: 5,000 emails/month (first 3 months)
- Similar setup to SendGrid
- Good reputation

### 2. **AWS SES** (Amazon)
- $0.10 per 1,000 emails
- Requires AWS account
- More complex setup

### 3. **Resend** (Modern alternative)
- Free: 3,000 emails/month
- Great developer experience
- Easy integration

---

## 📝 Summary Checklist

- [ ] Create SendGrid account
- [ ] Generate API key (save it!)
- [ ] Verify sender email address
- [ ] Update Render environment variables:
  - [ ] `MAIL_HOST=smtp.sendgrid.net`
  - [ ] `MAIL_PORT=587`
  - [ ] `MAIL_USERNAME=apikey`
  - [ ] `MAIL_PASSWORD=SG.your-api-key`
  - [ ] `MAIL_FROM=verified-email@gmail.com`
- [ ] Wait for Render to redeploy
- [ ] Test registration flow
- [ ] Check SendGrid activity feed
- [ ] Celebrate! 🎉

---

## 🆘 Need Help?

1. **SendGrid Support:** [https://support.sendgrid.com](https://support.sendgrid.com)
2. **SendGrid Docs:** [https://docs.sendgrid.com](https://docs.sendgrid.com)
3. **GitHub Issue:** Open issue in your repo with logs

---

## 🎯 Expected Result

After setup:
```
✅ Local: Works with Gmail SMTP
✅ Render: Works with SendGrid
✅ Emails delivered in < 5 seconds
✅ No more timeout errors
✅ Professional email delivery
```

**Happy Emailing! 📧**
