/**
 * trpc.ts — Demo Mode Mock Client
 *
 * In demo mode, this file exports a `trpc` object where every
 * useQuery() returns instant mock data and every useMutation()
 * simulates success after a short delay.
 *
 * No server, no MongoDB, no network calls needed.
 *
 * TO SWITCH TO PRODUCTION:
 *   Replace this entire file with:
 *
 *   import { createTRPCReact } from "@trpc/react-query";
 *   import type { AppRouter } from "../../../server/routers";
 *   export const trpc = createTRPCReact<AppRouter>();
 */

import { useState, useEffect, useRef } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PRODUCTS = [
  { _id: "p1", id: "p1", name: "Premium Wireless Headphones", description: "Crystal clear audio with noise cancellation", finalPrice: 8500, baseSalePrice: 7000, costPrice: 4000, commissionPercent: 10, stockQuantity: 45, soldQuantity: 230, isFeatured: true, isActive: true, images: [], categoryId: { name: "Electronics" } },
  { _id: "p2", id: "p2", name: "USB-C Fast Charger 65W", description: "Charge your devices in minutes", finalPrice: 3200, baseSalePrice: 2800, costPrice: 1500, commissionPercent: 10, stockQuantity: 120, soldQuantity: 580, isFeatured: true, isActive: true, images: [], categoryId: { name: "Electronics" } },
  { _id: "p3", id: "p3", name: "Leather Office Chair", description: "Ergonomic design for all-day comfort", finalPrice: 45000, baseSalePrice: 40000, costPrice: 22000, commissionPercent: 12, stockQuantity: 12, soldQuantity: 67, isFeatured: false, isActive: true, images: [], categoryId: { name: "Furniture" } },
  { _id: "p4", id: "p4", name: "Stainless Steel Water Bottle", description: "Keeps drinks cold for 24 hours", finalPrice: 2800, baseSalePrice: 2500, costPrice: 900, commissionPercent: 10, stockQuantity: 200, soldQuantity: 1200, isFeatured: true, isActive: true, images: [], categoryId: { name: "Kitchen" } },
  { _id: "p5", id: "p5", name: "Mechanical Gaming Keyboard", description: "RGB backlit with tactile switches", finalPrice: 15000, baseSalePrice: 13000, costPrice: 7500, commissionPercent: 10, stockQuantity: 34, soldQuantity: 145, isFeatured: false, isActive: true, images: [], categoryId: { name: "Electronics" } },
  { _id: "p6", id: "p6", name: "Smart LED Desk Lamp", description: "3 colour modes, touch dimmer", finalPrice: 6500, baseSalePrice: 5800, costPrice: 2800, commissionPercent: 10, stockQuantity: 78, soldQuantity: 320, isFeatured: true, isActive: true, images: [], categoryId: { name: "Electronics" } },
  { _id: "p7", id: "p7", name: "Yoga Mat Premium", description: "Non-slip surface, 6mm thick", finalPrice: 4200, baseSalePrice: 3800, costPrice: 1600, commissionPercent: 10, stockQuantity: 56, soldQuantity: 445, isFeatured: false, isActive: true, images: [], categoryId: { name: "Sports" } },
  { _id: "p8", id: "p8", name: "Coffee Maker Pro", description: "Brews 12 cups in under 10 minutes", finalPrice: 28000, baseSalePrice: 25000, costPrice: 13000, commissionPercent: 12, stockQuantity: 4, soldQuantity: 89, isFeatured: true, isActive: true, images: [], categoryId: { name: "Kitchen" } },
];

const MOCK_CATEGORIES = [
  { _id: "c1", id: "c1", name: "Electronics",  description: "Gadgets and devices",   isActive: true },
  { _id: "c2", id: "c2", name: "Furniture",    description: "Home and office",        isActive: true },
  { _id: "c3", id: "c3", name: "Kitchen",      description: "Cooking essentials",     isActive: true },
  { _id: "c4", id: "c4", name: "Sports",       description: "Fitness and recreation", isActive: true },
  { _id: "c5", id: "c5", name: "Fashion",      description: "Clothing and accessories", isActive: true },
];

