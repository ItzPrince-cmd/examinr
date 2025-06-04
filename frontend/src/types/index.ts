// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  createdAt: string;
  subscription?: Subscription;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
  };
  categoryId: string;
  price: number;
  thumbnail?: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolledCount: number;
  rating: number;
  createdAt: string;
  progress?: number; // Progress percentage for enrolled courses
}

// Category types
export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  courseCount: number;
}

// Quiz/Exam types
export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  questions: Question[];
  duration: number; // in minutes
  passingScore: number;
  attempts: number;
  type: 'practice' | 'exam';
  createdAt: string;
}

// Subscription types
export interface Subscription {
  id: string;
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  features: string[];
}

// Payment types
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  orderId: string;
  paymentMethod: string;
  createdAt: string;
}

// Result types
export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  answers: {
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  startedAt: string;
  completedAt: string;
}

// Analytics types
export interface StudentAnalytics {
  totalCourses: number;
  completedCourses: number;
  totalQuizzes: number;
  averageScore: number;
  studyStreak: number;
  weeklyProgress: {
    day: string;
    hours: number;
  }[];
  performanceByCategory: {
    category: string;
    score: number;
  }[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 
