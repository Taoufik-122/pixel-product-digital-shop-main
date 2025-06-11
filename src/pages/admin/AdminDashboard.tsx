import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <p>جارٍ التحقق من الصلاحيات...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">لوحة تحكم الأدمن</h1>
      <p>مرحباً، لديك صلاحيات المسؤول.</p>
      {/* ضع هنا مكونات لوحة التحكم: إدارة المنتجات، الطلبات، المستخدمين، الخ... */}
    </div>
  );
};

export default AdminDashboard;
