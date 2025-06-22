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
  const currentUser = session?.user || session?.session?.user;

  if (currentUser) {
    setUser(currentUser);
    const isAdminValue = await checkAdmin(currentUser.id);
    setIsAdmin(isAdminValue); // ✅ هذا هو المهم
  } else {
    setUser(null);
    setIsAdmin(false);
  }

  setLoading(false);
};

useEffect(() => {
  const getSessionAndUser = async () => {
    setLoading(true);

    // 1. استرجاع الجلسة من Supabase
    const { data: { session } } = await supabase.auth.getSession();

    const user = session?.user ?? null;
    setUser(user);

    // 2. إذا كان يوجد مستخدم، تحقق هل هو admin
    if (user) {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("❌ Error fetching role:", error.message);
        setIsAdmin(false); // أو null
      } else {
        setIsAdmin(data?.role === "admin");
      }
    } else {
      setIsAdmin(false); // لا يوجد مستخدم
    }

    setLoading(false);
  };

  getSessionAndUser();

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user ?? null;
    setUser(user);

    if (user) {
      supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("❌ Error fetching role:", error.message);
            setIsAdmin(false);
          } else {
            setIsAdmin(data?.role === "admin");
          }
        });
    } else {
      setIsAdmin(false);
    }
  });

  return () => {
    listener?.subscription.unsubscribe();
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
