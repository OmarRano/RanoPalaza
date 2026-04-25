import { useEffect, useMemo, useState } from "react";

type AppUser = {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  isAffiliate?: boolean;
};

const USE_BACKEND_AUTH = import.meta.env.VITE_USE_BACKEND_AUTH === "true";

const DEMO_USERS: Record<string, AppUser> = {
  admin: { _id: "admin-001", id: "admin-001", name: "Amina Oladipo", email: "admin@gimbiyamall.com", role: "admin", phone: "+234 812 345 6789", isAffiliate: false },
  manager: { _id: "manager-001", id: "manager-001", name: "Daniel Chukwu", email: "manager@gimbiyamall.com", role: "manager", phone: "+234 809 123 4567", isAffiliate: false },
  stock_manager: { _id: "stockmgr-001", id: "stockmgr-001", name: "Hauwa Musa", email: "stock@gimbiyamall.com", role: "stock_manager", phone: "+234 813 456 7890", isAffiliate: false },
  delivery: { _id: "delivery-001", id: "delivery-001", name: "Precious Eze", email: "delivery@gimbiyamall.com", role: "delivery", phone: "+234 901 234 5678", isAffiliate: false },
  reader: { _id: "affiliate-001", id: "affiliate-001", name: "Femi Adeyemi", email: "affiliate@gimbiyamall.com", role: "reader", phone: "+234 803 456 7890", isAffiliate: true },
  developer: { _id: "developer-001", id: "developer-001", name: "Ngozi Okafor", email: "developer@gimbiyamall.com", role: "developer", phone: "+234 807 654 3210", isAffiliate: false },
  buyer: { _id: "buyer-001", id: "buyer-001", name: "Peter Nwosu", email: "buyer@gimbiyamall.com", role: "buyer", phone: "+234 805 123 4567", isAffiliate: false },
};

function getRoleFromPath(pathname: string): string {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/manager")) return "manager";
  if (pathname.startsWith("/stock-manager")) return "stock_manager";
  if (pathname.startsWith("/delivery")) return "delivery";
  if (pathname.startsWith("/affiliate")) return "reader";
  if (pathname.startsWith("/developer")) return "developer";
  if (["/buyer", "/cart", "/orders", "/checkout", "/profile"].some((p) => pathname.startsWith(p))) return "buyer";
  return "buyer";
}

export function useAuth(_options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;

  // Demo mode fallback
  if (!USE_BACKEND_AUTH) {
    const role = getRoleFromPath(pathname);
    const user = DEMO_USERS[role] ?? DEMO_USERS.buyer;

    const state = useMemo(() => ({ user, loading: false, error: null, isAuthenticated: true }), [user]);
    return {
      ...state,
      refresh: async () => {},
      logout: async () => {
        if (typeof window !== "undefined") window.location.href = "/";
      },
    };
  }

  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const json = await res.json();
      setUser(json?.user ?? null);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load session");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    if (typeof window !== "undefined") window.location.href = "/";
  };

  return { user, loading, error, isAuthenticated: !!user, refresh, logout };
}
