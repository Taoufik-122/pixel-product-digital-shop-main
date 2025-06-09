import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  element: React.ReactElement;
  adminOnly?: boolean;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/auth/error" replace />;
  }

  return element;
};


export default ProtectedRoute;

