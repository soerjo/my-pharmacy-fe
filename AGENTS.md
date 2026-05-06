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
- HeroUI v3 (`@heroui/react`) — styles imported in `globals.css` via `@import "@heroui/styles"`. This is NOT the same as NextUI or older HeroUI versions. Component APIs, slots, and structure differ significantly. Always check the installed version's source in `node_modules/@heroui/react/dist/` before writing code.
- TanStack React Query wired up via `src/providers/query-provider.tsx` (staleTime: 60s, no refetch on focus)
- Zustand for client-side state (`src/stores/`) — uses `devtools` middleware
- React Hook Form + Zod (v4) for form validation
- `jwt-decode` for JWT token parsing
- `@gravity-ui/icons` for iconography

## Stale config files (ignore these)

- `tailwind.config.js` — v3 leftover; Tailwind v4 uses CSS-based config
- `.eslintrc.json`, `.eslintignore` — legacy format; ESLint 9 uses `eslint.config.mjs`
- `next.config.js` — removed; `.ts` version is the active one
- `.env.example` — stale; lists `NEXT_PUBLIC_API_URL` which no longer exists. Real env vars are the three service URLs below.
- `example.env.local` — stale; references `NEXT_PUBLIC_BACKEND_URL` which no longer exists.
- `AUTH_SYSTEM.md` — stale; references old import paths (`@/features/auth/*`) and single-backend architecture. Trust the code, not this doc.

## Architecture

Folder structure under `src/`:
- `src/app/` — Next.js App Router. Route groups: `(main)/` (authenticated pages), `(auth)/` (login, register, forgot/reset password).
- `src/services/` — typed API service objects (`auth-service`, `warehouse-service`, `depo-service`). Each wraps calls to the corresponding backend via `clients.*` from `api-client`.
- `src/hooks/` — React Query hooks (`use-*.ts/tsx`). One per domain entity. Also contains `ProtectedRoute` and `GuestRoute` components in `use-auth.tsx`.
- `src/stores/` — Zustand stores for client state. Fine-grained: separate stores for `auth-store`, `login-store`, `register-store`, `forgot-password-store`, `reset-password-store`, plus domain stores (patients, products, rooms, admissions, etc.).
- `src/components/` — shared: `ui/` (base/reusable), `layouts/` (app shell), plus domain subdirs (`patients/`, `admissions/`, `products/`, `rooms/`, `auth/`, `dispense-orders/`).
- `src/providers/` — React context providers. `Providers` in `index.tsx` wraps `QueryProvider` → `AuthInitializer`.
- `src/lib/` — `api-client.ts` (multi-backend client with token refresh), `token-manager.ts` (JWT storage/validation), `query-keys.ts` (TanStack key factory).
- `src/types/` — shared TypeScript types (domain entities, API response shapes, auth types).
- `src/utils/` — pure utility functions (`cn`, `formatDate`, etc.).
- `src/config/` — app config derived from env vars.
- `src/constants/` — static values (`ROUTES`, `APP_NAME`).

Every module directory has a barrel `index.ts` — import via `@/components/ui`, `@/services/auth-service`, etc., not deep paths.

## Multi-backend API architecture

Three separate backend microservices, each with its own `NEXT_PUBLIC_API_*` env var and dedicated `ApiClient` instance:

| Client | Env var | Service file | Domain |
|---|---|---|---|
| `clients.auth` | `NEXT_PUBLIC_API_AUTH_SERVICE` | `auth-service.ts` | Auth, users |
| `clients.warehouse` | `NEXT_PUBLIC_API_WAREHOUSE_SERVICE` | `warehouse-service.ts` | Products, manufacturers, product categories/types, UoMs |
| `clients.depo` | `NEXT_PUBLIC_API_DEPO_SERVICE` | `depo-service.ts` | Patients, admissions, rooms, room categories, dispense orders |

All clients share automatic Bearer token injection, 401 retry with token refresh, and `auth:unauthorized` custom event dispatch on failure.

## API response shape

Standard response (`ApiResponse<T>`):
```ts
{ statusCode: number; message?: string; data: T; timestamp?: string; path?: string }
```

