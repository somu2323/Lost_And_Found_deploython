# MongoDB Setup Guide for KLH Lost & Found

## Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://cloud.mongodb.com/
2. Sign up for a free account
3. Choose the free tier (M0 Sandbox - 512 MB storage)

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "M0 FREE" tier
3. Select a cloud provider and region (closest to you)
4. Name your cluster (e.g., "klh-lost-found")
5. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Add Current IP Address"
4. For production: Add "0.0.0.0/0" (allows all IPs - be careful!)
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Databases" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string

It will look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update Your .env.local File
Replace the connection string in your .env.local file:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.xxxxx.mongodb.net/klh-lost-found?retryWrites=true&w=majority
```

## Option 2: Local MongoDB Installation

### For Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run on localhost:27017
4. Use this connection string:
```env
MONGODB_URI=mongodb://localhost:27017/klh-lost-found
```

### For Mac (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### For Linux (Ubuntu):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## Testing Your Connection

After setting up, test your connection by running:

```bash
cd klh-lost-found
npm run dev
```

Then check the console for any MongoDB connection errors.

## Security Best Practices

1. **Never commit .env.local to git** - it's already in .gitignore
2. **Use strong passwords** for database users
3. **Restrict IP access** in production
4. **Use environment-specific databases** (dev, staging, prod)
5. **Regularly rotate database passwords**

## Troubleshooting

### Common Issues:

1. **Connection timeout**: Check network access settings
2. **Authentication failed**: Verify username/password
3. **IP not whitelisted**: Add your IP to Atlas network access
4. **Wrong database name**: Ensure the database name in URI matches your app

### Environment Variables Check:
Make sure your .env.local file has:
```env
MONGODB_URI=your-connection-string-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```