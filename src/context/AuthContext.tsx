// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient"; // أو حسب المسار الذي حفظت فيه عميل supabase
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

  const checkIsAdmin = async (userId: string) => {
    const { data, error } = await supabase
      .from("user")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("خطأ في جلب is_admin:", error.message);
      setIsAdmin(false);
    } else {
      setIsAdmin(data?.is_admin === true);
    }
  };

  const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } else {
      setUser(data.user);
      setIsAuthenticated(true);
      await checkIsAdmin(data.user.id);
    }

    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await getCurrentUser();
    navigate("/");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/signin");
  };

  useEffect(() => {
    getCurrentUser();

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
