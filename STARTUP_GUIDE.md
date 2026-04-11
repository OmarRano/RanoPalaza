# Sahad Stores — Startup Guide

## Quick Start — Two Options

---

### Option A: Frontend Only (Demo — No Server Needed)

The fastest way to see the full platform. No MongoDB, no backend required.

```bash
# 1. Enter project root
cd shopspace-final2

# 2. Install dependencies
pnpm install

# 3. Start Vite frontend only
pnpm run dev:ui
```

Open **http://localhost:5173**

Every page is open. Use the **Demo Navigator bar** at the bottom to jump between all 8 role dashboards.

---

### Option B: Full Stack (Frontend + Backend + MongoDB)

```bash
# 1. Set up MongoDB (one of three ways)

# Docker:
docker run -d -p 27017:27017 --name sahad-mongo mongo:7

# Atlas (cloud): edit .env → MONGODB_URI=mongodb+srv://...

# Local MongoDB: make sure mongod is running

# 2. Install and start
pnpm install
pnpm dev
```

Open **http://localhost:3000**

Staff accounts are seeded automatically on first run.

---

## Project Structure

```
shopspace-final2/              ← PROJECT ROOT — run all commands from here
├── client/                    ← Frontend (React + Vite + Tailwind v4)
│   ├── index.html
│   └── src/
│       ├── App.tsx            ← Router + Demo Navigator bar
│       ├── main.tsx           ← React entry point
│       ├── index.css          ← Tailwind v4 + design tokens
│       ├── lib/trpc.ts        ← DEMO: mock tRPC with real data shapes
│       ├── _core/hooks/
│       │   └── useAuth.ts     ← DEMO: mock user per route
│       ├── pages/             ← 22 pages across 6 role groups
│       └── components/
│           └── DashboardHeader.tsx
├── server/                    ← Backend (Express + tRPC + MongoDB)
│   ├── _core/index.ts         ← Server entry point
│   ├── routers.ts             ← All tRPC routes
│   ├── auth.ts                ← Login / signup / logout
│   └── models/                ← Mongoose schemas
├── shared/const.ts            ← Shared constants
├── vite.config.ts             ← ONE config at root (no client/vite.config.ts)
├── package.json               ← ONE package.json at root (no client/package.json)
└── .env                       ← Environment variables
```

---

## All URLs (Demo Mode — No Login Required)

| URL | Role | Page |
|-----|------|------|
| `/` | — | Landing page |
| `/products` | — | Product catalog (8 products) |
| `/buyer` | Buyer | Dashboard |
| `/cart` | Buyer | Shopping cart |
| `/checkout` | Buyer | Checkout |
| `/orders` | Buyer | Order history |
| `/profile` | Buyer | Profile |
| `/admin` | Admin | Dashboard |
| `/admin/users` | Admin | User management |
| `/admin/analytics` | Admin | Sales analytics |
| `/admin/affiliates` | Admin | Affiliate management |
| `/manager` | Manager | Dashboard |
| `/manager/products` | Manager | Product management |
| `/manager/inventory` | Manager | Inventory |
| `/manager/categories` | Manager | Categories |
| `/delivery` | Delivery | Dashboard |
| `/delivery/orders` | Delivery | My orders |
| `/affiliate` | Affiliate | Dashboard |
| `/affiliate/referrals` | Affiliate | Referral management |
| `/affiliate/earnings` | Affiliate | Earnings history |
| `/developer` | Developer | Dashboard |
| `/developer/analytics` | Developer | Platform analytics |

---

## Staff Credentials (Option B — Full Stack)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sahadstores.com | Admin@123456 |
| Manager | manager@sahadstores.com | Manager@123456 |
| Delivery | delivery@sahadstores.com | Delivery@123456 |
| Developer | developer@sahadstores.com | Developer@123456 |

Buyers self-register at `/auth`.

---

## Switching to Production

**Step 1** — Replace `client/src/lib/trpc.ts` with:
```ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers";
export const trpc = createTRPCReact<AppRouter>();
```

**Step 2** — Replace `client/src/_core/hooks/useAuth.ts` with the real version
(calls `trpc.auth.me.useQuery()` — see `AUTH_GUIDE.md`)

**Step 3** — Restore `ProtectedRoute` guards in `App.tsx`

**Step 4** — Restore `main.tsx` to use `httpBatchStreamLink`

**Step 5** — Configure `.env` with real MongoDB URI

**Step 6** — Deploy:
```bash
pnpm build:full
pnpm start
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `pnpm: command not found` | `npm install -g pnpm` |
| Blank white screen | Open browser console — look for red errors |
| Port 5173 busy | Vite auto-picks next port |
| Port 3000 busy | Set `PORT=3001` in `.env` |
| Cannot find `@shared/const` | Run `pnpm install` from project root |
| TypeScript errors in editor | Normal — demo mock types differ from real tRPC types |
