import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  ShoppingBag, Shield, Settings, Truck, Code2,
  Package, TrendingUp, LogOut, Home, ChevronDown,
} from "lucide-react";
import { ReactNode, useState } from "react";

const ROLE_CONFIG: Record<string, { icon: ReactNode; color: string; label: string; dashPath: string }> = {
  admin: { icon: <Shield className="w-5 h-5" />, color: "#ef4444", label: "Admin", dashPath: "/admin" },
  manager: { icon: <Settings className="w-5 h-5" />, color: "#3b82f6", label: "Manager", dashPath: "/manager" },
  stock_manager: { icon: <Package className="w-5 h-5" />, color: "#10b981", label: "Stock Manager", dashPath: "/stock-manager" },
  delivery: { icon: <Truck className="w-5 h-5" />, color: "#f59e0b", label: "Delivery", dashPath: "/delivery" },
  reader: { icon: <TrendingUp className="w-5 h-5" />, color: "#a855f7", label: "Affiliate", dashPath: "/affiliate" },
  developer: { icon: <Code2 className="w-5 h-5" />, color: "#4f46e5", label: "Developer", dashPath: "/developer" },
  buyer: { icon: <ShoppingBag className="w-5 h-5" />, color: "#0891b2", label: "Buyer", dashPath: "/buyer" },
};

export default function RoleBasedNavbar() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.buyer;

  const handleLogout = () => {
    logout?.();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 64,
        background: "rgba(15, 23, 42, 0.98)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 24,
        paddingRight: 24,
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      {/* Logo / Home */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget.style.opacity = "0.8"))}
        onMouseLeave={(e) => ((e.currentTarget.style.opacity = "1"))}
      >
        <Home className="w-6 h-6" style={{ color: "#0891b2" }} />
        <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
          🏬 Gimbiya Mall
        </span>
      </div>

      {/* Role Badge + User Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Mall Button */}
        <button
          onClick={() => navigate("/mall")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 8,
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
          }}
        >
          🛍️ Mall
        </button>

        {/* Role Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 8,
            background: `${roleConfig.color}15`,
            border: `1.5px solid ${roleConfig.color}40`,
          }}
        >
          <span style={{ color: roleConfig.color }}>{roleConfig.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
            {roleConfig.label}
          </span>
        </div>

        {/* User Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: dropdownOpen ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: `${roleConfig.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {user.name?.split(" ")[0]}
            <ChevronDown className="w-4 h-4" style={{ transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "" }} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                background: "rgba(15, 23, 42, 0.98)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 8,
                backdropFilter: "blur(8px)",
                minWidth: 200,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div style={{ padding: 12, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <p style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", margin: 0 }}>Signed in as</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 4, marginTop: 0 }}>
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => {
                  navigate(roleConfig.dashPath);
                  setDropdownOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"))}
                onMouseLeave={(e) => ((e.currentTarget.style.background = "transparent"))}
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  navigate("/");
                  setDropdownOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"))}
                onMouseLeave={(e) => ((e.currentTarget.style.background = "transparent"))}
              >
                Home
              </button>

              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    border: "none",
                    background: "transparent",
                    color: "#ef4444",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"))}
                  onMouseLeave={(e) => ((e.currentTarget.style.background = "transparent"))}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
