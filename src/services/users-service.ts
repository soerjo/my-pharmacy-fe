import { clients } from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type { User, CreateUserFormValues, UpdateUserFormValues, UserRole } from "@/types";

export const usersService = {
  getAll: () => clients.auth.get<ApiResponse<User[]>>("/users"),
  getById: (id: string) => clients.auth.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: CreateUserFormValues) => clients.auth.post<ApiResponse<User>>("/users", data),
  update: (id: string, data: UpdateUserFormValues) => clients.auth.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: string) => clients.auth.delete<ApiResponse<void>>(`/users/${id}`),
  getUserRoles: (id: string) => clients.auth.get<ApiResponse<UserRole[]>>(`/users/${id}/roles`),
  assignRole: (userId: string, roleId: string) => clients.auth.post<ApiResponse<UserRole>>(`/users/${userId}/roles`, { roleId }),
  removeRole: (userId: string, roleId: string) => clients.auth.delete<ApiResponse<void>>(`/users/${userId}/roles/${roleId}`),
};
