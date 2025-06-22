import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
  import jwt_decode from "jwt-decode";

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
    setIsAdmin(isAdminValue);
  } else {
    setUser(null);
    setIsAdmin(false);
  }

  setLoading(false);

  const token = session?.access_token;
  if (token) {
    // تخزين الـ token في localStorage
    localStorage.setItem('supabase.auth.token', token);
    console.log("✅ Token stored in localStorage:", token);
  }
};

useEffect(() => {
  const getSessionAndUser = async () => {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      console.log("Retrieved token from localStorage:", token);

      if (token) {
        // تحقق من صلاحية الـ token
        const decodedToken: any = jwt_decode(token);
        const expiryTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        if (currentTime > expiryTime) {
          console.warn("❌ Token expired");
          localStorage.removeItem("supabase.auth.token");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.setSession(token);
        if (error) {
          console.error("❌ Error setting session with token:", error);
          localStorage.removeItem("supabase.auth.token");
          setLoading(false);
          return;
        }
        console.log("✅ Session set successfully");
        await handleSessionChange(data.session);
      } else {
        console.warn("❌ No token found in localStorage.");
        // إذا لم يكن هناك توكن، تحقق من الجلسة العادية
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("❌ Error getting session:", error);
          setLoading(false);
          return;
        }
        await handleSessionChange(data.session);
      }
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

    const { data: sessionData } = await supabase.auth.getSession();
    await handleSessionChange(sessionData);

    setLoading(false);

    // تحقق من تخزين الـ token بعد تسجيل الدخول
    console.log("✅ Token after login:", localStorage.getItem('supabase.auth.token'));

    const navigate = useNavigate();
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/home");
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
