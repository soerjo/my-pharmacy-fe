"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { rolesService } from "@/services/roles-service";
import { useRolesStore } from "@/stores/roles-store";
import type { CreateRoleFormValues, UpdateRoleFormValues } from "@/types";

export function useRoles() {
  const queryClient = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: queryKeys.roles.list(),
    queryFn: () => rolesService.getAll(),
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRoleFormValues) => rolesService.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.all,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleFormValues }) =>
      rolesService.update(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.all,
      }),
  });

  const updateRole = async (id: string, data: UpdateRoleFormValues) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.all,
      }),
  });

  return {
    roles: rolesQuery.data ?? [],
    isLoading: rolesQuery.isLoading,
    isFetching: rolesQuery.isFetching,
    error: rolesQuery.error,
    createRole: createMutation.mutateAsync,
    updateRole,
    deleteRole: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useRole(id: string) {
  const detailQuery = useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => rolesService.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });

  return {
    role: detailQuery.data ?? null,
    isLoading: detailQuery.isLoading,
    error: detailQuery.error,
  };
}

export function useAllPermissions() {
  const permissionsQuery = useQuery({
    queryKey: queryKeys.permissions.list(),
    queryFn: () => rolesService.getAllPermissions(),
    select: (response) => response.data,
  });

  return {
    permissions: permissionsQuery.data ?? [],
    isLoading: permissionsQuery.isLoading,
    error: permissionsQuery.error,
  };
}

export function useRolePermissions(roleId: string) {
  const permissionsQuery = useQuery({
    queryKey: queryKeys.roles.detail(roleId),
    queryFn: () => rolesService.getPermissions(roleId),
    select: (response) => response.data,
    enabled: !!roleId,
  });

  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: (permissionIds: string[]) => rolesService.assignPermissions(roleId, permissionIds),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.all,
      }),
  });

  const removeMutation = useMutation({
    mutationFn: (permissionId: string) => rolesService.removePermission(roleId, permissionId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.all,
      }),
  });

  return {
    permissions: permissionsQuery.data ?? [],
    isLoading: permissionsQuery.isLoading,
    error: permissionsQuery.error,
    assignPermissions: assignMutation.mutateAsync,
    removePermission: removeMutation.mutateAsync,
    isAssigning: assignMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
