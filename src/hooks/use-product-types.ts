"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { warehouseService } from "@/services/warehouse-service";

export function useProductTypes() {
  const query = useQuery({
    queryKey: queryKeys.productTypes.list(),
    queryFn: () => warehouseService.getProductTypes(),
    select: (response) => response.data,
  });

  return {
    productTypes: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
