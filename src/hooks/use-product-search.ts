import { useQuery } from "@tanstack/react-query";
import { warehouseService } from "@/services/warehouse-service";
import { queryKeys } from "@/lib/query-keys";
import { useDebounce } from "./use-debounce";

export function useProductSearch(search: string, limit = 20) {
  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: queryKeys.products.list({
      search: debouncedSearch,
      limit,
      isActive: true,
    }),
    queryFn: () =>
      warehouseService.getProducts({
        search: debouncedSearch || undefined,
        limit,
        isActive: true,
      }),
    select: (response) => response.data.data,
  });
}
