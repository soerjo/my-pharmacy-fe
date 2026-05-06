"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { warehouseService } from "@/services/warehouse-service";

export function useManufacturers(params?: { search?: string; page?: number; limit?: number }) {
  const query = useQuery({
    queryKey: queryKeys.manufacturers.list(params),
    queryFn: () => warehouseService.getManufacturers(params),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
  });

  return {
    manufacturers: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    paginationMeta: query.data?.meta,
  };
}
