"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { warehouseService } from "@/services/warehouse-service";
import { useProductsStore } from "@/stores/products-store";
import type { ProductFormValues } from "@/types";

export function useProducts() {
  const filters = useProductsStore((s) => s.filters);
  const pagination = useProductsStore((s) => s.pagination);

  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: queryKeys.products.list({
      ...filters,
      page: pagination.page,
      limit: pagination.pageSize,
    }),
    queryFn: () =>
      warehouseService.getProducts({ ...filters, page: pagination.page, limit: pagination.pageSize }),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
  });

  const paginationMeta = productsQuery.data
    ? {
        total: productsQuery.data.meta.total,
        totalPages: productsQuery.data.meta.totalPages,
        page: productsQuery.data.meta.page,
        pageSize: productsQuery.data.meta.limit,
        hasNext: productsQuery.data.meta.hasNext,
        hasPrev: productsQuery.data.meta.hasPrev,
      }
    : null;

  const createMutation = useMutation({
    mutationFn: (data: ProductFormValues) =>
      warehouseService.createProduct(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormValues }) =>
      warehouseService.updateProduct(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      }),
  });

  const updateProduct = async (id: string, data: ProductFormValues) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => warehouseService.deleteProduct(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      }),
  });

  return {
    products: productsQuery.data?.data ?? [],
    isLoading: productsQuery.isLoading,
    isFetching: productsQuery.isFetching,
    isPlaceholderData: productsQuery.isPlaceholderData,
    error: productsQuery.error,
    filters,
    pagination,
    paginationMeta,
    setFilters: useProductsStore.getState().setFilters,
    resetFilters: useProductsStore.getState().resetFilters,
    setPage: useProductsStore.getState().setPage,
    setPageSize: useProductsStore.getState().setPageSize,
    createProduct: createMutation.mutateAsync,
    updateProduct,
    deleteProduct: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
