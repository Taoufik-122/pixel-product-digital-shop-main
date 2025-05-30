import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// واجهة التوكن المفكوك
interface DecodedToken {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// واجهة السياق
interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: DecodedToken | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// إنشاء السياق
const AuthContext = createContext<AuthContextType | null>(null);

// هوك الاستخدام
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// مزود السياق
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwt_decode<DecodedToken>(token);
        setUser(decoded);
        setIsAuthenticated(true);
        setIsAdmin(decoded.isAdmin);
      } catch (error) {
        console.error("فشل فك التوكن:", error);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem("authToken", token);
        const decoded = jwt_decode<DecodedToken>(token);
        setUser(decoded);
        setIsAuthenticated(true);
        setIsAdmin(decoded.isAdmin);
        navigate("/");
      }
    } catch (error) {
      console.error("فشل تسجيل الدخول:", error);
      alert("خطأ في تسجيل الدخول");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem("authToken", token);
        const decoded = jwt_decode<DecodedToken>(token);
        setUser(decoded);
        setIsAuthenticated(true);
        setIsAdmin(decoded.isAdmin);
        navigate("/");
      }
    } catch (error) {
      console.error("فشل التسجيل:", error);
      alert("خطأ في التسجيل");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isAdmin, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
