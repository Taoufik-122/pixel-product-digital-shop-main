// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  element: React.ReactElement;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element, 
  adminOnly = false 
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // إذا كان التطبيق ما زال يحمل
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل دخول
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // إذا كان المسار يتطلب صلاحيات Admin ولكن المستخدم ليس Admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;