import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";

// تحديث نوع السياق ليشمل signUp
interface AuthContextType {
  user: any;
  isAdmin: boolean;
  loading: boolean;
    isAuthenticated: boolean; // ✅ أضف هذا

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
signUp: (email: string, password: string, name: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {


  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
    const isAuthenticated = !!user;
useEffect(() => {
  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("📦 Initial session:", session);

    if (session?.user) {
      setUser(session.user);
      checkAdmin(session.user.id);
    }

    setLoading(false);
  };

  getSession();

  const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("🔄 Auth state changed:", event);
    if (session?.user) {
      setUser(session.user);
      checkAdmin(session.user.id);
    } else {
      setUser(null);
      setIsAdmin(false);
    }
  });

  return () => {
    subscription?.subscription.unsubscribe();
  };
}, []);



 const checkAdmin = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", userId)
    .single();
console.log("🔎 checkAdmin for", userId, "=>", data?.is_admin);

  if (error) {
    console.error("فشل التحقق من صلاحيات الأدمن:", error.message);
    setIsAdmin(false);
    return;
  }

  console.log("👮‍♂️ حالة is_admin:", data?.is_admin); // ✅ طباعة القيمة الفعلية

  setIsAdmin(data?.is_admin === true); // ← هذه مهمة
};



  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setUser(data.user);
    await checkAdmin(data.user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) throw error;

  // تسجيل إضافي في جدول users (اختياري)
  if (data.user) {
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: data.user.id,
        full_name: name,
        email: email,
        role: 'user', // أو القيمة الافتراضية
      },
    ]);
    if (insertError) {
      console.error("خطأ عند إدخال المستخدم في جدول users:", insertError.message);
      // لا ترمي الخطأ هنا لكي لا تفشل العملية كلها
    }
  }

  return data;
};


  return (
  <AuthContext.Provider
  value={{ user, isAdmin, loading, login, logout, signUp, isAuthenticated }}
>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
