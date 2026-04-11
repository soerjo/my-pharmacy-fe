export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "My App";

export const ROUTES = {
  home: "/",
  login: "/login",
} as const;

export const API_ROUTES = {
  health: "/api/v1/health",
  login: "/api/v1/auth/login",
  logout: "/api/v1/auth/logout",
  refreshToken: "/api/v1/auth/refresh-token",
  verifyToken: "/api/v1/auth/verify-token",
  me: "/api/v1/auth/me",
} as const;
