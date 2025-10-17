# Quick Cloudinary Setup

## Step 1: Create Free Cloudinary Account
1. Go to https://cloudinary.com/
2. Sign up for free account
3. Verify your email

## Step 2: Get Your Credentials
After login, go to Dashboard and copy:
- Cloud Name
- API Key  
- API Secret

## Step 3: Update .env.local
Replace these values:
```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## Step 4: Test
Upload feature will work once these are configured!