"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { depoService } from "@/services/depo-service";
import { useAdmissionsStore } from "@/stores/admissions-store";
import type { AdmissionFormValues, CreateAdmissionFormValues } from "@/types";

export function useAdmissions() {
  const filters = useAdmissionsStore((s) => s.filters);
  const pagination = useAdmissionsStore((s) => s.pagination);

  const queryClient = useQueryClient();

  const admissionsQuery = useQuery({
    queryKey: queryKeys.admissions.list({
      ...filters,
      page: pagination.page,
      limit: pagination.pageSize,
    }),
    queryFn: () =>
      depoService.getAdmissions({ ...filters, page: pagination.page, limit: pagination.pageSize }),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
  });

  const paginationMeta = admissionsQuery.data
    ? {
        total: admissionsQuery.data.meta.total,
        totalPages: admissionsQuery.data.meta.totalPages,
        page: admissionsQuery.data.meta.page,
        pageSize: admissionsQuery.data.meta.limit,
        hasNext: admissionsQuery.data.meta.hasNext,
        hasPrev: admissionsQuery.data.meta.hasPrev,
      }
    : null;

  const createMutation = useMutation({
    mutationFn: (data: CreateAdmissionFormValues) =>
      depoService.createAdmission(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.admissions.all,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdmissionFormValues }) =>
      depoService.updateAdmission(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.admissions.all,
      }),
  });

  const updateAdmission = async (id: string, data: AdmissionFormValues) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => depoService.deleteAdmission(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.admissions.all,
      }),
  });

  return {
    admissions: admissionsQuery.data?.data ?? [],
    isLoading: admissionsQuery.isLoading,
    isFetching: admissionsQuery.isFetching,
    isPlaceholderData: admissionsQuery.isPlaceholderData,
    error: admissionsQuery.error,
    filters,
    pagination,
    paginationMeta,
    setFilters: useAdmissionsStore.getState().setFilters,
    resetFilters: useAdmissionsStore.getState().resetFilters,
    setPage: useAdmissionsStore.getState().setPage,
    setPageSize: useAdmissionsStore.getState().setPageSize,
    createAdmission: createMutation.mutateAsync,
    updateAdmission,
    deleteAdmission: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
