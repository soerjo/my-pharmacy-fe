<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint flat config (`eslint.config.mjs`, extends `core-web-vitals` + `typescript`)
- `npx tsc --noEmit` — type check (no npm script)
- No test framework is configured

## Stack

- Next.js 16 (App Router only), React 19, TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss` — `tailwind.config.js` exists but is a v3 leftover; do not edit it
- HeroUI (`@heroui/react`) — styles imported in `globals.css` via `@import "@heroui/styles"`
- TanStack React Query wired up via `src/providers/query-provider.tsx` (staleTime: 60s, no refetch on focus)
- Zustand for client-side state (`src/stores/`)
- React Hook Form + Zod (v4) for form validation
- `jwt-decode` for JWT token parsing

## Stale config files (ignore these)

- `tailwind.config.js` — v3 leftover; Tailwind v4 uses CSS-based config
- `.eslintrc.json`, `.eslintignore` — legacy format; ESLint 9 uses `eslint.config.mjs`
- `next.config.js` — removed; `.ts` version is the active one
- `example.env.local` — stale; use `.env.example` for required env vars

## Architecture

Folder structure under `src/`:
- `src/app/` — Next.js App Router. Route groups: `(main)/` (authenticated pages), `(auth)/` (login, register, forgot/reset password).
- `src/services/` — typed API service objects (`auth-service`, `warehouse-service`, `depo-service`). Each wraps calls to the corresponding backend via `clients.*` from `api-client`.
- `src/hooks/` — React Query hooks (`use-*.ts/tsx`). One per domain entity.
- `src/stores/` — Zustand stores for client state (sidebar, patients, products, rooms, admissions).
- `src/components/` — shared: `ui/` (base/reusable), `layouts/` (app shell), plus domain subdirs (`patients/`, `admissions/`, `products/`, `rooms/`, `auth/`, `dispense-orders/`).
- `src/providers/` — React context providers. `Providers` in `index.tsx` wraps QueryProvider → AuthProvider.
- `src/lib/` — `api-client.ts` (multi-backend client with token refresh), `token-manager.ts` (JWT storage/validation), `query-keys.ts` (TanStack key factory).
- `src/types/` — shared TypeScript types (domain entities, API response shapes, auth types).
- `src/utils/` — pure utility functions (`cn`, `formatDate`, etc.).
- `src/config/` — app config derived from env vars.
- `src/constants/` — static values (`ROUTES`, `API_ROUTES`).

Every module directory has a barrel `index.ts` — import via `@/components/ui`, `@/services/auth-service`, etc., not deep paths.

## Multi-backend API architecture

Three separate backend microservices, each with its own `NEXT_PUBLIC_API_*` env var and dedicated `ApiClient` instance:

| Client | Env var | Service file | Domain |
|---|---|---|---|
| `clients.auth` | `NEXT_PUBLIC_API_AUTH_SERVICE` | `auth-service.ts` | Auth, users |
| `clients.warehouse` | `NEXT_PUBLIC_API_WAREHOUSE_SERVICE` | `warehouse-service.ts` | Products, manufacturers, product categories/types, UoMs |
| `clients.depo` | `NEXT_PUBLIC_API_DEPO_SERVICE` | `depo-service.ts` | Patients, admissions, rooms, room categories, dispense orders |

All clients share automatic Bearer token injection, 401 retry with token refresh, and `auth:unauthorized` custom event dispatch on failure.

API response shape: `{ success: boolean; data: T; message?: string; errors?: Record<string, string[]> }`

## Environment variables

Required (see `.env.example`):
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_AUTH_SERVICE`
- `NEXT_PUBLIC_API_WAREHOUSE_SERVICE`
- `NEXT_PUBLIC_API_DEPO_SERVICE`
- `NEXT_PUBLIC_MAX_TOKEN_RETRY_ATTEMPTS` (default: 3)

## Path alias

`@/*` maps to `src/` (set in `tsconfig.json` paths).

## Style

- Font: Geist (sans + mono), loaded via `next/font/google` in `src/app/layout.tsx`
- `<html>` has `h-full antialiased`; `<body>` has `min-h-full flex flex-col`
- Use `cn()` from `@/utils` for conditional classNames
- Use `AppLink` from `@/components/ui` for navigation links (handles internal vs external automatically)
- Prettier: semi, single quotes, trailing comma all, printWidth 120, tabWidth 2

## Package manager

Bun is preferred (`bun.lock` present, `.npmrc` sets `package-lock=false`). npm scripts work via both npm and bun.

## Auth system

See `AUTH_SYSTEM.md` for full architecture. Key points:
- JWT tokens stored in localStorage via `TokenManager` (`src/lib/token-manager.ts`)
- Token refresh with retry is implemented in `ApiClient` (`src/lib/api-client.ts`)
- `AuthProvider` (`src/providers/auth-provider.tsx`) wraps the app; `useAuth()` hook exposes `isAuthenticated`, `login`, `logout`, etc.
- `auth:unauthorized` custom window event dispatched on auth failure — providers listen for it

## Docker

- `next.config.ts` sets `output: "standalone"` for Docker deployment
- `Dockerfile` is multi-stage (deps → build → runner), uses `node:20-alpine`, runs as non-root user
- `docker-compose.yml` expects an external `internal_net` network
- Build-time env vars injected via Docker build args
