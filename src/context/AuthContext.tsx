import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkIsAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("admin_role")
        .select("is_admin")
        .eq("id", userId)
        .single();

      setIsAdmin(!error && data?.is_admin === true);
    } catch {
      setIsAdmin(false);
    }
  };

  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const {
        data: { user: currentUser },
        error,
      } = await supabase.auth.getUser();

      if (error || !currentUser) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } else {
        setUser(currentUser);
        setIsAuthenticated(true);
        await checkIsAdmin(currentUser.id);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, redirectTo = "/") => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error("فشل تسجيل الدخول: تأكد من البريد وكلمة المرور");
      await getCurrentUser();
      navigate(redirectTo);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name, // استخدام اسم عمود مناسب
          },
        },
      });

      if (authError) throw new Error("فشل إنشاء الحساب");

      const userId = authData.user?.id;
      if (!userId) throw new Error("تعذر تحديد هوية المستخدم");

      // التحقق من عدد المستخدمين قبل إدخال المستخدم
      const { count, error: countError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;
      const isFirstUser = (count ?? 0) === 0;

      const { error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          email,
          display_name: name,
          is_admin: isFirstUser,
        },
      ]);

      if (insertError) throw insertError;

      await getCurrentUser();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setLoading(true);
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          await checkIsAdmin(session.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
        setIsAuthenticated(true);
        await checkIsAdmin(data.session.user.id);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth يجب استخدامه داخل AuthProvider");
  }
  return context;
};
