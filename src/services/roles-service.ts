import { clients } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types";
import type { Role, RoleWithPermissions, Permission, CreateRoleFormValues, UpdateRoleFormValues } from "@/types";

export const rolesService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

    return clients.auth.get<ApiResponse<PaginatedResponse<Role>>>(
      searchParams.toString() ? `/roles?${searchParams.toString()}` : "/roles"
    );
  },
  getById: (id: string) => clients.auth.get<ApiResponse<RoleWithPermissions>>(`/roles/${id}`),
  create: (data: CreateRoleFormValues) => clients.auth.post<ApiResponse<Role>>("/roles", data),
  update: (id: string, data: UpdateRoleFormValues) => clients.auth.put<ApiResponse<Role>>(`/roles/${id}`, data),
  delete: (id: string) => clients.auth.delete<ApiResponse<void>>(`/roles/${id}`),
  getPermissions: (id: string) => clients.auth.get<ApiResponse<Permission[]>>(`/roles/${id}/permissions`),
  assignPermissions: (id: string, permissionIds: string[]) => clients.auth.post<ApiResponse<void>>(`/roles/${id}/permissions`, { permissionIds }),
  removePermission: (roleId: string, permissionId: string) => clients.auth.delete<ApiResponse<void>>(`/roles/${roleId}/permissions/${permissionId}`),
  getAllPermissions: () => clients.auth.get<ApiResponse<Permission[]>>("/permissions"),
};