const MOCK_ORDERS = [
  { _id: "o1", orderId: "ORD-2026-001", status: "delivered",  totalAmount: 15500, finalAmount: 15500, createdAt: "2026-03-28", items: [{ name: "Premium Wireless Headphones", quantity: 1, finalPrice: 8500 }, { name: "USB-C Fast Charger", quantity: 2, finalPrice: 3500 }], buyerId: { name: "Peter Nwosu", email: "buyer@sahadstores.com", phone: "+234 805 123 4567" }, shippingAddress: "45 Wuse Zone 3", shippingCity: "Abuja", shippingCountry: "Nigeria", buyerPhone: "+234 805 123 4567" },
  { _id: "o2", orderId: "ORD-2026-002", status: "in_transit", totalAmount: 8200,  finalAmount: 8200,  createdAt: "2026-03-27", items: [{ name: "Smart LED Desk Lamp", quantity: 1, finalPrice: 6500 }], buyerId: { name: "Amara Okon", email: "amara@example.com", phone: "+234 801 234 5678" }, shippingAddress: "12 Garki Area 11", shippingCity: "Abuja", shippingCountry: "Nigeria", buyerPhone: "+234 801 234 5678" },
  { _id: "o3", orderId: "ORD-2026-003", status: "processing", totalAmount: 22900, finalAmount: 22900, createdAt: "2026-03-25", items: [{ name: "Leather Office Chair", quantity: 1, finalPrice: 45000 }], buyerId: { name: "Emeka Nwosu", email: "emeka@example.com", phone: "+234 809 123 4567" }, shippingAddress: "8 Maitama Drive", shippingCity: "Abuja", shippingCountry: "Nigeria", buyerPhone: "+234 809 123 4567" },
  { _id: "o4", orderId: "ORD-2026-004", status: "assigned",   totalAmount: 4500,  finalAmount: 4500,  createdAt: "2026-03-24", items: [{ name: "Yoga Mat Premium", quantity: 1, finalPrice: 4200 }], buyerId: { name: "Kemi Adeola", email: "kemi@example.com", phone: "+234 812 345 6789" }, shippingAddress: "22 Lekki Phase 1", shippingCity: "Lagos", shippingCountry: "Nigeria", buyerPhone: "+234 812 345 6789" },
  { _id: "o5", orderId: "ORD-2026-005", status: "pending",    totalAmount: 3200,  finalAmount: 3200,  createdAt: "2026-03-23", items: [{ name: "USB-C Fast Charger", quantity: 2, finalPrice: 3200 }], buyerId: { name: "Fatima Bello", email: "fatima@example.com", phone: "+234 901 234 5678" }, shippingAddress: "5 Victoria Island", shippingCity: "Lagos", shippingCountry: "Nigeria", buyerPhone: "+234 901 234 5678" },
];

const MOCK_USERS = [
  { _id: "u1", name: "Amara Okonkwo",  email: "amara@example.com",   role: "buyer",     isActive: true,  isAffiliate: false, createdAt: "2026-01-15", phone: "+234 801 234 5678" },
  { _id: "u2", name: "Emeka Nwosu",    email: "emeka@example.com",   role: "manager",   isActive: true,  isAffiliate: false, createdAt: "2026-02-01", phone: "+234 809 123 4567" },
  { _id: "u3", name: "Fatima Bello",   email: "fatima@example.com",  role: "delivery",  isActive: true,  isAffiliate: false, createdAt: "2026-02-14", phone: "+234 901 234 5678" },
  { _id: "u4", name: "Chidi Obi",      email: "chidi@example.com",   role: "buyer",     isActive: false, isAffiliate: false, createdAt: "2025-12-10", phone: "+234 803 111 2222" },
  { _id: "u5", name: "Ngozi Adeyemi",  email: "ngozi@example.com",   role: "reader",    isActive: true,  isAffiliate: true,  createdAt: "2026-03-01", phone: "+234 803 456 7890" },
  { _id: "u6", name: "Bola Martins",   email: "bola@example.com",    role: "buyer",     isActive: true,  isAffiliate: false, createdAt: "2026-03-10", phone: "+234 812 999 8888" },
  { _id: "u7", name: "Tunde Ola",      email: "tunde@example.com",   role: "buyer",     isActive: true,  isAffiliate: false, createdAt: "2026-03-20", phone: "+234 805 777 6666" },
];

const MOCK_CART = [
  { _id: "ci1", quantity: 1, productId: MOCK_PRODUCTS[0] },
  { _id: "ci2", quantity: 2, productId: MOCK_PRODUCTS[1] },
];

