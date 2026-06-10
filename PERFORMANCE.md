# React Performance Optimizations

This document outlines the performance optimizations applied to the EcoStep frontend to achieve high efficiency scores, minimize bundle sizes, and prevent unnecessary React re-renders.

## 1. Code Splitting & Lazy Loading
- **Next.js App Router**: Route-level components are inherently lazy-loaded by Next.js chunks per page (`/dashboard`, `/analytics`, `/history`, etc.).
- **Dynamic Client Components**: Heavy third-party libraries (like `recharts`) used inside components are dynamically imported using `next/dynamic` to prevent the initial JavaScript bundle from bloating. Fallback UI skeletons are displayed while chunks parse.
  - *Example:* `DashboardClient.jsx` dynamically imports `WeeklyTrendChart` and `BreakdownChart`.

## 2. API Data Fetching & Cancellation
- **AbortControllers**: All components that fetch data on mount (`DashboardClient`, `AnalyticsClient`, `HistoryClient`, `ProfileClient`, `LeaderboardClient`) use the `AbortController` API.
- If a user navigates away from a page before the data fetch completes, the network request is immediately cancelled in the `useEffect` cleanup function.
- This prevents `setState` calls on unmounted components (React warnings) and frees up browser network threads.

## 3. Memoization & Re-render Prevention
- **`React.memo`**: Wrapper applied to static or semi-static components (e.g., `Sidebar`, `EditModal`) so they do not unnecessarily re-render when parent state updates.
- **`useMemo`**: Used for expensive data reductions or calculations.
  - *Example:* `totalCo2` calculation in `HistoryClient` is memoized so it only recalculates when the `activities` array changes, not on unrelated state updates.
- **`useCallback`**: Applied to functions passed down as props or used in dependency arrays (`fetchActivities`, `handleDelete`) to maintain referential equality across renders.

## 4. Build Configuration
- **`next.config.mjs`**: 
  - Explicitly enabled `compress: true` for GZIP/Brotli payload compression.
  - Implemented immutable `Cache-Control` headers (`public, max-age=31536000, immutable`) for static assets (images, fonts) to leverage maximum browser caching.

## 5. UI Perceived Performance
- **Skeletons with Delays**: The dashboard uses a skeleton loader, but the skeleton only renders if the API takes longer than 200ms. This prevents a jarring "skeleton flash" if the data is already cached or the connection is extremely fast.

---
**Maintained by:** EcoStep Performance Engineering Team
