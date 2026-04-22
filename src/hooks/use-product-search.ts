import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { warehouseService } from "@/services/warehouse-service";
import { queryKeys } from "@/lib/query-keys";
import { useDebounce } from "./use-debounce";

export function useProductSearch(search: string, limit = 20) {
  const debouncedSearch = useDebounce(search, 300);
  const normalizedSearch = debouncedSearch || undefined;

  return useQuery({
    queryKey: queryKeys.products.list({
      search: normalizedSearch,
      limit,
      isActive: true,
    }),
    queryFn: () =>
      warehouseService.getProducts({
        search: normalizedSearch,
        limit,
        isActive: true,
      }),
    select: (response) => response.data.data,
    enabled: search.trim().length > 0,
    placeholderData: keepPreviousData,
  });
}
