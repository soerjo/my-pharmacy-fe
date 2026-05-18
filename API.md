# Pharmacy Auth Service — API Documentation

**Base URL:** `http://localhost:3000/api`  
**Swagger UI:** `http://localhost:3000/docs`  
**Auth:** Bearer token (`Authorization: Bearer <accessToken>`) — required for most endpoints.

---

## Response Envelope

### Success (200/201)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { /* endpoint-specific payload */ },
  "timestamp": "2026-05-18T12:00:00.000Z",
  "path": "/api/auth/login"
}
```

### Error (4xx/5xx)
```json
{
  "statusCode": 400,
  "message": "Validation error",
  "errors": [ "email must be an email" ],
  "timestamp": "2026-05-18T12:00:00.000Z",
  "path": "/api/auth/register"
}
```

---

## Data Types

### User Object
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### Organization Object
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "logoUrl": "https://example.com/logo.png",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### AuthUser (JWT payload / verify-token response)
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roleId": "uuid",
  "role": "ADMIN",
  "organizationId": "uuid",
  "permissions": ["permission:read", "permission:write"]
}
```

---

## Roles & Permissions

- **Global guard pipeline:** Throttler (10 req/60s) → JWT Auth → Roles Guard
- **Public endpoints:** Annotated with `@Public()`, bypass JWT guard
- **Admin endpoints:** Require `@Roles('ADMIN')` — the user must have a role named `ADMIN` in at least one organization
- **Role lookup:** The `RolesGuard` queries `user_organizations` table for the authenticated user's role names across ALL organizations. If the user is ADMIN in any org, they are ADMIN everywhere.

---

## Endpoints

---

### 1. Auth — `/api/auth`

#### POST `/api/auth/register` — Register (Public)

Create a new user AND organization in a single transaction. Creates the org `"Organization of <email>"` and assigns the `ADMIN` role.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "min8chars",
  "firstName": "John",
  "lastName": "Doe"
}
```

| Field      | Type     | Required | Notes            |
| ---------- | -------- | -------- | ---------------- |
| email      | string   | yes      | Must be unique   |
| password   | string   | yes      | Min 8 characters |
| firstName  | string   | no       |                  |
| lastName   | string   | no       |                  |

**Response `201`:** User object (no password).

---

#### POST `/api/auth/login` — Login (Public)

Authenticates with email/password via Passport local strategy. Returns JWT tokens and user info.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roleId": "uuid",
    "role": "ADMIN",
    "organizationId": "uuid",
    "permissions": ["permission:read"]
  }
}
```

---

#### POST `/api/auth/refresh-token` — Refresh Tokens (Public `*`)

> **Important:** In current implementation, the old refresh token is NOT invalidated. A new token pair is issued on every call.

**Request body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response `200`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { /* AuthUser object */ }
}
```

---

#### GET `/api/auth/verify-token` — Verify Token (JWT)

Checks the current access token is valid and returns user info + permissions from the token.

**Headers:** `Authorization: Bearer <accessToken>`

**Response `200`:**
```json
{
  "valid": true,
  "user": { /* AuthUser object */ }
}
```

---

#### POST `/api/auth/set-password` — Set Initial Password (JWT)

For users who registered with OAuth (Google) and have no password set.

**Request body:**
```json
{
  "newPassword": "newSecurePassword123"
}
```

| Field       | Type   | Required | Notes            |
| ----------- | ------ | -------- | ---------------- |
| newPassword | string | yes      | Min 8 characters |

**Response `200`:**
```json
{ "message": "Password set successfully" }
```

**Error `400`:** If password already exists — use `change-password` instead.

---

#### POST `/api/auth/change-password` — Change Password (JWT)

**Request body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

| Field           | Type   | Required | Notes            |
| --------------- | ------ | -------- | ---------------- |
| currentPassword | string | yes      |                  |
| newPassword     | string | yes      | Min 8 characters |

**Response `200`:**
```json
{ "message": "Password changed successfully" }
```

**Error `400`:** If no password set yet — use `set-password` instead.

---

#### POST `/api/auth/forgot-password` — Forgot Password (Public)

Sends a password reset email. Returns the same message regardless of whether the email exists (to prevent enumeration).

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Response `200`:** Returns the email details (includes the reset link in current implementation).
```json
{
  "to": "user@example.com",
  "subject": "Reset your password",
  "template": "forgot-password",
  "context": {
    "resetUrl": "http://localhost:5173/reset-password?token=eyJhbGci..."
  }
}
```

---

#### POST `/api/auth/reset-password` — Reset Password (Public)

Uses the token received via email.

**Request body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "newPassword": "newSecurePassword123"
}
```

