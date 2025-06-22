import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom"; // استيراد useNavigate

interface AuthContextType {
  user: any;
  isAdmin: boolean | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;


const checkAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      return false;
    }

    if (!data) {
      console.warn("⚠️ No user found with that ID");
      return false;
    }

    console.log("✅ Admin check result:", data.is_admin);
    return data.is_admin === true;
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return false;
  }
};



const handleSessionChange = async (session: any) => {
  const currentUser = session?.user;

  if (currentUser) {
    setUser(currentUser);
    const isAdminValue = await checkAdmin(currentUser.id);
    setIsAdmin(isAdminValue);  // تعيين القيمة بعد التحقق من الـ admin
  } else {
    setUser(null);
    setIsAdmin(false);
  }

  setLoading(false);  // إيقاف الـ loading
};
useEffect(() => {
  const getSessionAndUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("❌ Error getting session:", error);
        setLoading(false);
        return;
      }
      await handleSessionChange(data.session);  // تحديث الجلسة مباشرة بعد تحميل الصفحة
    } catch (err) {
      console.error("❌ Unexpected session fetch error:", err);
      setLoading(false);
    }
  };

  getSessionAndUser();

  const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
    await handleSessionChange(session);
  });

  return () => {
    listener?.subscription.unsubscribe();
  };
}, []);


const login = async (email: string, password: string) => {
  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Login Error:", error.message);
      setLoading(false);
      throw error;
    }

    // عند نجاح تسجيل الدخول، استرجع الجلسة
    const { data: sessionData } = await supabase.auth.getSession();
    await handleSessionChange(sessionData);

    setLoading(false);

    // التوجيه إلى الصفحة المناسبة بعد تسجيل الدخول
    const navigate = useNavigate();
    if (isAdmin) {
      navigate("/admin");  // إذا كان المستخدم admin، انتقل إلى لوحة التحكم
    } else {
      navigate("/home");  // أو إلى الصفحة الرئيسية للمستخدم العادي
    }

  } catch (err) {
    console.error("❌ Unexpected Error:", err);
    setLoading(false);
  }
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

    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          full_name: name,
          email,
          role: "user",
        },
      ]);

      if (insertError) {
        console.error("⚠️ insert user error:", insertError.message);
      }
    }

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        logout,
        signUp,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
