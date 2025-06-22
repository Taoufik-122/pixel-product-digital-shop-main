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

const AppRoutes = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />; // ⏳ لا تعرض شيء قبل انتهاء التحقق
  }

  return (
    <Routes>
      {/* بقية الراوتات */}
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin" element={<ProtectedRoute element={<Dashboard />} adminOnly={true} />} />
      <Route path="*" element={<NotFound />} />
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
