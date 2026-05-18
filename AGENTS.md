<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint flat config (`eslint.config.mjs`, extends `core-web-vitals` + `typescript`)
- `npx tsc --noEmit` — type check (no npm script for this)
- No test framework is configured

## Stack

- Next.js 16 (App Router only), React 19, TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss` — `tailwind.config.js` exists but is a v3 leftover; do not edit it
- HeroUI v3 (`@heroui/react`) — NOT the same as NextUI or older HeroUI. Component APIs differ significantly. Always check `node_modules/@heroui/react/dist/` before writing code.
- TanStack React Query via `src/providers/query-provider.tsx` (staleTime: 60s, no refetch on focus, global error handler on QueryCache + MutationCache)
- Zustand for client-side state (`src/stores/`) — uses `devtools` middleware
- React Hook Form + Zod **v4** for form validation — `@hookform/resolvers` v5 supports Zod v4 via the standard `@hookform/resolvers/zod` import (no special v4 import path needed)
- `jwt-decode` for JWT token parsing
- `@gravity-ui/icons` for iconography

## Stale config files (ignore these)

- `tailwind.config.js` — v3 leftover; Tailwind v4 uses CSS-based config
- `.eslintrc.json`, `.eslintignore` — legacy format; ESLint 9 uses `eslint.config.mjs`
- `.env.example`, `example.env.local` — reference stale env vars that no longer exist
- `AUTH_SYSTEM.md` — references old import paths and single-backend architecture. Trust the code, not this doc.

## Architecture

- `src/app/` — App Router. Route groups: `(main)/` (authenticated), `(auth)/` (login, register, forgot/reset password).
- `src/services/` — typed API service objects, one per backend. Import directly (e.g., `@/services/auth-service`).
- `src/hooks/` — React Query hooks (`use-*.ts/tsx`). One per entity. Also `ProtectedRoute` / `GuestRoute` in `use-auth.tsx`.
- `src/stores/` — Zustand stores. Fine-grained: auth stores + domain entity stores.
- `src/components/` — `ui/` (shared/base), `layouts/` (app shell), domain subdirs.
- `src/lib/` — `api-client.ts` (multi-backend client), `token-manager.ts`, `query-keys.ts`, `create-entity-store.ts`.
- `src/types/` — Zod schemas + TypeScript types. Most modules have barrel `index.ts`.

## Multi-backend API architecture

Three separate backends, each with its own `ApiClient` instance:

| Client | Env var | Service | Domain |
|---|---|---|---|
| `clients.auth` | `NEXT_PUBLIC_API_AUTH_SERVICE` | `auth-service.ts` | Auth, users, roles, permissions |
| `clients.warehouse` | `NEXT_PUBLIC_API_WAREHOUSE_SERVICE` | `warehouse-service.ts` | Products, manufacturers, categories, types, UoMs |
| `clients.depo` | `NEXT_PUBLIC_API_DEPO_SERVICE` | `depo-service.ts` | Patients, admissions, rooms, dispense orders |

All clients: auto Bearer token injection, 401 retry with refresh, `auth:unauthorized` event on failure.

## API response shape

Standard: `ApiResponse<T>` — `{ statusCode, message?, data: T, timestamp?, path? }`
Paginated: `PaginatedResponse<T>` — `{ data: T[], meta: { total, page, limit, totalPages, hasNext, hasPrev } }`

## Environment variables

`NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_AUTH_SERVICE`, `NEXT_PUBLIC_API_WAREHOUSE_SERVICE`, `NEXT_PUBLIC_API_DEPO_SERVICE`, `NEXT_PUBLIC_MAX_TOKEN_RETRY_ATTEMPTS` (default: 3)

## Path alias

`@/*` → `src/`

## Style

- `cn()` from `@/utils` for conditional classNames
- `AppLink` from `@/components/ui` for navigation (handles internal vs external)
- Prettier: semi, single quotes, trailing comma all, printWidth 120, tabWidth 2
- No code comments unless explicitly requested

## HeroUI v3 Table components

`Table` is built on `react-aria-components`. Correct nesting:

```tsx
<Table>
  <Table.ResizableContainer aria-label="...">
    <TableScrollContainer>
      <TableContent>
        <TableHeader>...</TableHeader>
        <TableBody items={data}>{(item) => <TableRow>...</TableRow>}</TableBody>
      </TableContent>
    </TableScrollContainer>
    <TableFooter>{/* pagination */}</TableFooter>
  </Table.ResizableContainer>
