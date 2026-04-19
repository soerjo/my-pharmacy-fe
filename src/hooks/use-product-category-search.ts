import { useQuery } from "@tanstack/react-query";
import { warehouseService } from "@/services/warehouse-service";
import { queryKeys } from "@/lib/query-keys";
import { useDebounce } from "./use-debounce";

export function useProductCategorySearch(search: string, limit = 20) {
  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: queryKeys.productCategories.list({
      search: debouncedSearch,
      limit,
    }),
    queryFn: () =>
      warehouseService.getProductCategories({
        search: debouncedSearch || undefined,
        limit,
      }),
    select: (response) => response.data.data,
  });
}
