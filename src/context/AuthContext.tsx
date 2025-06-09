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
      .eq("id", userId)  // نطابق على عمود id (UUID)
      .single();

    setIsAdmin(!error && data?.is_admin === true);
  } catch (err) {
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

  // ✅ دالة تسجيل مستخدم جديد


 const signUp = async (email: string, password: string, name: string) => {
  setLoading(true);
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ["Display name"]: name,
        },
      },
    });

    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error("User ID is missing");

    // فحص هل هو أول مستخدم؟
    const { data: existingAdmins, error: checkError } = await supabase
      .from("users")
      .select("id");

    if (checkError) throw checkError;

    const isFirstUser = existingAdmins.length === 0;

    // إدخال المستخدم في جدول users
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        email,
        ["Display name"]: name,
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

  // فورًا نحاول جلب الجلسة الحالية من Supabase (هذه دالة جاهزة في Supabase)
  supabase.auth.getSession().then(({ data }) => {
    if (data.session?.user) {
      setUser(data.session.user);
      setIsAuthenticated(true);
      checkIsAdmin(data.session.user.id);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
    setLoading(false);
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isAdmin, loading, login, logout, signUp }}
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
