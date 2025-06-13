import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();

  // حالة التحميل - نعرض رسالة أو سبينر
  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>جارٍ التحقق من الصلاحيات...</p>
      </div>
    );
  }

  // إذا لم يكن هناك مستخدم (غير مسجل الدخول)
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // إذا لم يكن الأدمن
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // المحتوى الرئيسي
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">لوحة تحكم الأدمن</h1>
      <p className="mb-6 text-muted-foreground">
        مرحباً، لديك صلاحيات المسؤول. يمكنك الآن إدارة المحتوى.
      </p>

      {/* ✅ هنا تضع مكونات لوحة التحكم الفعلية */}
      {/* مثل: <ProductManager />, <UserList />, <OrderOverview />, ... */}
    </div>
  );
};

export default AdminDashboard;
