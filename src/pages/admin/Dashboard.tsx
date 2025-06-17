
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Layers, ShoppingCart, FileText } from "lucide-react";
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


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span>Products</span>
            </CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Link 
                to="/admin/products" 
                className="text-brand-purple hover:underline"
              >
                View All Products
              </Link>
              <Link 
                to="/admin/products/new" 
                className="text-brand-purple hover:underline"
              >
                Add New Product
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              <span>Categories</span>
            </CardTitle>
            <CardDescription>Manage product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Link 
                to="/admin/categories" 
                className="text-brand-purple hover:underline"
              >
                View All Categories
              </Link>
              <Link 
                to="/admin/categories/new" 
                className="text-brand-purple hover:underline"
              >
                Add New Category
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>Orders</span>
            </CardTitle>
            <CardDescription>Manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Link 
                to="/admin/orders" 
                className="text-brand-purple hover:underline"
              >
                View All Orders
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Store</span>
            </CardTitle>
            <CardDescription>View your online store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-brand-purple hover:underline"
              >
                Visit Store
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
