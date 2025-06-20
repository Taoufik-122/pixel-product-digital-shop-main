import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Admin pages
//  import AdminDashboard from "./pages/admin/Dashboard";
import ProductsList from "./pages/admin/products/ProductsList";
import ProductForm from "./pages/admin/products/ProductForm";
import CategoriesList from "./pages/admin/categories/CategoriesList";
import CategoryForm from "./pages/admin/categories/CategoryForm";
import OrdersList from "./pages/admin/orders/OrdersList";
import AuthError from "./pages/AuthError"; // تأكد من المسار الصحيح
import EmailConfirmed from "./pages/EmailConfirmed";
import Dashboard from "./pages/admin/Dashboard";


// Components
import ProtectedRoute from "./components/ProtectedRoute";







const queryClient = new QueryClient();

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

// Routes Component - يجب أن يكون داخل AuthProvider




const AppRoutes = () => {
  const { user, isAdmin, loading } = useAuth();

  const stillLoading = loading || (user && isAdmin === null);

  if (stillLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>

  <Route element={<ProtectedRoute adminOnly />}>
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="/admin/products" element={<ProductsList />} />
    <Route path="/admin/products/new" element={<ProductForm />} />
    <Route path="/admin/products/:id/edit" element={<ProductForm />} />
    <Route path="/admin/categories" element={<CategoriesList />} />
    <Route path="/admin/categories/new" element={<CategoryForm />} />
    <Route path="/admin/categories/:id/edit" element={<CategoryForm />} />
    <Route path="/admin/orders" element={<OrdersList />} />
  </Route>


      {/* مسارات الزوار والمستخدمين العاديين */}
      <Route path="/" element={<Index />} />
      <Route path="/email-confirmed" element={<EmailConfirmed />} />
      <Route path="/products" element={<Products />} />
      <Route path="/about" element={<About />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/categories/:category" element={<CategoryPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/error" element={<AuthError />} />

      {/* مسارات الأدمن */}
   
    </Routes>
  );
};








const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HashRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;





