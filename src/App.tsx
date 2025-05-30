import { Toaster } from "@/components/ui/toaster"; // or choose Sonner based on your needs
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HashRouter } from 'react-router-dom';

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
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
import AdminDashboard from "./pages/admin/Dashboard";
import ProductsList from "./pages/admin/products/ProductsList";
import ProductForm from "./pages/admin/products/ProductForm";
import CategoriesList from "./pages/admin/categories/CategoriesList";
import CategoryForm from "./pages/admin/categories/CategoryForm";
import OrdersList from "./pages/admin/orders/OrdersList";

// داخل <Routes>
// استيراد ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* مسارات المستخدم العادية */}
    <Route path="/" element={<Index />} />
    <Route path="/products" element={<Products />} />
    <Route path="/about" element={<About />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/categories/:category" element={<CategoryPage />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/checkout/success" element={<CheckoutSuccess />} />

    {/* مسارات التسجيل والدخول */}
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    
    {/* مسارات Admin محمية باستخدام ProtectedRoute */}
    <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
    <Route path="/admin/products" element={<ProtectedRoute element={<ProductsList />} />} />
    <Route path="/admin/products/new" element={<ProtectedRoute element={<ProductForm />} />} />
    <Route path="/admin/products/edit/:id" element={<ProtectedRoute element={<ProductForm />} />} />
    <Route path="/admin/categories" element={<ProtectedRoute element={<CategoriesList />} />} />
    <Route path="/admin/categories/new" element={<ProtectedRoute element={<CategoryForm />} />} />
    <Route path="/admin/categories/edit/:id" element={<ProtectedRoute element={<CategoryForm />} />} />
    <Route path="/admin/orders" element={<ProtectedRoute element={<OrdersList />} />} />

    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
<HashRouter>
        <AuthProvider>
          <CartProvider> {/* CartProvider inside AuthProvider */}
            <Toaster />
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
</HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
