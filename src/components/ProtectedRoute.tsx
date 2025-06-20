import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();

  console.log("🔐 ProtectedRoute:", { user, isAdmin, loading });

  // أثناء التحميل أو عند انتظار معرفة isAdmin
  if (loading || (user && isAdmin === null)) {
    return <div className="flex justify-center items-center h-screen">🔄 تحميل...</div>;
  }

  // إن لم يكن هناك مستخدم، أعد التوجيه إلى صفحة تسجيل الدخول
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // إن كانت الصفحة للأدمن فقط، والمستخدم ليس أدمن
  if (adminOnly && !isAdmin) {
    return <Navigate to="/auth/error" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
