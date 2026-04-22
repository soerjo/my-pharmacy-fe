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
    clients.auth.post<ApiResponse<{ accessToken: string; refreshToken: string }>>("/auth/login", data),

  register: (data: RegisterFormValues) =>
    clients.auth.post<ApiResponse<{ message: string }>>("/auth/register", data),

  logout: () =>
    clients.auth.post<ApiResponse<void>>("/auth/logout"),

  refreshToken: (refreshToken: string) =>
    clients.auth.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
      "/auth/refresh-token",
      { refreshToken }
    ),

  verifyToken: () =>
    clients.auth.get<ApiResponse<{ valid: boolean }>>("/auth/verify-token"),

  getProfile: () =>
    clients.auth.get<ApiResponse<UserProfile>>("/users/me"),

  forgotPassword: (data: ForgotPasswordFormValues) =>
    clients.auth.post<ApiResponse<{ message: string }>>("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordFormValues) =>
    clients.auth.post<ApiResponse<{ message: string }>>("/auth/reset-password", data),
};
