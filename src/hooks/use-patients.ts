"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { depoService } from "@/services/depo-service";
import { usePatientsStore } from "@/stores/patients-store";
import type { PatientFormValues } from "@/types";

export function usePatients() {
  const filters = usePatientsStore((s) => s.filters);
  const pagination = usePatientsStore((s) => s.pagination);

  const queryClient = useQueryClient();

  const patientsQuery = useQuery({
    queryKey: queryKeys.patients.list({
      ...filters,
      page: pagination.page,
      limit: pagination.pageSize,
    }),
    queryFn: () =>
      depoService.getPatients({ ...filters, page: pagination.page, limit: pagination.pageSize }),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
  });

  const paginationMeta = patientsQuery.data
    ? {
        total: patientsQuery.data.meta.total,
        totalPages: patientsQuery.data.meta.totalPages,
        page: patientsQuery.data.meta.page,
        pageSize: patientsQuery.data.meta.limit,
        hasNext: patientsQuery.data.meta.hasNext,
        hasPrev: patientsQuery.data.meta.hasPrev,
      }
    : null;

  const createMutation = useMutation({
    mutationFn: (data: PatientFormValues) =>
      depoService.createPatient(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.all,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatientFormValues }) =>
      depoService.updatePatient(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.all,
      }),
  });

  const updatePatient = async (id: string, data: PatientFormValues) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => depoService.deletePatient(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients.all,
      }),
  });

  return {
    patients: patientsQuery.data?.data ?? [],
    isLoading: patientsQuery.isLoading,
    isFetching: patientsQuery.isFetching,
    isPlaceholderData: patientsQuery.isPlaceholderData,
    error: patientsQuery.error,
    filters,
    pagination,
    paginationMeta,
    setFilters: usePatientsStore.getState().setFilters,
    resetFilters: usePatientsStore.getState().resetFilters,
    setPage: usePatientsStore.getState().setPage,
    setPageSize: usePatientsStore.getState().setPageSize,
    createPatient: createMutation.mutateAsync,
    updatePatient,
    deletePatient: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
