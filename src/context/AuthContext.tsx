import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // تحقق من صلاحية المستخدم (admin)
  const checkIsAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("is_admin")
        .eq("id", userId)
        .single();

      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(data.is_admin === true);
      }
    } catch (err) {
      setIsAdmin(false);
    }
  };

  // جلب المستخدم الحالي من الجلسة
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

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await getCurrentUser();
    navigate("/");
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setLoading(false);
    navigate("/signin");
  };

  useEffect(() => {
    // استرجاع حالة الجلسة عند بدء التحميل
    getCurrentUser();

    // مراقبة تغييرات حالة المصادقة
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, loading, login, logout }}>
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
