# MongoDB Atlas Setup Guide for Examinr

## Steps to Set Up MongoDB Atlas:

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" and create an account
3. Verify your email address

### 2. Create a New Cluster
1. After login, click "Build a Database"
2. Choose the FREE "Shared" tier (M0 Sandbox)
3. Select your preferred cloud provider and region (choose one close to you)
4. Name your cluster (e.g., "examinr-cluster")
5. Click "Create Cluster" (takes 1-3 minutes)

### 3. Set Up Database Access
1. Go to "Security" → "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username (e.g., "examinr-admin")
5. Generate a secure password (save this!)
6. Under "Database User Privileges", select "Read and write to any database"
7. Click "Add User"

### 4. Set Up Network Access
1. Go to "Security" → "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: For production, you should restrict to specific IPs
4. Click "Confirm"

### 5. Get Your Connection String
1. Go to "Deployment" → "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver and version 4.1 or later
5. Copy the connection string, it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster-name.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Prepare Your Connection String
Replace the placeholders in the connection string:
- `<username>`: Your database username (e.g., "examinr-admin")
- `<password>`: Your database password
- Add your database name after the host (before the ?):
  ```
  mongodb+srv://examinr-admin:YourPassword@cluster-name.xxxxx.mongodb.net/examinr?retryWrites=true&w=majority
  ```

## Example .env Configuration

```env
MONGODB_URI=mongodb+srv://examinr-admin:YourSecurePassword123@examinr-cluster.abcde.mongodb.net/examinr?retryWrites=true&w=majority
```

## Important Security Notes:
1. Never commit your actual MongoDB URI to version control
2. Use strong passwords
3. For production, restrict network access to specific IPs
4. Enable additional security features like IP whitelisting and VPC peering for production use