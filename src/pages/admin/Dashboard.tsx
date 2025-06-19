import React from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Package,
  Layers,
  ShoppingCart,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const dashboardItems = [
  {
    title: "Products",
    description: "Manage your product catalog",
    icon: <Package className="h-5 w-5 text-purple-600" />,
    links: [
      { to: "/admin/products", label: "View All Products" },
      { to: "/admin/products/new", label: "Add New Product" },
    ],
  },
  {
    title: "Categories",
    description: "Manage product categories",
    icon: <Layers className="h-5 w-5 text-green-600" />,
    links: [
      { to: "/admin/categories", label: "View All Categories" },
      { to: "/admin/categories/new", label: "Add New Category" },
    ],
  },
  {
    title: "Orders",
    description: "Manage customer orders",
    icon: <FileText className="h-5 w-5 text-blue-600" />,
    links: [{ to: "/admin/orders", label: "View All Orders" }],
  },
  {
    title: "Store",
    description: "View your online store",
    icon: <ShoppingCart className="h-5 w-5 text-yellow-600" />,
    links: [{ to: "/", label: "Visit Store" }],
  },
];

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
if (loading || isAdmin === null) {
  return <p>جارٍ التحقق من الصلاحيات...</p>;
}



  if (!user) return <Navigate to="/signin" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="text-brand w-6 h-6" />
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {dashboardItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  {item.links.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.to}
                      className="text-sm font-medium text-brand hover:underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Outlet />
    </div>
  );
};

export default AdminDashboard;
