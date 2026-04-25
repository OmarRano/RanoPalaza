import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type DemoUser = {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isAffiliate: boolean;
};

export type AuthUser = DemoUser | null;

export type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  error: unknown | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gimbiya_user");
      if (stored) {
        try {
          setUserState(JSON.parse(stored));
        } catch {
          setUserState(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const setUser = (newUser: AuthUser) => {
    setUserState(newUser);
    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem("gimbiya_user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("gimbiya_user");
      }
    }
  };

  const logout = () => {
    setUserState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("gimbiya_user");
      window.location.href = "/";
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error: null,
      isAuthenticated: !!user,
      setUser,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
