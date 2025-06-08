// تحسينات على AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean; // إضافة حالة التحميل
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // إضافة حالة التحميل
  const navigate = useNavigate();

  // التحقق من الجلسة عند تحميل الصفحة
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("خطأ في الحصول على المستخدم:", error);
          return;
        }
        
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          setIsAdmin(data.user.user_metadata?.isAdmin === true);
        }
      } catch (error) {
        console.error("خطأ في getUser:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // مراقبة التغيرات
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("تغيير حالة المصادقة:", event, session);
      setLoading(true);
      
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        setIsAdmin(session.user.user_metadata?.isAdmin === true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("محاولة تسجيل الدخول مع:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // تنظيف البريد الإلكتروني
        password,
      });

      if (error) {
        console.error("فشل تسجيل الدخول:", error.message);
        throw error;
      }

      console.log("نجح تسجيل الدخول:", data);
      navigate("/");
    } catch (error) {
      console.error("خطأ في دالة login:", error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      console.log("محاولة التسجيل مع:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(), // تنظيف البريد الإلكتروني
        password,
        options: {
          data: {
            name: name.trim(),
            isAdmin: false,
          },
        },
      });

      if (error) {
        console.error("فشل التسجيل:", error.message);
        throw error;
      }

      console.log("نجح التسجيل:", data);
      
      // تحقق من ما إذا كان المستخدم بحاجة لتأكيد البريد الإلكتروني
      if (data.user && !data.session) {
        throw new Error("تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني.");
      }
      
      navigate("/");
    } catch (error) {
      console.error("خطأ في دالة signup:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("خطأ في تسجيل الخروج:", error);
        throw error;
      }
      
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate("/signin");
    } catch (error) {
      console.error("خطأ في logout:", error);
      // في حالة تسجيل الخروج، يمكننا تجاهل الخطأ والمتابعة
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate("/signin");
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated, 
        isAdmin, 
        login, 
        signup, 
        logout,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};