Paginated response (`PaginatedResponse<T>`):
```ts
{ data: T[]; meta: { total: number; page: number; limit: number; totalPages: number; hasNext: boolean; hasPrev: boolean } }
```

## Environment variables

Required:
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

## HeroUI v3 Table components

HeroUI v3's `Table` is built on `react-aria-components`. The component structure differs from NextUI and older HeroUI versions. The correct nesting order:

```tsx
<Table>
  <Table.ResizableContainer aria-label="...">
    <TableScrollContainer>    {/* overflow-x-auto — enables horizontal scroll on mobile */}
      <TableContent>           {/* <table> element */}
        <TableHeader>...</TableHeader>
        <TableBody items={data}>
          {(item) => <TableRow key={item.id}><TableCell>{item.name}</TableCell></TableRow>}
        </TableBody>
      </TableContent>
    </TableScrollContainer>
    <TableFooter>{/* pagination */}</TableFooter>
  </Table.ResizableContainer>
</Table>
```

**Important:**
- `Table.ResizableContainer` wraps everything inside `<Table>` — it is required for proper layout. Omitting it breaks scrolling and column behavior.
- `TableScrollContainer` handles horizontal overflow. The table root uses `overflow-clip`, so external `overflow-x-auto` divs will NOT work. `TableScrollContainer` must sit between `ResizableContainer` and `TableContent`.
- Do NOT add external `overflow-x-auto` wrappers around the table.
- `TableFooter` stays inside `ResizableContainer` but outside `TableScrollContainer` so it remains full-width.
- The shared `DataTable<T>` component in `src/components/ui/data-table.tsx` handles this nesting automatically.
- Compound component pattern (`Table.ResizableContainer`, `Table.Content`, `Table.Header`, etc.) also works as alternatives to named imports.

## Package manager

npm is the package manager (`package-lock.json` present). `.npmrc` sets `package-lock=false` but the lockfile exists regardless.

## React Query + Zustand patterns

Server state (fetched data) goes in React Query hooks. Client UI state (filters, pagination, form open/close, editing selection) goes in Zustand stores. Do NOT mix these.

### New domain entity checklist

For each domain entity, create these files:
1. `src/types/<entity>.ts` — Zod schema + TypeScript types, barrel-exported from `src/types/index.ts`
2. `src/lib/query-keys.ts` — add key factory (`all`, `list(params)`, `detail(id)`)
3. `src/services/<backend>-service.ts` — add typed methods using `clients.auth|warehouse|depo`
4. `src/stores/<entity>-store.ts` — Zustand store via `createEntityStore<T, F>()` factory from `src/lib/create-entity-store.ts`
5. `src/hooks/use-<entity>.ts` — React Query hook reading filters/pagination from store
6. `src/components/<entity>/<entity>-table.tsx` — table page using `DataTable<T>` from `@/components/ui`
7. `src/components/<entity>/<entity>-form.tsx` — entity create/edit form (React Hook Form + Zod)
8. `src/app/(main)/<route>/page.tsx` — page component rendering the table

### DataTable pattern

All entity list pages use the shared `DataTable<T>` component from `@/components/ui/data-table`. It handles:
- Loading spinner
- Error state with retry
- `TableToolbar` — debounced search input + "Add" button + optional extra filters slot
- `TablePagination` — page size selector + navigation (shared, no per-entity copy)
- `TableScrollContainer` — horizontal scroll on mobile (built into `DataTable`, no need to add it per-entity)
- Form modal — controlled via `useOverlayState` from HeroUI, opens for create/edit
- Empty state messaging

**Key shared components** (all in `src/components/ui/`):
| Component | Purpose |
|---|---|
| `DataTable<T>` | Full table page shell (toolbar → modal → table → pagination) |
| `TablePagination` | Page size select + page navigation (replaces per-entity pagination files) |
| `TableToolbar` | Title + debounced search + add button + optional extra slot |

**How to use DataTable** (minimal example for a new entity):

