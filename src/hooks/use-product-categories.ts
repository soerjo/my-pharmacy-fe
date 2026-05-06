"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { warehouseService } from "@/services/warehouse-service";

export function useProductCategories(params?: { search?: string; page?: number; limit?: number }) {
  const query = useQuery({
    queryKey: queryKeys.productCategories.list(params),
    queryFn: () => warehouseService.getProductCategories(params),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
  });

  return {
    productCategories: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    paginationMeta: query.data?.meta,
  };
}
