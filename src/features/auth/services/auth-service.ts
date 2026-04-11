import { apiClient } from "@/lib";
import { API_ROUTES } from "@/constants";
import type { ApiResponse } from "@/types";
import type { LoginResponse, LoginFormValues } from "@/features/auth/types";

export const authService = {
  login: (data: LoginFormValues) =>
    apiClient.post<ApiResponse<LoginResponse>>(API_ROUTES.login, data),
  logout: () => apiClient.post<void>(API_ROUTES.logout, undefined, { skipAuth: true }),
  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<LoginResponse>>(API_ROUTES.refreshToken, { refreshToken }, { skipAuth: true }),
  verifyToken: () => apiClient.get<ApiResponse<{ valid: boolean }>>(API_ROUTES.verifyToken),
  me: () => apiClient.get<ApiResponse<{ user: { id: string; username: string } }>>(API_ROUTES.me),
};