const MOCK_REFERRALS = [
  { _id: "r1", customerName: "Tunde Ola",   date: "2026-03-28", orderValue: 8500,  commission: 127.50, status: "paid" },
  { _id: "r2", customerName: "Ada Eze",     date: "2026-03-25", orderValue: 15200, commission: 228.00, status: "paid" },
  { _id: "r3", customerName: "Bisi Oke",    date: "2026-03-20", orderValue: 6800,  commission: 102.00, status: "pending" },
  { _id: "r4", customerName: "Femi Ade",    date: "2026-03-15", orderValue: 22100, commission: 331.50, status: "paid" },
  { _id: "r5", customerName: "Ngozi James", date: "2026-03-10", orderValue: 4500,  commission: 67.50,  status: "pending" },
];

// ─── Query helpers ────────────────────────────────────────────────────────────

// Simulates a loading state then returns data (demo realism)
function useMockQuery<T>(data: T, delay = 400) {
  const [state, setState] = useState<{ data: T | undefined; isLoading: boolean; error: null }>({
    data: undefined, isLoading: true, error: null,
  });
  const resolved = useRef(false);
  useEffect(() => {
    if (resolved.current) return;
    resolved.current = true;
    const t = setTimeout(() => setState({ data, isLoading: false, error: null }), delay);
    return () => clearTimeout(t);
  }, []);
  return state;
}

// Simulates a mutation with optimistic toast feedback
function useMockMutation(onSuccess?: (data: any) => void, onError?: (e: any) => void) {
  const [isPending, setIsPending] = useState(false);
  const mutate = (input?: any) => {
    setIsPending(true);
    setTimeout(() => { setIsPending(false); onSuccess?.({ success: true, ...input }); }, 600);
  };
  const mutateAsync = (input?: any) => new Promise<any>((resolve) => {
    setIsPending(true);
    setTimeout(() => { setIsPending(false); resolve({ success: true, ...input }); onSuccess?.({ success: true, ...input }); }, 600);
  });
  return { mutate, mutateAsync, isPending };
}

// ─── Cart state (local, persists during session) ──────────────────────────────
let _cart = [...MOCK_CART];
const _cartListeners: (() => void)[] = [];
const notifyCart = () => _cartListeners.forEach(fn => fn());

// ─── Mock tRPC object ─────────────────────────────────────────────────────────

