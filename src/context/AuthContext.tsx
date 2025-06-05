import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient'  // حسب المسار الصحيح لديك

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean; // هذا يعتمد على وجود role في metadata
  user: any;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // التحقق من الجلسة عند تحميل الصفحة
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        // تحقق من isAdmin داخل user metadata (اختياري)
        setIsAdmin(data.user.user_metadata?.isAdmin === true);
      }
    };

    getUser();

    // مراقبة التغيرات
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        setIsAdmin(session.user.user_metadata?.isAdmin === true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("فشل تسجيل الدخول:", error.message);
      alert("فشل تسجيل الدخول");
    } else {
      navigate("/");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          isAdmin: false, // يمكنك تخصيص هذا لاحقًا
        },
      },
    });

    if (error) {
      console.error("فشل التسجيل:", error.message);
      alert("فشل التسجيل");
    } else {
      navigate("/");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
