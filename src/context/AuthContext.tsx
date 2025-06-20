import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";

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
    const { data, error } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ checkAdmin error:", error.message);
      setIsAdmin(false);
      return;
    }

    setIsAdmin(data?.is_admin === true);
  };

  const handleSessionChange = async (session: any) => {
    const currentUser = session?.user || session?.session?.user;

    if (currentUser) {
      setUser(currentUser);
      await checkAdmin(currentUser.id);
    } else {
      setUser(null);
      setIsAdmin(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ getSession error:", error.message);
      }

      await handleSessionChange(session);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("🔄 Auth state changed:", _event, session);
      await handleSessionChange(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    await handleSessionChange(sessionData);
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