| Field       | Type   | Required | Notes                 |
| ----------- | ------ | -------- | --------------------- |
| token       | string | yes      | JWT from email link   |
| newPassword | string | yes      | Min 8 characters      |

**Response `200`:**
```json
{ "message": "Password reset successfully" }
```

---

#### GET `/api/auth/google` — Google OAuth (Public)

Redirects user to Google consent screen.

---

#### GET `/api/auth/google/callback` — Google OAuth Callback (Public)

Google redirects here after consent. The server creates a user if none exists (with `USER` role), then redirects to `FRONTEND_URL/auth/google/callback?accessToken=...&refreshToken=...`.

**Frontend must handle:** Extract `accessToken` and `refreshToken` from URL query params on `/auth/google/callback` route.

---

### 2. Users — `/api/users`

All endpoints require JWT. The `GET /me` endpoint is available to any authenticated user. List/Get/Update/Delete require `ADMIN` role.

#### GET `/api/users/me` — My Profile (JWT)

**Response `200`:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "userName": "John Doe",
  "organizationName": "Acme Corp",
  "roleId": "uuid",
  "role": "ADMIN",
  "organizationId": "uuid",
  "permissions": ["permission:read"]
}
```

---

#### GET `/api/users` — List All Users (ADMIN)

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

#### GET `/api/users/:id` — Get User by ID (ADMIN)

**Response `200`:** Single user object (same shape as `/me`).

- **PATCH, DELETE** also available at `/:id` for admins.

---

#### PATCH `/api/users/:id` — Update User (ADMIN)

Accepts partial update — any subset of fields from register DTO.

**Request body (partial):**
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response `200`:** Updated user object.

---

#### DELETE `/api/users/:id` — Delete User (ADMIN)

**Response `200`:** Deleted user object.

---

### 3. Organizations — `/api/organizations`

List and Get-by-Slug are **public** (no auth required). Create/Update/Delete require `ADMIN` role.

#### GET `/api/organizations` — List All Organizations (Public)

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "logoUrl": null,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

#### GET `/api/organizations/slug/:slug` — Get Organization by Slug (Public)

**Response `200`:** Single organization object.

---

#### GET `/api/organizations/:id` — Get Organization by ID (Public)

**Response `200`:** Single organization object.

---

#### POST `/api/organizations` — Create Organization (ADMIN)

**Request body:**
```json
{
  "name": "Acme Corp",
  "slug": "acme-corp",
  "description": "A leading tech company",
  "website": "https://acme.com",
  "logoUrl": "https://acme.com/logo.png"
}
```

| Field       | Type   | Required | Notes |
| ----------- | ------ | -------- | ----- |
| name        | string | yes      |       |
| slug        | string | yes      | Must be unique |
| description | string | no       |       |
| website     | string | no       | Must be valid URL |
| logoUrl     | string | no       | Must be valid URL |

**Response `201`:** Created organization object.

---

#### PATCH `/api/organizations/:id` — Update Organization (ADMIN)

Accepts partial update.

**Request body (partial):**
```json
{
  "name": "Acme Corp Renamed",
  "website": "https://acme.com"
}
```

**Response `200`:** Updated organization object.

---

#### DELETE `/api/organizations/:id` — Delete Organization (ADMIN)

**Response `200`:** Deleted organization object.

---

## Environment Variables (FE)

| Variable        | Default               | Description             |
| --------------- | --------------------- | ----------------------- |
| `VITE_API_URL`  | `http://localhost:3000/api` | Base API URL       |
| `VITE_FRONTEND_URL` | `http://localhost:5173`  | For OAuth redirects |

---

## Integration Checklist (Frontend)

1. **Login flow:** `POST /api/auth/login` → store `accessToken`, `refreshToken`, `user` in memory/localStorage
2. **Verify on app load:** `GET /api/auth/verify-token` with stored token — if 401, try `POST /api/auth/refresh-token`
3. **Auto-refresh:** Intercept 401 responses → call refresh → retry original request
4. **Register:** `POST /api/auth/register` → auto-login after (or redirect to login)
5. **Google OAuth:** Redirect to `GET /api/auth/google` → handle callback at `/auth/google/callback` route, extract tokens from URL
6. **Forgot/Reset password:** Redirect to `/reset-password?token=...` page, call `POST /api/auth/reset-password`
7. **Organizations list:** Fetch `GET /api/organizations` on landing page (public)
8. **Admin pages:** Check `user.role === 'ADMIN'` from JWT payload to gate admin UI
