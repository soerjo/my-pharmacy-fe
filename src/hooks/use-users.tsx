"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { usersService } from "@/services/users-service";
import { useUsersStore } from "@/stores/users-store";
import type { CreateUserFormValues, UpdateUserFormValues } from "@/types";

export function useUsers() {
  const filters = useUsersStore((s) => s.filters);
  const pagination = useUsersStore((s) => s.pagination);

  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: queryKeys.users.list({
      ...filters,
      page: pagination.page,
      limit: pagination.pageSize,
    }),
    queryFn: () => usersService.getAll(),
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserFormValues) => usersService.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserFormValues }) =>
      usersService.update(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      }),
  });

  const updateUser = async (id: string, data: UpdateUserFormValues) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      }),
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    isFetching: usersQuery.isFetching,
    error: usersQuery.error,
    filters,
    pagination,
    setFilters: useUsersStore.getState().setFilters,
    resetFilters: useUsersStore.getState().resetFilters,
    setPage: useUsersStore.getState().setPage,
    setPageSize: useUsersStore.getState().setPageSize,
    createUser: createMutation.mutateAsync,
    updateUser,
    deleteUser: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useUser(id: string) {
  const detailQuery = useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersService.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });

  return {
    user: detailQuery.data ?? null,
    isLoading: detailQuery.isLoading,
    error: detailQuery.error,
  };
}

export function useUserRoles(userId: string) {
  const rolesQuery = useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => usersService.getUserRoles(userId),
    select: (response) => response.data,
    enabled: !!userId,
  });

  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: (roleId: string) => usersService.assignRole(userId, roleId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      }),
  });

  const removeMutation = useMutation({
    mutationFn: (roleId: string) => usersService.removeRole(userId, roleId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      }),
  });

  return {
    roles: rolesQuery.data ?? [],
    isLoading: rolesQuery.isLoading,
    error: rolesQuery.error,
    assignRole: assignMutation.mutateAsync,
    removeRole: removeMutation.mutateAsync,
    isAssigning: assignMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
