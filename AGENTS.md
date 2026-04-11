<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint (flat config, uses `core-web-vitals` + `typescript` from `eslint-config-next`)
- `npx tsc --noEmit` — type check (no npm script)

## Stack

- Next.js 16 (App Router only), React 19, TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss` — no `tailwind.config`; config goes in CSS with `@theme`
- HeroUI (`@heroui/react`) — styles imported in `globals.css` via `@import "@heroui/styles"`
- TanStack React Query wired up via `src/providers/query-provider.tsx` (staleTime: 60s, no refetch on focus)

## Architecture

Feature-based folder structure under `src/`:
- `src/features/` — domain modules (auth, home, …). Each feature owns its components, hooks, services, and types.
- `src/components/` — shared: `ui/` (base/reusable), `layouts/` (app shell)
- `src/hooks/` — shared custom hooks
- `src/lib/` — api-client (with token refresh), query-keys factory
- `src/providers/` — client-side context providers (QueryProvider, etc.)
- `src/types/` — shared TypeScript types
- `src/utils/` — pure utility functions (`cn`, `formatDate`, etc.)
- `src/config/` — app config derived from env vars
- `src/constants/` — static values (routes, API paths)
- `src/app/` — Next.js App Router. Route groups: `(main)/`, `(auth)/`.

Every module directory has a barrel `index.ts` — import via `@/features/home/components`, not deep paths.

## Path alias

`@/*` maps to `src/` (set in `tsconfig.json` paths).

## Style

- Font: Geist (sans + mono), loaded via `next/font/google` in `src/app/layout.tsx`
- `<html>` has `h-full antialiased`; `<body>` has `min-h-full flex flex-col`
- Use `cn()` from `@/utils` for conditional classNames
- Use `AppLink` from `@/components/ui` for navigation links (handles internal vs external automatically)

## Auth System

See `AUTH_SYSTEM.md` for complete auth architecture (JWT, token refresh, API client with automatic auth headers, auth events).
