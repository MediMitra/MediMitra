# Google OAuth Setup Guide for MediMitra

This guide will help you set up Google Sign-In/Sign-Up for the MediMitra application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "MediMitra")
5. Click "Create"

## Step 2: Enable Google+ API (Optional but recommended)

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on it and enable it

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (or "Internal" if using Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - **App name**: MediMitra
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click "Save and Continue"
6. On the "Scopes" page, click "Add or Remove Scopes"
7. Add these scopes:
   - `email`
   - `profile`
   - `openid`
8. Click "Save and Continue"
9. Add test users if in testing mode
10. Click "Save and Continue" and then "Back to Dashboard"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name (e.g., "MediMitra Web Client")
5. Add **Authorized JavaScript origins**:
   - `http://localhost:5173` (for local development)
   - `http://localhost:3000` (alternative local port)
   - `https://your-production-domain.com` (your production URL)
   - `https://medi-mitra-omega.vercel.app` (if using Vercel)
6. Add **Authorized redirect URIs**:
   - `http://localhost:5173/auth/google/callback`
   - `https://your-production-domain.com/auth/google/callback`
   - `https://medi-mitra-omega.vercel.app/auth/google/callback`
7. Click "Create"
8. **Copy the Client ID** - you'll need this!

## Step 5: Configure the Application

### Frontend Configuration

Create a `.env` file in the `frontend` directory (copy from `.env.example`):

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

Or update the existing `.env` file with your Google Client ID.

### Backend Configuration

Add the Google Client ID to your environment variables:

**For local development**, add to `application.properties`:
```properties
google.client.id=your-google-client-id-here.apps.googleusercontent.com
```

**For production (Render/Heroku/etc.)**, set the environment variable:
```
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

## Step 6: Install Dependencies

### Frontend
```bash
cd frontend
npm install @react-oauth/google
```

### Backend
The Google API client dependency has been added to `pom.xml`. Run:
```bash
cd backend
mvn clean install
```

## Step 7: Test the Integration

1. Start the backend server:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `http://localhost:5173/login-user` or `http://localhost:5173/register`

4. Click the "Sign in with Google" or "Sign up with Google" button

5. Complete the Google authentication flow

## How It Works

### User Flow

1. **New User (Sign Up with Google)**:
   - User clicks "Sign up with Google"
   - Google OAuth popup appears
   - User authorizes the application
   - User's Google profile data (name, email, profile picture) is retrieved
   - If phone number is not available, user is prompted to enter it
   - Account is created automatically
   - User is logged in and redirected to the medicines page

2. **Existing User (Sign In with Google)**:
   - User clicks "Sign in with Google"
   - Google OAuth popup appears
   - User authorizes the application
   - System checks if user exists by Google ID or email
   - If found, user is logged in
   - If not found, account is created automatically (auto sign-up)
   - User is redirected to the medicines page

3. **Existing Email User Links Google Account**:
   - If a user registered with email/password first
   - Then tries to sign in with Google using the same email
   - The Google account is linked to their existing account
   - All previous data is preserved

### Data Retrieved from Google

- **Name**: User's full name
- **Email**: User's email address
- **Profile Picture**: URL to user's Google profile picture
- **Google ID**: Unique identifier for the Google account

### Phone Number Handling

- Google does not provide phone numbers through standard OAuth
- If a user signs up with Google and has no phone number:
  - A modal prompts them to enter their phone number
  - They can skip this step if they prefer
  - They can add their phone number later in their profile

## Security Considerations

1. **Token Verification**: Google ID tokens are verified on the backend using Google's official library
2. **Client ID Validation**: The token is validated against your specific Client ID
3. **HTTPS Required**: In production, always use HTTPS
4. **Environment Variables**: Never commit your Client ID to version control for production

## Troubleshooting

### "Invalid Client ID" Error
- Make sure the Client ID is correctly configured in both frontend and backend
- Check that the authorized origins match your current URL

### "Popup Blocked" Error
- The user's browser may be blocking popups
- Ensure the popup is triggered by a user action (click)

### "redirect_uri_mismatch" Error
- Add the exact URI to your authorized redirect URIs in Google Cloud Console
- Make sure there are no trailing slashes or differences in http/https

### Token Verification Fails
- Ensure the backend has the correct Google Client ID
- Check that the `google-api-client` dependency is properly installed

## Production Deployment

When deploying to production:

1. Add your production domain to authorized JavaScript origins
2. Add your production callback URL to authorized redirect URIs
3. Set the `GOOGLE_CLIENT_ID` environment variable on your hosting platform
4. Set the `VITE_GOOGLE_CLIENT_ID` environment variable for the frontend build
5. Ensure HTTPS is enabled

## Support

If you encounter any issues:
1. Check the browser console for frontend errors
2. Check the backend logs for token verification errors
3. Verify all environment variables are set correctly
4. Ensure the OAuth consent screen is properly configured
