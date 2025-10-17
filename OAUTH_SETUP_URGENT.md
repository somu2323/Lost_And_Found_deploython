# 🚨 URGENT: Google OAuth Setup Required

## Your 400 error is likely because Google OAuth is not configured!

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

### Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Configure the consent screen:
   - Application name: "KLH Lost & Found"
   - User support email: your email
   - Developer contact: your email
4. Create OAuth client:
   - Application type: "Web application"
   - Name: "KLH Lost Found"
   - Authorized redirect URIs:
     ```
     https://your-vercel-domain.vercel.app/api/auth/callback/google
     http://localhost:3000/api/auth/callback/google
     ```

### Step 3: Get Your Credentials

After creating, you'll get:
- Client ID (looks like: 123456789-abcdefg.apps.googleusercontent.com)
- Client Secret (looks like: GOCSPX-abcdefghijklmnop)

### Step 4: Update Your Environment Variables

Replace these in your .env.local:
```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### Step 5: Update NEXTAUTH_URL

Replace this in your .env.local:
```env
NEXTAUTH_URL=https://your-actual-vercel-domain.vercel.app
```

## Quick Test

After updating, redeploy to Vercel and test the login flow.

## Alternative: Test Locally First

1. Set NEXTAUTH_URL=http://localhost:3000
2. Test locally with `npm run dev`
3. Then deploy to Vercel

## Current Issue
Your Google OAuth credentials are still placeholders:
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

This causes the 400 error when trying to authenticate!