```tsx
// src/components/widgets/widget-table.tsx
"use client";

import { useShallow } from "zustand/react/shallow";
import { Button, TableCell, TableColumn, TableRow } from "@heroui/react";
import { DataTable } from "@/components/ui/data-table";
import { useWidgets } from "@/hooks/use-widgets";
import { useWidgetsStore } from "@/stores/widgets-store";
import { WidgetForm } from "./widget-form";
import type { Widget } from "@/types";

export function WidgetsTable() {
  const { widgets, isLoading, error, pagination, paginationMeta, setPage, setPageSize } = useWidgets();
  const { filters, setFilters, isFormOpen, editingEntity, openCreateForm, openEditForm, closeForm } =
    useWidgetsStore(useShallow((s) => ({
      filters: s.filters, setFilters: s.setFilters,
      isFormOpen: s.isFormOpen, editingEntity: s.editingEntity,
      openCreateForm: s.openCreateForm, openEditForm: s.openEditForm, closeForm: s.closeForm,
    })));

  return (
    <DataTable<Widget>
      entityNamePlural="Widgets"
      ariaLabel="Widgets table"
      data={widgets}
      isLoading={isLoading}
      error={error}
      columns={(
        <>
          <TableColumn isRowHeader>Name</TableColumn>
          <TableColumn>Actions</TableColumn>
        </>
      )}
      renderRow={(widget: Widget) => (
        <TableRow key={widget.id}>
          <TableCell>{widget.name}</TableCell>
          <TableCell>
            <Button size="sm" variant="secondary" onPress={() => openEditForm(widget)}>Edit</Button>
          </TableCell>
        </TableRow>
      )}
      isFormOpen={isFormOpen}
      formTitle={editingEntity ? `Edit ${editingEntity.name}` : "New Widget"}
      renderForm={(onClose, formId) => <WidgetForm widget={editingEntity} onClose={onClose} formId={formId} />}
      onCloseForm={closeForm}
      filters={filters}
      onSearchChange={(value) => setFilters({ search: value })}
      onAdd={openCreateForm}
      addLabel="+ Add Widget"
      page={pagination.page}
      pageSize={pagination.pageSize}
      totalItems={paginationMeta?.total ?? 0}
      totalPages={paginationMeta?.totalPages ?? 1}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
}
```

**Form `formId` prop is critical:** `renderForm` receives `(onClose, formId, onSubmittingChange)`. The form component must accept `formId` and set `id={formId}` on its `<form>` element — the modal's Save button uses `form={formId}` to submit. Without this, the Save button does nothing. The optional `onSubmittingChange` callback lets the form toggle the Save button's loading spinner during submission.

**Extra toolbar filters** (e.g., status dropdown): pass via `toolbarExtra` prop:
```tsx
toolbarExtra={
  <Select selectedKey={filters.status} onSelectionChange={(key) => setFilters({ status: String(key) })}>
    ...
  </Select>
}
```

**Per-row custom modals** (e.g., detail view): render the modal trigger directly in `renderRow` inside a `TableCell` (see `dispense-orders/` components for patterns like `DispenseOrderStatusConfirmModal`).

**Important:** Do NOT create per-entity pagination, toolbar, or row files. All that logic is handled by `DataTable`, `TablePagination`, and `TableToolbar`. Only create `<entity>-table.tsx` (using DataTable) and `<entity>-form.tsx`.

### Domain store shape (Zustand)

All domain stores are created via the `createEntityStore<T, F>()` factory in `src/lib/create-entity-store.ts`. This produces a standard store with:

```ts
// Factory usage (in src/stores/<entity>-store.ts):
import { createEntityStore } from "@/lib/create-entity-store";
import type { Entity } from "@/types";

export interface EntityFilters {
  isActive: boolean;
  search: string;
}

export const useEntityStore = createEntityStore<Entity, EntityFilters>(
  { isActive: true, search: "" },  // default filters
  "entity-store",                   // devtools name
);
```

The factory produces a store with this shape:

```ts
interface EntityUIState<T, F> {
  filters: F;
  pagination: { page: number; pageSize: number };
  isFormOpen: boolean;
  editingEntity: T | undefined;       // always named "editingEntity"
  deletingId: string | null;
  setFilters: (partial) => void;      // resets pagination to defaults
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;  // resets page to 1
  openCreateForm: () => void;
  openEditForm: (entity: T) => void;
  closeForm: () => void;
  setDeletingId: (id: string | null) => void;
  resetUI: () => void;
  resetAll: () => void;
}
```

