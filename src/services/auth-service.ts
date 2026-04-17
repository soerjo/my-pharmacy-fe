import { clients } from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
  UserProfile,
} from "@/types";

export const authService = {
  login: (data: LoginFormValues) =>
    clients.auth.post<ApiResponse<{ accessToken: string; refreshToken: string }>>("/api/auth/login", data),

  register: (data: RegisterFormValues) =>
    clients.auth.post<ApiResponse<{ message: string }>>("/api/auth/register", data),

  logout: () =>
    clients.auth.post<ApiResponse<void>>("/api/auth/logout"),

  refreshToken: (refreshToken: string) =>
    clients.auth.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
      "/api/auth/refresh-token",
      { refreshToken }
    ),

  verifyToken: () =>
    clients.auth.get<ApiResponse<{ valid: boolean }>>("/api/auth/verify-token"),

  getProfile: () =>
    clients.auth.get<ApiResponse<UserProfile>>("/api/users/me"),

  forgotPassword: (data: ForgotPasswordFormValues) =>
    clients.auth.post<ApiResponse<{ message: string }>>("/api/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordFormValues) =>
    clients.auth.post<ApiResponse<{ message: string }>>("/api/auth/reset-password", data),
};
