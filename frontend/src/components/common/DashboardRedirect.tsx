import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DashboardRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" replace />;
  } else if (user.role === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  } else if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Default fallback
  return <Navigate to="/" replace />;
};

export default DashboardRedirect;
