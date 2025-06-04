import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import RedirectIfAuthenticated from './components/auth/RedirectIfAuthenticated';
import DashboardRedirect from './components/common/DashboardRedirect';
import AuthLayout from './components/layout/AuthLayout';
import StudentLayoutFullscreen from './components/layout/StudentLayoutFullscreen';
import TeacherLayout from './components/layout/TeacherLayout';
import AdminLayout from './components/layout/AdminLayout';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const OnboardingFlow = lazy(() => import('./pages/OnboardingFlow'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ExamsPage = lazy(() => import('./pages/ExamsPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
// Student pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const PracticeSection = lazy(() => import('./pages/student/PracticeSection'));
const PracticeSession = lazy(() => import('./pages/student/PracticeSession'));
const TestCenter = lazy(() => import('./pages/student/TestCenter'));
const TestInterface = lazy(() => import('./pages/student/TestInterface'));
const TestResults = lazy(() => import('./pages/student/TestResults'));
const PerformanceAnalytics = lazy(() => import('./pages/student/PerformanceAnalytics'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'));
// Teacher pages
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const BatchManagement = lazy(() => import('./pages/teacher/BatchManagement'));
const BatchCreation = lazy(() => import('./pages/teacher/BatchCreation'));
const BatchDetails = lazy(() => import('./pages/teacher/BatchDetails'));
const TestCreation = lazy(() => import('./pages/teacher/TestCreation'));
const StudentMonitoring = lazy(() => import('./pages/teacher/StudentMonitoring'));
const StudentPerformance = lazy(() => import('./pages/teacher/StudentPerformance'));
const ContentManagement = lazy(() => import('./pages/teacher/ContentManagement'));
const StudentsPage = lazy(() => import('./pages/teacher/StudentsPage'));
const PerformancePage = lazy(() => import('./pages/teacher/PerformancePage'));
const SchedulePage = lazy(() => import('./pages/teacher/SchedulePage'));
const ReportsPage = lazy(() => import('./pages/teacher/ReportsPage'));
const TeacherProfilePage = lazy(() => import('./pages/teacher/ProfilePage'));
const TeacherSettingsPage = lazy(() => import('./pages/teacher/SettingsPage'));
const AttendancePage = lazy(() => import('./pages/teacher/AttendancePage'));
const QuestionBankPage = lazy(() => import('./pages/teacher/QuestionBankPage'));
// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const QuestionBank = lazy(() => import('./pages/admin/QuestionBank'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const FinancialManagement = lazy(() => import('./pages/admin/FinancialManagement'));
const SystemVitals = lazy(() => import('./pages/admin/SystemVitals'));
// New Student pages
const BatchDashboard = lazy(() => import('./pages/student/BatchDashboard'));
const LeaderboardPage = lazy(() => import('./pages/student/LeaderboardPage'));
const AchievementsPage = lazy(() => import('./pages/student/AchievementsPage'));
const StudyPlanPage = lazy(() => import('./pages/student/StudyPlanPage'));
// Live Classroom (shared between students and teachers)
const LiveClassroom = lazy(() => import('./pages/LiveClassroom'));

// Design System Showcase
const DesignSystemShowcase = lazy(() => import('./pages/DesignSystemShowcase'));

// Loading component
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/design-system" element={<DesignSystemShowcase />} />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <LoginPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <RegisterPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuthenticated>
              <RegisterPage />
            </RedirectIfAuthenticated>
          }
        />
        {/* Onboarding Route - Public since it includes registration */}
        <Route
          path="/onboarding"
          element={
            <RedirectIfAuthenticated>
              <OnboardingFlow />
            </RedirectIfAuthenticated>
          }
        />
        {/* Dashboard Route - Redirects based on role */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardRedirect />
            </PrivateRoute>
          }
        />
        {/* Student Protected Routes */}
        <Route
          element={
            <PrivateRoute requiredRole="student">
              <StudentLayoutFullscreen>
                <Outlet />
              </StudentLayoutFullscreen>
            </PrivateRoute>
          }
        >
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          {/* Practice Routes */}
          <Route path="/practice" element={<PracticeSection />} />
          <Route path="/practice/session" element={<PracticeSession />} />
          <Route path="/practice/quick" element={<PracticeSession />} />
          <Route path="/practice/resume" element={<PracticeSession />} />
          <Route path="/practice/weak" element={<PracticeSection />} />
          <Route path="/practice/bookmarks" element={<PracticeSection />} />
          {/* Test Routes */}
          <Route path="/tests" element={<TestCenter />} />
          <Route path="/tests/mock" element={<TestCenter />} />
          <Route path="/tests/chapter" element={<TestCenter />} />
          <Route path="/tests/history" element={<TestResults />} />
          <Route path="/test/:testId" element={<TestInterface />} />
          <Route path="/test/results" element={<TestResults />} />
          {/* Analytics Routes */}
          <Route path="/analytics" element={<PerformanceAnalytics />} />
          <Route path="/analytics/subjects" element={<PerformanceAnalytics />} />
          <Route path="/analytics/progress" element={<PerformanceAnalytics />} />
          <Route path="/analytics/weak-areas" element={<PerformanceAnalytics />} />
          {/* Profile Route */}
          <Route path="/profile" element={<StudentProfile />} />
          {/* Additional Routes */}
          <Route path="/batches" element={<BatchDashboard />} />
          <Route path="/batches/:batchId/live/:sessionId" element={<LiveClassroom />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/study-plan" element={<StudyPlanPage />} />
          <Route path="/help" element={<StudentDashboard />} />
          <Route path="/notifications" element={<StudentDashboard />} />
          <Route path="/search" element={<StudentDashboard />} />
          {/* Legacy Routes - Keep for backward compatibility */}
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
        </Route>
        {/* Teacher Protected Routes */}
        <Route
          element={
            <PrivateRoute requiredRole="teacher">
              <TeacherLayout />
            </PrivateRoute>
          }
        >
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          {/* Batch Management Routes */}
          <Route path="/teacher/batches" element={<BatchManagement />} />
          <Route path="/teacher/batches/create" element={<BatchCreation />} />
          <Route path="/teacher/batches/:batchId" element={<BatchDetails />} />
          <Route path="/teacher/batches/:batchId/edit" element={<BatchCreation />} />
          <Route path="/teacher/batches/:batchId/live/:sessionId" element={<LiveClassroom />} />
          {/* Assessment Routes */}
          <Route path="/teacher/test/create" element={<TestCreation />} />
          <Route path="/teacher/tests" element={<TestCreation />} />
          <Route path="/teacher/reviews" element={<StudentMonitoring />} />
          <Route path="/teacher/questions" element={<QuestionBankPage />} />
          {/* Student Monitoring Routes */}
          <Route path="/teacher/students" element={<StudentsPage />} />
          <Route path="/teacher/students/:studentId" element={<StudentPerformance />} />
          <Route path="/teacher/students/performance" element={<PerformancePage />} />
          <Route path="/teacher/attendance" element={<AttendancePage />} />
          <Route path="/teacher/reports" element={<ReportsPage />} />
          {/* Content Management Routes */}
          <Route path="/teacher/content" element={<ContentManagement />} />
          <Route path="/teacher/content/upload" element={<ContentManagement />} />
          {/* Additional Teacher Routes */}
          <Route path="/teacher/schedule" element={<SchedulePage />} />
          <Route path="/teacher/profile" element={<TeacherProfilePage />} />
          <Route path="/teacher/settings" element={<TeacherSettingsPage />} />
          <Route path="/teacher/achievements" element={<TeacherDashboard />} />
          <Route path="/teacher/help" element={<TeacherDashboard />} />
          <Route path="/teacher/notifications" element={<TeacherDashboard />} />
          <Route path="/teacher/search" element={<TeacherDashboard />} />
          <Route path="/teacher/announcements/create" element={<TeacherDashboard />} />
        </Route>
        {/* Admin Protected Routes with AdminLayout */}
        <Route
          element={
            <PrivateRoute requiredRole="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<QuestionBank />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/financial" element={<FinancialManagement />} />
          <Route path="/admin/system-vitals" element={<SystemVitals />} />
          <Route path="/admin/batches" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminDashboard />} />
          <Route path="/admin/achievements" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminDashboard />} />
          <Route path="/admin/activity" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          <Route path="/admin/security" element={<AdminDashboard />} />
          <Route path="/admin/notifications" element={<AdminDashboard />} />
          <Route path="/admin/help" element={<AdminDashboard />} />
        </Route>
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
