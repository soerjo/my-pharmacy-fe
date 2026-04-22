"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { depoService } from "@/services/depo-service";
import { useDispenseOrdersStore } from "@/stores/dispense-orders-store";
import type { DispenseOrderFormValues } from "@/types";

export function useDispenseOrder(id: string) {
  const detailQuery = useQuery({
    queryKey: queryKeys.dispenseOrders.detail(id),
    queryFn: () => depoService.getDispenseOrder(id),
    select: (response) => response.data,
    enabled: !!id,
  });

  return {
    dispenseOrder: detailQuery.data ?? null,
    isLoading: detailQuery.isLoading,
    isFetching: detailQuery.isFetching,
    error: detailQuery.error,
  };
}

export function useDispenseOrders() {
  const filters = useDispenseOrdersStore((s) => s.filters);
  const pagination = useDispenseOrdersStore((s) => s.pagination);

  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: queryKeys.dispenseOrders.list({
      ...filters,
      page: pagination.page,
      limit: pagination.pageSize,
    }),
    queryFn: () =>
      depoService.getDispenseOrders({ ...filters, page: pagination.page, limit: pagination.pageSize }),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
  });

  const paginationMeta = ordersQuery.data
    ? {
        total: ordersQuery.data.meta.total,
        totalPages: ordersQuery.data.meta.totalPages,
        page: ordersQuery.data.meta.page,
        pageSize: ordersQuery.data.meta.limit,
        hasNext: ordersQuery.data.meta.hasNext,
        hasPrev: ordersQuery.data.meta.hasPrev,
      }
    : null;

  const createMutation = useMutation({
    mutationFn: (data: DispenseOrderFormValues) => depoService.createDispenseOrder(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.dispenseOrders.all }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DispenseOrderFormValues }) =>
      depoService.updateDispenseOrder(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.dispenseOrders.all }),
  });

  const updateOrder = async (id: string, data: DispenseOrderFormValues) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => depoService.deleteDispenseOrder(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.dispenseOrders.all }),
  });

  return {
    dispenseOrders: ordersQuery.data?.data ?? [],
    isLoading: ordersQuery.isLoading,
    isFetching: ordersQuery.isFetching,
    isPlaceholderData: ordersQuery.isPlaceholderData,
    error: ordersQuery.error,
    filters,
    pagination,
    paginationMeta,
    setFilters: useDispenseOrdersStore.getState().setFilters,
    resetFilters: useDispenseOrdersStore.getState().resetFilters,
    setPage: useDispenseOrdersStore.getState().setPage,
    setPageSize: useDispenseOrdersStore.getState().setPageSize,
    createOrder: createMutation.mutateAsync,
    updateOrder,
    deleteOrder: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