Default pagination: `{ page: 1, pageSize: 10 }`. Default filters vary per entity. All stores use `devtools` middleware except `app-store.ts` (sidebar toggle only).

**Important:** The editing entity field is always `editingEntity` (not `editingPatient`, `editingRoom`, etc.). This is required by the `DataTable` component.

### Domain list hook pattern (React Query)

Each `use<Entity>()` hook:
- Reads `filters` and `pagination` from the Zustand store via selectors
- Uses `useQuery` with `queryKeys.<entity>.list({...filters, page, limit: pageSize})`
- Uses `select: (response) => response.data` to unwrap `ApiResponse`
- Uses `placeholderData: keepPreviousData` for smooth pagination
- Derives `paginationMeta` from `data.meta` (total, totalPages, hasNext, hasPrev)
- Has `useMutation` for create / update / delete, each calling `queryClient.invalidateQueries({ queryKey: queryKeys.<entity>.all })` on success
- Exposes store actions (`setFilters`, `resetFilters`, `setPage`, `setPageSize`) via `<Store>.getState()` (not hooks) so they don't cause re-renders when only used imperatively

### Search hook pattern

`use<Entity>Search(search: string, limit = 20)` hooks:
- Use `useDebounce(search, 300)` from `use-debounce.ts`
- `useQuery` with the entity's list key including `search` and `limit`
- `select: (response) => response.data.data` to return just the array
- Used by `AsyncAutocomplete`-based UI components

### Query key factory

Keys are defined in `src/lib/query-keys.ts`. Every entity has `all` and `list(params?)`, list entities also have `detail(id)`:

```ts
entityName: {
  all: ["entityName"] as const,
  list: (params?) => ["entityName", "list", params] as const,
  detail: (id: string) => ["entityName", "detail", id] as const,
}
```

Mutations always invalidate the `all` key to refetch the list.

## Autocomplete pattern

Entity search/select in forms uses `AsyncAutocomplete<T>` from `@/components/ui/async-autocomplete`. Each entity has a pre-built wrapper (e.g., `PatientAutocomplete`, `ProductAutocomplete`, `WardAutocomplete`) that plugs into a `use<Entity>Search` hook. To add a new one:
1. `src/hooks/use-<entity>-search.ts` — search hook (debounced query, returns `T[]`)
2. `src/components/ui/<entity>-autocomplete.tsx` — thin wrapper passing `useSearch`, `getId`, `getTextValue`, `renderItem` to `AsyncAutocomplete<T>`

## Error handling in mutations

`onServerError(error)` from `@/providers/error-provider` is the standard way to handle API errors in mutation `onError` callbacks. It parses `ApiError` (from `@/lib/api-client`), extracts the server message, and shows a `toast.danger`.

## Auth system

- JWT tokens stored in localStorage via `TokenManager` (`src/lib/token-manager.ts`)
- Token refresh with retry is implemented in `ApiClient` (`src/lib/api-client.ts`)
- `AuthInitializer` (`src/providers/auth-provider.tsx`) calls `verify()` on mount — this is NOT a context provider, just a wrapper that triggers auth verification
- Auth state lives in `useAuthStore` (Zustand, `src/stores/auth-store.ts`) — exposes `isAuthenticated`, `isLoading`, `verify`, `logout`
- `ProtectedRoute` and `GuestRoute` are components in `src/hooks/use-auth.tsx` — used by route group layouts
- `auth:unauthorized` custom window event dispatched on auth failure — providers listen for it
- Auth forms each have their own Zustand store (`login-store`, `register-store`, `forgot-password-store`, `reset-password-store`)
- Login store calls `useAuthStore.getState().setAuthenticated(true)` after successful login (cross-store communication via `.getState()`)

## Docker

- `next.config.ts` sets `output: "standalone"` for Docker deployment
- `Dockerfile` is multi-stage (deps → build → runner), uses `node:20-alpine`, runs as non-root user
- `docker-compose.yml` expects an external `internal_net` network
- Build-time env vars injected via Docker build args
