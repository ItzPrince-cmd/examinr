# Next Steps to Enable User Registration

## 1. Set Up MongoDB Atlas

Follow the instructions in `MONGODB_ATLAS_SETUP.md` to:
1. Create a free MongoDB Atlas account
2. Set up a free M0 cluster
3. Create a database user
4. Configure network access
5. Get your connection string

## 2. Update Your .env File

Once you have your MongoDB Atlas connection string:

```bash
# Edit the backend .env file
cd backend
nano .env  # or use your preferred editor
```

Replace the MONGODB_URI line with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.xxxxx.mongodb.net/examinr?retryWrites=true&w=majority
```

## 3. Test the Connection

Run the test script to verify your connection:
```bash
cd backend
node scripts/test-mongodb-connection.js
```

You should see:
```
✅ Successfully connected to MongoDB!
✅ Successfully wrote to database!
✅ Connection closed successfully!
```

## 4. Restart the Backend

The backend should automatically restart when you save the .env file. If not:
```bash
# Kill the current process
pkill -f "node server.js"

# Restart the backend
npm run dev
```

## 5. Test User Registration

1. Open http://localhost:3000 in your browser
2. Click "Register" or "Sign Up"
3. Fill in the registration form:
   - Name: Your Name
   - Email: your.email@example.com
   - Role: Student or Teacher
   - Password: (at least 6 characters)
4. Submit the form

If successful, you'll be:
- Automatically logged in
- Redirected to the dashboard
- See a success message

## 6. Verify in MongoDB Atlas

1. Go to your MongoDB Atlas dashboard
2. Click "Browse Collections" on your cluster
3. You should see:
   - Database: `examinr`
   - Collection: `users`
   - Your newly created user document

## Troubleshooting

If registration fails:

1. **Check the browser console** (F12 → Console tab)
2. **Check the backend logs** in the terminal running the backend
3. **Verify your MongoDB URI** is correct in the .env file
4. **Ensure network access** is configured in Atlas (0.0.0.0/0 for development)

Common issues:
- Wrong password in connection string
- Database user not created
- IP address not whitelisted
- Typo in the connection string

## What's Working Now

With MongoDB Atlas connected:
- ✅ User registration
- ✅ User login/logout
- ✅ JWT authentication
- ✅ Protected routes
- ✅ User profile access
- ✅ Role-based access (Student/Teacher/Admin)

## Ready to Build More Features!

Once registration is working, you can:
- Create courses
- Add exams and questions
- Implement the exam-taking functionality
- Add results and analytics
- And much more!