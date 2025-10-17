# Quick Email Setup for KLH Lost & Found

## Important: You need to configure your Gmail credentials for email notifications to work!

### Step 1: Setup Gmail App Password

1. Go to your Gmail account settings
2. Enable 2-Factor Authentication if not already enabled
3. Generate an "App Password" for the Lost & Found platform
4. Copy the 16-character password (like: `abcd efgh ijkl mnop`)

### Step 2: Update .env.local

Replace these values in your .env.local file:

```env
# Email Configuration (Gmail)
EMAIL_USER=your_actual_gmail@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password_here
```

### Step 3: Test the Feature

1. Post a lost item using one email account
2. Use another @klh.edu.in account to claim it
3. Check if the original poster receives an email notification

## How It Works

When someone finds a lost item:
1. The finder clicks "I Found This Item" 
2. The system automatically sends an email to the original poster
3. The email contains:
   - Finder's contact information
   - Item details
   - Safety tips for meetup
   - Link back to the platform

## Email Template Features

✅ Professional design with KLH branding
✅ Complete finder contact information  
✅ Item details and location
✅ Safety instructions for item exchange
✅ Mobile-responsive HTML template
✅ Clear call-to-action buttons

## Production Deployment

When deploying to Render, add these environment variables:
- EMAIL_USER=your_gmail@gmail.com  
- EMAIL_APP_PASSWORD=your_app_password

**Note:** Email notifications will only work after you configure your Gmail credentials!