/**
 * App.tsx — Demo mode router
 *
 * All routes are publicly accessible — no auth check.
 * DemoNavigator bar lets anyone jump between every role dashboard.
 *
 * To switch to production:
 *  1. Wrap protected routes with <ProtectedRoute> again
 *  2. Replace useAuth.ts with the real tRPC-powered version
 */
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";

// Public
import Home         from "@/pages/Home";
import Auth         from "@/pages/Auth";
import NotFound     from "@/pages/NotFound";
import ProductDetail from "@/pages/ProductDetail";

// Buyer
import ProductCatalog from "@/pages/buyer/ProductCatalog";
import BuyerDashboard from "@/pages/buyer/BuyerDashboard";
import Cart           from "@/pages/buyer/Cart";
import Checkout       from "@/pages/buyer/Checkout";
import OrderHistory   from "@/pages/buyer/OrderHistory";
import OrderTracking  from "@/pages/buyer/OrderTracking";
import BuyerProfile   from "@/pages/buyer/BuyerProfile";

// Admin
import AdminDashboard      from "@/pages/admin/AdminDashboard";
import SalesAnalytics      from "@/pages/admin/SalesAnalytics";
import UserManagement      from "@/pages/admin/UserManagement";
import AffiliateManagement from "@/pages/admin/AffiliateManagement";

// Manager
import ManagerDashboard    from "@/pages/manager/ManagerDashboard";
import ProductManagement   from "@/pages/manager/ProductManagement";
import CategoryManagement  from "@/pages/manager/CategoryManagement";
import InventoryManagement from "@/pages/manager/InventoryManagement";

// Delivery
import DeliveryDashboard     from "@/pages/delivery/DeliveryDashboard";
import DeliveryOrders        from "@/pages/delivery/DeliveryOrders";
import OrderDeliveryTracking from "@/pages/delivery/OrderDeliveryTracking";

// Affiliate
import AffiliateDashboard from "@/pages/affiliate/AffiliateDashboard";
import EarningsHistory    from "@/pages/affiliate/EarningsHistory";
import ReferralManagement from "@/pages/affiliate/ReferralManagement";

// Developer
import DeveloperDashboard from "@/pages/developer/DeveloperDashboard";
import PlatformAnalytics  from "@/pages/developer/PlatformAnalytics";

// ─────────────────────────────────────────────────────────────────────────────
// Demo Navigator — floating bar at bottom of every page
// Click any button to jump straight to that role's dashboard
// ─────────────────────────────────────────────────────────────────────────────

const ROLES = [
  { label: "🏠 Home",       path: "/",           color: "#475569" },
  { label: "🛍 Products",   path: "/products",    color: "#0891b2" },
  { label: "🛒 Buyer",      path: "/buyer",       color: "#2563eb" },
  { label: "🛡 Admin",      path: "/admin",       color: "#dc2626" },
  { label: "📦 Manager",    path: "/manager",     color: "#d97706" },
  { label: "🚚 Delivery",   path: "/delivery",    color: "#16a34a" },
  { label: "🔗 Affiliate",  path: "/affiliate",   color: "#9333ea" },
  { label: "💻 Developer",  path: "/developer",   color: "#4f46e5" },
];

const SUB: Record<string, { label: string; path: string }[]> = {
  buyer:      [{ label: "Cart", path: "/cart" }, { label: "Orders", path: "/orders" }, { label: "Checkout", path: "/checkout" }, { label: "Profile", path: "/profile" }],
  cart:       [{ label: "Cart", path: "/cart" }, { label: "Orders", path: "/orders" }, { label: "Checkout", path: "/checkout" }, { label: "Profile", path: "/profile" }],
  orders:     [{ label: "Cart", path: "/cart" }, { label: "Orders", path: "/orders" }, { label: "Checkout", path: "/checkout" }, { label: "Profile", path: "/profile" }],
  checkout:   [{ label: "Cart", path: "/cart" }, { label: "Orders", path: "/orders" }, { label: "Checkout", path: "/checkout" }, { label: "Profile", path: "/profile" }],
  profile:    [{ label: "Cart", path: "/cart" }, { label: "Orders", path: "/orders" }, { label: "Checkout", path: "/checkout" }, { label: "Profile", path: "/profile" }],
  admin:      [{ label: "Users", path: "/admin/users" }, { label: "Analytics", path: "/admin/analytics" }, { label: "Affiliates", path: "/admin/affiliates" }],
  manager:    [{ label: "Products", path: "/manager/products" }, { label: "Inventory", path: "/manager/inventory" }, { label: "Categories", path: "/manager/categories" }],
  delivery:   [{ label: "Orders", path: "/delivery/orders" }],
  affiliate:  [{ label: "Referrals", path: "/affiliate/referrals" }, { label: "Earnings", path: "/affiliate/earnings" }],
  developer:  [{ label: "Analytics", path: "/developer/analytics" }],
};

