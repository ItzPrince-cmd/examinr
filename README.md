# Examinr - Modern Educational Platform

Examinr is a comprehensive MERN stack educational platform designed for online learning and assessment. It provides features for course management, exam creation, real-time assessments, and performance tracking.

## Features

- **User Authentication**: Secure JWT-based authentication with role-based access control (Student, Teacher, Admin)
- **Course Management**: Create, manage, and enroll in educational courses
- **Exam System**: Create and take timed exams with various question types
- **Real-time Features**: Live exam monitoring using Socket.io
- **Performance Analytics**: Track progress and view detailed performance metrics
- **Responsive Design**: Mobile-friendly interface built with Material-UI
- **RESTful API**: Well-structured backend API with Express.js
- **Security**: Implemented with best practices including rate limiting, CORS, and Helmet.js

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- React Router v6
- React Query / TanStack Query
- React Hook Form
- Socket.io Client
- Axios
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io
- Redis (optional caching)
- Bcrypt.js
- Express Validator

### DevOps
- Docker & Docker Compose
- Nginx (reverse proxy)
- Git

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)
- Redis (optional)
- Docker & Docker Compose (for containerized setup)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/examinr.git
cd examinr
```

### 2. Environment Setup

#### Backend Configuration
```bash
cd backend
cp .env.example .env
# Edit .env with your configurations
```

Key environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Backend server port (default: 5000)

#### Frontend Configuration
```bash
cd frontend
cp .env.example .env
# Edit .env with your configurations
```

Key environment variables:
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

### 3. Installation

#### Using npm (Traditional Setup)

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend (in a new terminal):
```bash
cd frontend
npm install
npm start
```

#### Using Docker (Recommended)

```bash
# From the root directory
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Backend API on port 5000
- Frontend on port 3000
- Nginx on port 80

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs (if implemented)

## Project Structure

```
examinr/
├── backend/
│   ├── config/         # Database and other configurations
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── server.js       # Express server setup
│   └── package.json
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── contexts/   # React contexts
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── styles/     # CSS/SCSS files
│   │   ├── utils/      # Utility functions
│   │   ├── App.js      # Main App component
│   │   └── index.js    # Entry point
│   └── package.json
├── docker-compose.yml  # Docker compose configuration
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course (Teacher/Admin)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (Teacher/Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Exams
- `GET /api/exams` - Get all exams
- `POST /api/exams` - Create new exam (Teacher/Admin)
- `GET /api/exams/:id` - Get exam details
- `PUT /api/exams/:id` - Update exam (Teacher/Admin)
- `DELETE /api/exams/:id` - Delete exam (Admin)

### Results
- `GET /api/results/my-results` - Get user's results
- `GET /api/results/:examId` - Get exam results

## Development

### Running Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

### Code Style

This project uses ESLint for code linting. Run the linter:

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Database Seeding

To populate the database with sample data:

```bash
cd backend
npm run seed
```

## Deployment

### Using Docker

1. Build and push Docker images:
```bash
docker build -t examinr-backend ./backend
docker build -t examinr-frontend ./frontend
```

2. Use docker-compose for production:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Traditional Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Set up process manager for backend:
```bash
npm install -g pm2
cd backend
pm2 start server.js --name examinr-backend
```

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Rate limiting is implemented on all API endpoints
- CORS is configured for production domains
- Input validation on all API endpoints
- XSS protection via React's built-in escaping
- SQL injection protection via Mongoose parameterized queries

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@examinr.com or join our Slack channel.

## Acknowledgments

- Material-UI for the component library
- Socket.io for real-time functionality
- The MERN stack community for excellent documentation