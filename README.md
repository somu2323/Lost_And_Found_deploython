# KLH Lost & Found Platform

A comprehensive Lost and Found platform exclusively for KLH University students, built with Next.js, MongoDB, and Google OAuth authentication.

## Features

- 🔐 **Secure Authentication**: Google OAuth restricted to @klh.edu.in email addresses
- 📝 **Post Lost Items**: Students can report lost items with descriptions, images, and location details
- 🔍 **Search & Filter**: Advanced search and filtering by category, status, and keywords
- 🏷️ **Claim Items**: Students can claim lost items found by others
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ☁️ **Cloud Storage**: Images stored securely using Cloudinary
- 🚀 **Live Deployment**: Deployed on Vercel for optimal performance

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, TypeScript
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Google OAuth 2.0
- **Image Storage**: Cloudinary
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (Atlas recommended)
- Google OAuth credentials
- Cloudinary account for image storage

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd klh-lost-found
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-domain.vercel.app/api/auth/callback/google` (for production)

4. **Setup MongoDB**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get the connection string
   - Add your IP address to the whitelist

5. **Setup Cloudinary**
   - Create a Cloudinary account
   - Get your cloud name, API key, and API secret from the dashboard

6. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all the required values

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   - Navigate to `http://localhost:3000`

## Deployment on Vercel

### Automatic Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Import the project in Vercel dashboard
   - Connect your GitHub repository

2. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add all the environment variables from your `.env.local`
   - Update `NEXTAUTH_URL` to your Vercel domain

3. **Update Google OAuth**
   - Add your Vercel domain to Google OAuth authorized redirect URIs
   - `https://your-project.vercel.app/api/auth/callback/google`

4. **Deploy**
   - Vercel will automatically deploy your application
   - Your app will be live at `https://your-project.vercel.app`

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts to configure your deployment
```

## Project Structure

```
klh-lost-found/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── items/
│   │   │   └── upload/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── post-item/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── AuthProvider.tsx
│   ├── lib/
│   │   └── mongodb.ts
│   └── models/
│       ├── User.ts
│       └── LostItem.ts
├── .env.local
├── .env.example
├── package.json
├── vercel.json
└── README.md
```

## API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Items
- `GET /api/items` - Get all lost items (with filters)
- `POST /api/items` - Create new lost item
- `GET /api/items/[id]` - Get specific item
- `PUT /api/items/[id]` - Update item (claim)
- `DELETE /api/items/[id]` - Delete item

### Upload
- `POST /api/upload` - Upload images to Cloudinary

## Usage

### For Students

1. **Sign In**: Use your @klh.edu.in Google account
2. **Report Lost Item**: Click "Report Lost Item" and fill in details
3. **Browse Items**: View all posted lost items
4. **Search**: Use filters and search to find specific items
5. **Claim Item**: Click "Claim Item" if you've found someone's lost item

### Features

- **Categories**: Electronics, Clothing, Books, Accessories, Documents, Sports, Other
- **Status Tracking**: Lost, Found, Claimed
- **Image Support**: Upload multiple images per item
- **Contact Information**: Secure contact details for item recovery

## Security Features

- Email restriction to @klh.edu.in domain only
- Secure session management with NextAuth.js
- Protected API routes requiring authentication
- Input validation and sanitization
- Secure image upload with Cloudinary

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support or questions, please contact the development team or create an issue in the repository.

## License

This project is licensed under the MIT License.
