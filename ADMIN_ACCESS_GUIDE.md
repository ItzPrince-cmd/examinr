# Admin Panel Access Guide

## How to Access the Admin Panel

### Step 1: Create Admin User

First, you need to create an admin user in your database. Run this command from the backend directory:

```bash
cd backend
npm run create-admin
```

This will create an admin user with:
- **Email**: `admin@examinr.com`
- **Password**: `TestPass123!`

### Step 2: Start the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

### Step 3: Login as Admin

1. Navigate to `http://localhost:3000/login`
2. Enter the admin credentials:
   - Email: `admin@examinr.com`
   - Password: `TestPass123!`

### Step 4: Access Admin Panel

After logging in, you will be redirected to the admin dashboard. You can access:

- **Regular Admin Dashboard**: `/admin/dashboard`
- **Mission Control Panel**: `/admin/mission-control` (New powerful admin interface)

## Admin Panel Features

### Mission Control Panel (`/admin/mission-control`)

The new admin panel includes:

1. **Command Bridge** - System health monitoring
   - Real-time server status
   - User activity streams
   - Database metrics
   - Live activity feed

2. **Question Bank Mastery** - Advanced question management
   - Bulk upload with drag-and-drop
   - 3D topic hierarchy visualization
   - AI-powered quality control
   - Advanced search and filtering

3. **User Management** - Comprehensive user control
   - Virtual scrolling for thousands of users
   - Radial quick actions menu
   - User insights and analytics
   - Intervention tools

4. **Financial Center** - Revenue tracking
   - Real-time revenue counter
   - Transaction monitoring
   - Subscription analytics
   - Payment failure alerts

5. **Configuration** - Platform settings
   - Feature flags with rollout percentages
   - Email template editor
   - System maintenance mode
   - Update deployment

## Keyboard Shortcuts

- `⌘K` or `Ctrl+K` - Open command palette
- `⌘1` to `⌘5` - Quick navigate between sections
- `ESC` - Close modals/palettes

## Troubleshooting

### Can't Login?

1. Make sure MongoDB is running:
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Or if using Docker
docker ps | grep mongo
```

2. Verify the admin user exists:
```bash
cd backend
node scripts/test-admin-login.js
```

3. Reset admin password if needed:
```bash
cd backend
node scripts/reset-admin-password.js
```

### Page Not Found?

Make sure you're using the correct URL:
- Login: `http://localhost:3000/login`
- Admin Dashboard: `http://localhost:3000/admin/dashboard`
- Mission Control: `http://localhost:3000/admin/mission-control`

### Permission Denied?

The PrivateRoute component checks for:
1. User authentication (JWT token)
2. User role === 'admin'

If you see permission errors, check:
- Your JWT token is valid
- The user role in the database is set to 'admin'

## Security Notes

1. **Change Default Password**: After first login, change the default password
2. **Enable 2FA**: Go to Configuration > Security Settings
3. **IP Whitelisting**: Consider enabling for production
4. **Audit Logs**: All admin actions are logged

## Development Tips

1. The admin panel uses virtual scrolling for performance with large datasets
2. All data updates happen in real-time using polling/websockets
3. The UI is fully responsive and works on tablets
4. Use the command palette for quick navigation

## Need Help?

Check the following files for more details:
- `/frontend/src/pages/admin/AdminMissionControl.tsx` - Main admin interface
- `/frontend/src/contexts/AuthContext.tsx` - Authentication logic
- `/backend/controllers/authController.js` - Login endpoint
- `/backend/middleware/auth.js` - JWT verification