function DemoNav() {
  const [location, navigate] = useLocation();
  const section = location.split("/")[1] || "home";
  const subLinks = SUB[section] ?? [];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "rgba(15,23,42,0.96)", backdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(255,255,255,.1)",
      padding: "10px 16px 14px",
      fontFamily: "'Outfit', system-ui, sans-serif",
    }}>
      {/* Top row: label + current path */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".08em", textTransform: "uppercase" }}>
          🎭 Demo Navigator
        </span>
        <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{location}</span>
      </div>

      {/* Role buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: subLinks.length ? 8 : 0 }}>
        {ROLES.map(({ label, path, color }) => {
          const seg = path === "/" ? "" : path.split("/")[1];
          const active = path === "/" ? location === "/" : location === path || location.startsWith(path + "/");
          return (
            <button key={path} onClick={() => navigate(path)} style={{
              padding: "6px 13px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700, transition: ".15s", whiteSpace: "nowrap",
              background: active ? color : "rgba(255,255,255,.1)",
              color: active ? "#fff" : "rgba(255,255,255,.75)",
              boxShadow: active ? `0 2px 12px ${color}60` : "none",
              transform: active ? "translateY(-1px)" : "none",
            }}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Sub-page links */}
      {subLinks.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,.08)", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Pages:</span>
          {subLinks.map(({ label, path }) => (
            <button key={path} onClick={() => navigate(path)} style={{
              padding: "4px 11px", borderRadius: 6, border: "1px solid rgba(255,255,255,.15)",
              background: location === path ? "rgba(255,255,255,.2)" : "transparent",
              color: location === path ? "#fff" : "rgba(255,255,255,.6)",
              fontSize: 11, fontWeight: 600, cursor: "pointer", transition: ".15s",
            }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />

      {/* pb-32 so DemoNav doesn't cover page content */}
      <div style={{ paddingBottom: 110 }}>
        <Switch>
          {/* Public */}
          <Route path="/"             component={Home} />
          <Route path="/auth"         component={Auth} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/products">    <ProductCatalog /></Route>

          {/* Buyer */}
          <Route path="/buyer">       <BuyerDashboard /></Route>
          <Route path="/cart">        <Cart /></Route>
          <Route path="/checkout">    <Checkout /></Route>
          <Route path="/orders">      <OrderHistory /></Route>
          <Route path="/orders/:id">  <OrderTracking /></Route>
          <Route path="/profile">     <BuyerProfile /></Route>

          {/* Admin */}
          <Route path="/admin">             <AdminDashboard /></Route>
          <Route path="/admin/analytics">   <SalesAnalytics /></Route>
          <Route path="/admin/users">       <UserManagement /></Route>
          <Route path="/admin/affiliates">  <AffiliateManagement /></Route>

          {/* Manager */}
          <Route path="/manager">            <ManagerDashboard /></Route>
          <Route path="/manager/products">   <ProductManagement /></Route>
          <Route path="/manager/categories"> <CategoryManagement /></Route>
          <Route path="/manager/inventory">  <InventoryManagement /></Route>

          {/* Delivery */}
          <Route path="/delivery">           <DeliveryDashboard /></Route>
          <Route path="/delivery/orders">    <DeliveryOrders /></Route>
          <Route path="/delivery/orders/:id"><OrderDeliveryTracking /></Route>

          {/* Affiliate */}
          <Route path="/affiliate">           <AffiliateDashboard /></Route>
          <Route path="/affiliate/earnings">  <EarningsHistory /></Route>
          <Route path="/affiliate/referrals"> <ReferralManagement /></Route>

          {/* Developer */}
          <Route path="/developer">           <DeveloperDashboard /></Route>
          <Route path="/developer/analytics"> <PlatformAnalytics /></Route>

          {/* 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>

      <DemoNav />
    </>
  );
}
