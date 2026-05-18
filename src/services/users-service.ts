import { clients } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type { User, CreateUserFormValues, UpdateUserFormValues, UserRole } from "@/types";

export const usersService = {
  getAll: (params?: { search?: string; isActive?: boolean; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.auth.get<ApiResponse<PaginatedResponse<User>>>(
      searchParams.toString() ? `/users?${searchParams.toString()}` : "/users"
    );
  },
  getById: (id: string) => clients.auth.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: CreateUserFormValues) => clients.auth.post<ApiResponse<User>>("/users", data),
  update: (id: string, data: UpdateUserFormValues) => clients.auth.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: string) => clients.auth.delete<ApiResponse<void>>(`/users/${id}`),
  getUserRoles: (id: string) => clients.auth.get<ApiResponse<UserRole[]>>(`/users/${id}/roles`),
  assignRole: (userId: string, roleId: string) => clients.auth.post<ApiResponse<UserRole>>(`/users/${userId}/roles`, { roleId }),
  removeRole: (userId: string, roleId: string) => clients.auth.delete<ApiResponse<void>>(`/users/${userId}/roles/${roleId}`),
};