export const trpc = {
  // useUtils — returns invalidate helpers (no-ops in demo)
  useUtils: () => ({
    products: { list: { invalidate: () => {} }, featured: { invalidate: () => {} } },
    categories: { list: { invalidate: () => {} } },
    cart: { list: { invalidate: () => {} } },
    orders: { list: { invalidate: () => {} }, detail: { invalidate: () => {} } },
    admin: { users: { invalidate: () => {} } },
    delivery: { myOrders: { invalidate: () => {} } },
    affiliate: { myStats: { invalidate: () => {} }, getReferralLink: { invalidate: () => {} } },
  }),

  // Auth
  auth: {
    me: { useQuery: () => useMockQuery(null) },
    logout: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
    loginBuyer: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
    loginStaff: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
    signupBuyer: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
  },

  // Products
  products: {
    list:     { useQuery: (_?: any) => useMockQuery(MOCK_PRODUCTS) },
    featured: { useQuery: (_?: any) => useMockQuery(MOCK_PRODUCTS.filter(p => p.isFeatured)) },
    detail:   { useQuery: (input?: any) => useMockQuery(MOCK_PRODUCTS.find(p => p._id === input?.id) ?? MOCK_PRODUCTS[0]) },
    byCategory:{ useQuery: (input?: any) => useMockQuery(MOCK_PRODUCTS.filter(p => (p.categoryId as any)?.name === input?.categoryId)) },
    search:   { useQuery: (input?: any) => useMockQuery(MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes((input?.query ?? "").toLowerCase()))) },
    create:   { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
    update:   { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
    delete:   { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
  },

  // Categories
  categories: {
    list:   { useQuery: () => useMockQuery(MOCK_CATEGORIES) },
    create: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
    update: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
  },

  // Cart (local reactive state)
  cart: {
    list: {
      useQuery: () => {
        const [data, setData] = useState([..._cart]);
        useEffect(() => {
          const handler = () => setData([..._cart]);
          _cartListeners.push(handler);
          return () => { const i = _cartListeners.indexOf(handler); if (i > -1) _cartListeners.splice(i, 1); };
        }, []);
        return { data, isLoading: false, error: null };
      },
    },
    add: {
      useMutation: (opts?: any) => useMockMutation((data) => {
        const product = MOCK_PRODUCTS.find(p => p._id === data.productId || p.id === data.productId);
        if (product) { _cart.push({ _id: `ci${Date.now()}`, quantity: data.quantity ?? 1, productId: product }); notifyCart(); }
        opts?.onSuccess?.(data);
      }, opts?.onError),
    },
    remove: {
      useMutation: (opts?: any) => useMockMutation((data) => {
        _cart = _cart.filter(i => i._id !== data.cartItemId); notifyCart(); opts?.onSuccess?.(data);
      }, opts?.onError),
    },
    updateQuantity: {
      useMutation: (opts?: any) => useMockMutation((data) => {
        _cart = _cart.map(i => i._id === data.cartItemId ? { ...i, quantity: data.quantity } : i); notifyCart(); opts?.onSuccess?.(data);
      }, opts?.onError),
    },
    clear: {
      useMutation: (opts?: any) => useMockMutation((_data) => { _cart = []; notifyCart(); opts?.onSuccess?.(_data); }, opts?.onError),
    },
  },

  // Orders
  orders: {
    list:   { useQuery: (_?: any) => useMockQuery(MOCK_ORDERS) },
    detail: { useQuery: (input?: any) => useMockQuery(MOCK_ORDERS.find(o => o.orderId === input?.orderId) ?? MOCK_ORDERS[0]) },
    create: { useMutation: (opts?: any) => useMockMutation((d) => { opts?.onSuccess?.({ success: true, orderId: `ORD-${Date.now()}`, ...d }); }, opts?.onError) },
    cancel: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
    updateStatus: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
  },

  // Admin
  admin: {
    stats: { useQuery: () => useMockQuery({ totalUsers: MOCK_USERS.length, totalOrders: MOCK_ORDERS.length, totalProducts: MOCK_PRODUCTS.length, totalRevenue: 284500 }) },
    salesStats: { useQuery: () => useMockQuery({ totalRevenue: 284500, totalCommission: 28450, pendingOrders: 1, processingOrders: 1, deliveredOrders: 2, cancelledOrders: 0, revenueTrend: [{ month: "Jan", revenue: 32000 }, { month: "Feb", revenue: 41000 }, { month: "Mar", revenue: 38000 }, { month: "Apr", revenue: 55000 }, { month: "May", revenue: 62000 }, { month: "Jun", revenue: 56500 }] }) },
    users:       { useQuery: (_?: any) => useMockQuery(MOCK_USERS) },
    allOrders:   { useQuery: (_?: any) => useMockQuery(MOCK_ORDERS) },
    updateUserRole: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
    enableAffiliate: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
  },

  // Manager (inventory)
  inventory: {
    lowStock:     { useQuery: (_?: any) => useMockQuery(MOCK_PRODUCTS.filter(p => p.stockQuantity < 20)) },
    adjustStock:  { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
  },

  // Delivery
  delivery: {
    myOrders:     { useQuery: (_?: any) => useMockQuery(MOCK_ORDERS.filter(o => ["assigned","in_transit","delivered"].includes(o.status))) },
    updateStatus: { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
    assignOrder:  { useMutation: (opts?: any) => useMockMutation(opts?.onSuccess, opts?.onError) },
  },

  // Affiliate
  affiliate: {
    myStats:       { useQuery: () => useMockQuery({ totalReferrals: MOCK_REFERRALS.length, totalEarnings: 856.50, pendingEarnings: 169.50, paidEarnings: 687.00 }) },
    getReferralLink: { useQuery: () => useMockQuery({ code: "NGZ-001", url: "http://localhost:3000/products?ref=NGZ-001" }) },
    myReferrals:   { useQuery: () => useMockQuery(MOCK_REFERRALS) },
  },

  // Developer
  developer: {
    platformStats: { useQuery: () => useMockQuery({ totalUsers: MOCK_USERS.length, totalOrders: MOCK_ORDERS.length, totalProducts: MOCK_PRODUCTS.length, activeStores: 3 }) },
    salesStats:    { useQuery: () => useMockQuery({ totalRevenue: 284500, totalCommission: 28450, deliveredOrders: 2, revenueTrend: [{ month: "Jan", revenue: 32000 }, { month: "Feb", revenue: 41000 }, { month: "Mar", revenue: 38000 }, { month: "Apr", revenue: 55000 }, { month: "May", revenue: 62000 }, { month: "Jun", revenue: 56500 }] }) },
  },

  // Payment
  payment: {
    initiatePayment: {
      useMutation: (opts?: any) => useMockMutation(
        (d) => opts?.onSuccess?.({ success: true, paymentLink: null, message: "Demo mode — payment skipped", ...d }),
        opts?.onError
      ),
    },
  },

  // Provider (no-op in demo)
  Provider: ({ children }: { children: React.ReactNode }) => children,
};
