
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, LogIn, UserRound, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  
  const itemCount = items.length;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
            PixelStore
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-brand-purple transition-colors">
            Home
          </Link>
          <Link to="/products" className="font-medium hover:text-brand-purple transition-colors">
            Products
          </Link>
          <Link to="/about" className="font-medium hover:text-brand-purple transition-colors">
            About
          </Link>
          <Link to="/cart" className="relative">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          
          {/* Auth Button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <UserRound className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAdmin && (
                    <Link to="/admin">
                      <DropdownMenuItem>
                        <UserRound className="mr-2 h-4 w-4" /> Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/signin">
                <Button variant="outline">
                  <LogIn className="mr-2 h-5 w-5" /> Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white border-b shadow-lg animate-fade-in z-50">
          <div className="flex flex-col space-y-4 p-4">
            <Link 
              to="/" 
              className="font-medium p-2 hover:bg-muted rounded-md" 
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="font-medium p-2 hover:bg-muted rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className="font-medium p-2 hover:bg-muted rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/cart" 
              className="font-medium p-2 hover:bg-muted rounded-md flex justify-between items-center"
              onClick={() => setIsOpen(false)}
            >
              Cart
              {itemCount > 0 && (
                <span className="bg-brand-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {/* Auth Menu Items */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="font-medium p-2 hover:bg-muted rounded-md flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserRound className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                )}
                <button 
                  className="font-medium p-2 hover:bg-muted rounded-md flex items-center w-full text-left"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link 
                to="/signin" 
                className="font-medium p-2 hover:bg-muted rounded-md flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
