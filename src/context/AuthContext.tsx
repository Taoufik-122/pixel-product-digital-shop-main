import { supabase } from "@/lib/supabaseClient";
import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Define type
interface AuthContextType {
  user: any;
  isAdmin: boolean;
  loading: boolean;
}

// 2. Create context with type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };

    initSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("admin_role")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching admin role:", error.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.is_admin === true);
      }

      setLoading(false);
    };

    fetchAdminStatus();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
