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
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // التحقق من الجلسة عند تحميل الصفحة
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        
        // فحص الأخطاء في الـ URL
        const params = new URLSearchParams(window.location.search);
        if (params.get('error')) {
          // إعادة توجيه إلى صفحة الخطأ
          window.location.href = `/auth/error?${params.toString()}`;
          return;
        }
        
        // معالجة التأكيد من البريد الإلكتروني - هذا هو الجزء الجديد المهم
        console.log('فحص الجلسة الحالية...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("خطأ في الحصول على الجلسة:", error);
          return;
        }
        
        if (data?.session) {
          console.log('تم العثور على جلسة نشطة:', data.session.user.email);
          setUser(data.session.user);
          setIsAuthenticated(true);
          setIsAdmin(data.session.user.user_metadata?.isAdmin === true);
          
          // تنظيف URL بعد التأكيد الناجح
          if (window.location.hash.includes('access_token')) {
            console.log('تنظيف الرابط بعد التأكيد...');
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          // إذا لم تكن هناك جلسة، تحقق من المستخدم الحالي
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("خطأ في الحصول على المستخدم:", userError);
            return;
          }
          
          if (userData.user) {
            setUser(userData.user);
            setIsAuthenticated(true);
            setIsAdmin(userData.user.user_metadata?.isAdmin === true);
          }
        }
      } catch (error) {
        console.error("خطأ في معالجة التأكيد:", error);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();

    // مراقبة التغيرات في حالة المصادقة
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("تغيير حالة المصادقة:", event, session?.user?.email || null);
      setLoading(true);
      
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        setIsAdmin(session.user.user_metadata?.isAdmin === true);
        
        // إذا كان هذا تسجيل دخول جديد، قم بتنظيف URL
        if (event === 'SIGNED_IN' && window.location.hash.includes('access_token')) {
          console.log('تنظيف الرابط بعد تسجيل الدخول...');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('إزالة الاستماع لتغييرات المصادقة');
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("محاولة تسجيل الدخول مع:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error("فشل تسجيل الدخول:", error.message);
        throw error;
      }

      console.log("نجح تسجيل الدخول:", data.user?.email);
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
        email: email.trim().toLowerCase(),
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
        console.log('يحتاج المستخدم لتأكيد البريد الإلكتروني');
        throw new Error("تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني.");
      }
      
      // إذا تم تسجيل الدخول مباشرة (بدون تأكيد)
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