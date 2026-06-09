# 🌱 EcoStep Frontend

Next.js 14 frontend for **EcoStep** — a personal carbon footprint tracker. Connects to the Express.js backend at `https://ecostep-backend.onrender.com`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (Radix primitives) |
| Charts | Recharts |
| API | Axios |
| Auth Storage | js-cookie |
| Forms | React Hook Form |
| Toasts | Sonner |

---

## Quick Start

### 1. Prerequisites

Make sure the **EcoStep backend** is running first:

```bash
# In the ecostep-backend/ directory:
npm run dev
# Server will be at https://ecostep-backend.onrender.com
```

### 2. Install and Run Frontend

```bash
cd ecostep-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Environment Variables

One env var is preconfigured in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://ecostep-backend.onrender.com/api
```

---

## Project Structure

```
ecostep-frontend/
├── app/
│   ├── layout.jsx               Root layout (Toaster, fonts)
│   ├── page.jsx                 Redirect: /dashboard or /login
│   ├── (auth)/login/page.jsx    Login form
│   ├── (auth)/register/page.jsx Register form
│   └── (app)/
│       ├── layout.jsx           Protected layout with Sidebar
│       ├── dashboard/page.jsx   Dashboard (metrics, charts)
│       ├── log/page.jsx         Log activities + history
│       └── tips/page.jsx        AI sustainability tips
├── components/
│   ├── Sidebar.jsx              Desktop sidebar + mobile bottom nav
│   ├── dashboard/               MetricCards, BreakdownChart, CompareBar, RecentActivity
│   ├── log/                     ActivityForm, ActivityList
│   └── tips/                    TipCard
├── lib/
│   ├── api.js                   Axios + JWT interceptors
│   ├── carbonFactors.js         Emission factors + calculateCO2()
│   └── utils.js                 cn() helper
└── hooks/
    ├── useAuth.js               Auth state + login/logout
    └── useActivities.js         Activity CRUD + summary
```

---

## Pages

- **`/login`** — Email/password, saves JWT cookie, redirects to /dashboard
- **`/register`** — Name/email/password, same cookie flow
- **`/dashboard`** — KPI cards, breakdown chart, compare bar, recent activities
- **`/log`** — Activity form with live CO2 preview + full activity list with delete
- **`/tips`** — AI tips via Claude API, weekly challenge card

## Available Scripts

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```
