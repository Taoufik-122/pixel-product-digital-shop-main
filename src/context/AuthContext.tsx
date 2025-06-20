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
  const [loading, setLoading] = useState(false);

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

    console.log("✅ is_admin:", data?.is_admin);
    setIsAdmin(data?.is_admin === true);
  };

  const handleSessionChange = async (session: any) => {
    if (session?.user) {
      setUser(session.user);
      await checkAdmin(session.user.id);
        setLoading(false); // ✅ هنا فقط بعد التحقق من isAdmin

    } else {
      setUser(null);
      setIsAdmin(false);
      setLoading(false); // ✅ بعد كل شيء

    }
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("📦 Initial session:", session);
      await handleSessionChange(session);
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("🔄 Auth state changed:", _event);
        await handleSessionChange(session);
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    await handleSessionChange({ user: data.user });
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
