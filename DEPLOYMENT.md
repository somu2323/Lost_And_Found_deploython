# KLH Lost & Found - Deployment Guide

## Quick Setup Steps

### 1. Environment Setup

Before deploying, you need to set up the following services:

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account and cluster
3. Get your connection string
4. Add your IP to the whitelist (or use 0.0.0.0/0 for all IPs)

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add these redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google` (production)

#### Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your cloud name, API key, and API secret from dashboard

### 2. Local Development

1. Clone and setup:
```bash
cd klh-lost-found
npm install
```

2. Create `.env.local` with your credentials:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/klh-lost-found
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

3. Run development server:
```bash
npm run dev
```

### 3. Deploy to Vercel

#### Option A: Automatic Deployment (Recommended)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy!

#### Option B: Manual Deployment
```bash
npm install -g vercel
vercel
```

### 4. Post-Deployment

1. Update Google OAuth redirect URI to include your Vercel domain
2. Test the application with a @klh.edu.in email address
3. Verify all functionality works

## Key Features Implemented

✅ **Authentication**: Google OAuth restricted to @klh.edu.in emails
✅ **Lost Item Management**: Post, view, search, and claim items
✅ **Image Upload**: Cloudinary integration for item photos
✅ **Responsive Design**: Works on desktop and mobile
✅ **Database**: MongoDB with proper schemas
✅ **Security**: Protected routes and input validation

## Architecture

- **Frontend**: Next.js 15 with React and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Google provider
- **File Storage**: Cloudinary for images
- **Deployment**: Vercel

## Live URL
After deployment, your app will be available at:
`https://your-project-name.vercel.app`

## Support
If you encounter any issues during deployment, check:
1. Environment variables are correctly set
2. Google OAuth redirect URIs include your domain
3. MongoDB IP whitelist includes your deployment IPs
4. All required environment variables are present

## Security Features
- Email domain restriction (@klh.edu.in only)
- Protected API routes
- Secure session management
- Input validation and sanitization
- Secure image upload handling