</Table>
```

- `Table.ResizableContainer` is required — omitting it breaks layout
- `TableScrollContainer` handles horizontal overflow; external `overflow-x-auto` wrappers will NOT work
- `TableFooter` goes inside `ResizableContainer` but outside `TableScrollContainer`
- Both `TableContent`/`TableScrollContainer` and compound `Table.Content`/etc. patterns work
- The shared `DataTable<T>` component handles this nesting automatically

## Package manager

npm. `.npmrc` says `package-lock=false` but `package-lock.json` exists (npm creates it regardless).

## React Query + Zustand patterns

Server state → React Query hooks. Client UI state (filters, pagination, forms) → Zustand stores. Do NOT mix.

### New domain entity checklist

**Full CRUD entity** (needs all 8 files):
1. `src/types/<entity>.ts` — Zod schema + TypeScript types, barrel-export from `src/types/index.ts`
2. `src/lib/query-keys.ts` — add `all`, `list(params?)`, `detail(id)` keys
3. `src/services/<backend>-service.ts` — typed methods using `clients.auth|warehouse|depo`
4. `src/stores/<entity>-store.ts` — via `createEntityStore<T, F>()` from `src/lib/create-entity-store.ts`
5. `src/hooks/use-<entity>.ts` — React Query hook, reads from store
6. `src/components/<entity>/<entity>-table.tsx` — uses `DataTable<T>`
7. `src/components/<entity>/<entity>-form.tsx` — React Hook Form + Zod
8. `src/app/(main)/<route>/page.tsx` — page component

**Read-only/reference entity** (dropdown data, no CRUD): only needs types, query keys, service methods, and a hook — no store, no table/form/page. See `use-manufacturers.ts` for example.

### DataTable pattern

All entity list pages use `DataTable<T>` from `@/components/ui`. See `data-table.tsx` for full props. Critical details:

- **`formId` is critical**: `renderForm` receives `(onClose, formId, onSubmittingChange)`. The form MUST set `id={formId}` on its `<form>` element — the modal Save button uses `form={formId}` to submit. `formId` is always `"data-table-form"`.
- **Don't create per-entity** pagination, toolbar, or row files — all handled by shared components (`TablePagination`, `TableToolbar`).
- Extra toolbar filters: pass via `toolbarExtra` prop.
- Per-row custom modals: render trigger directly in `renderRow` inside a `TableCell`.
- Optional export button: pass via `exportButton` prop.

### Domain store (Zustand)

Use `createEntityStore<T, F>(defaultFilters, devtoolsName)` from `src/lib/create-entity-store.ts`. Produces: `filters`, `pagination`, `isFormOpen`, `editingEntity`, `deletingId`, plus setters. Key facts:

- The editing entity field is always `editingEntity` (not `editingPatient`, `editingRoom`, etc.) — required by `DataTable`.
- `setFilters` resets pagination. `setPageSize` resets page to 1.
- All stores use `devtools` middleware except `app-store.ts`.

### Domain list hook pattern

Each `use<Entity>()` hook:
- Reads `filters`/`pagination` from store via selectors
- `select: (response) => response.data` to unwrap `ApiResponse`
- `placeholderData: keepPreviousData`
- Mutations invalidate `queryKeys.<entity>.all`
- **Exposes store actions via `<Store>.getState()`** (not hooks) so they don't cause re-renders

### Search hook pattern

`use<Entity>Search(search, limit = 20)` — debounced, returns `T[]`, used by `AsyncAutocomplete` wrappers. Create `src/hooks/use-<entity>-search.ts` + `src/components/ui/<entity>-autocomplete.tsx`.

### Query key factory

`src/lib/query-keys.ts` — every entity has `all`, `list(params?)`, some have `detail(id)`. Mutations invalidate `all`.

## Error handling

`QueryProvider` applies `onServerError` globally to all query/mutation errors. Domain mutations rely on this global handler. Auth forms call it explicitly.

## Auth system

- JWT in localStorage via `TokenManager` (`src/lib/token-manager.ts`)
- Token refresh with retry in `ApiClient` (`src/lib/api-client.ts`)
- `AuthInitializer` (`src/providers/auth-provider.tsx`) — NOT a context provider, just calls `verify()` on mount
- Auth state in `useAuthStore` (Zustand) — `isAuthenticated`, `isLoading`, `verify`, `logout`
- `ProtectedRoute`/`GuestRoute` in `src/hooks/use-auth.tsx`
- `auth:unauthorized` window event on auth failure
- Login store calls `useAuthStore.getState().setAuthenticated(true)` after login (cross-store via `.getState()`)

## Docker

- `output: "standalone"` in `next.config.ts`
- Multi-stage `Dockerfile` (node:20-alpine, non-root user)
- `docker-compose.yml` expects external `internal_net` network
- Build-time env vars via Docker build args

## Dev configuration

`next.config.ts` has `allowedDevOrigins: ['100.64.62.59']` — update if you need external IP access in dev.
