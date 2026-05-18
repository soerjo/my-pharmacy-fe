import { clients } from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type {
  LoginFormValues,
  RegisterApiValues,
  ForgotPasswordFormValues,
  ResetPasswordApiValues,
  ChangePasswordApiValues,
  SetPasswordApiValues,
  UserProfile,
  LoginResponseData,
  RefreshResponseData,
  VerifyResponseData,
} from "@/types";

export const authService = {
  login: (data: LoginFormValues) =>
    clients.auth.post<ApiResponse<LoginResponseData>>("/auth/login", data, { skipAuth: true }),

  register: (data: RegisterApiValues) =>
    clients.auth.post<ApiResponse<UserProfile>>("/auth/register", data, { skipAuth: true }),

  logout: () =>
    clients.auth.post<ApiResponse<void>>("/auth/logout"),

  refreshToken: (refreshToken: string) =>
    clients.auth.post<ApiResponse<RefreshResponseData>>("/auth/refresh-token", { refreshToken }),

  verifyToken: () =>
    clients.auth.get<ApiResponse<VerifyResponseData>>("/auth/verify-token"),

  getProfile: () =>
    clients.auth.get<ApiResponse<UserProfile>>("/users/me"),

  forgotPassword: (data: ForgotPasswordFormValues) =>
    clients.auth.post<ApiResponse<{ message: string }>>("/auth/forgot-password", data, { skipAuth: true }),

  resetPassword: (data: ResetPasswordApiValues) =>
    clients.auth.post<ApiResponse<{ message: string }>>("/auth/reset-password", data, { skipAuth: true }),

  setPassword: (data: SetPasswordApiValues) =>
    clients.auth.post<ApiResponse<{ message: string }>>("/auth/set-password", data),

  changePassword: (data: ChangePasswordApiValues) =>
    clients.auth.post<ApiResponse<{ message: string }>>("/auth/change-password", data),
};
