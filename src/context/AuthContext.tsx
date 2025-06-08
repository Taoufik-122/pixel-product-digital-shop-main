import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ needsConfirmation: boolean; message?: string } | undefined>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams(window.location.search);
        if (params.get("error")) {
          window.location.href = `/auth/error?${params.toString()}`;
          return;
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("خطأ في الحصول على الجلسة:", error);
          return;
        }

        if (data?.session) {
          setUser(data.session.user);
          setIsAuthenticated(true);
          setIsAdmin(data.session.user.user_metadata?.isAdmin === true);

          if (window.location.hash.includes("access_token")) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.error("خطأ في الحصول على المستخدم:", userError);
            return;
          }

          if (userData.user) {
            setUser(userData.user);
            setIsAuthenticated(true);
            setIsAdmin(userData.user.user_metadata?.isAdmin === true);
          }
        }
      } catch (error) {
        console.error("خطأ في معالجة التأكيد:", error);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setLoading(true);

      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        setIsAdmin(session.user.user_metadata?.isAdmin === true);

        if (event === "SIGNED_IN" && window.location.hash.includes("access_token")) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        navigate("/");
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
            isAdmin: false,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.session) {
        return {
          needsConfirmation: true,
          message: "تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني وتأكيد حسابك.",
        };
      }

      if (data.session) {
        navigate("/");
        return { needsConfirmation: false };
      }

    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate("/signin");
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate("/signin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
