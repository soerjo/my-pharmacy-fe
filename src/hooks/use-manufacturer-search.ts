import { useQuery } from "@tanstack/react-query";
import { warehouseService } from "@/services/warehouse-service";
import { queryKeys } from "@/lib/query-keys";
import { useDebounce } from "./use-debounce";

export function useManufacturerSearch(search: string, limit = 20) {
  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: queryKeys.manufacturers.list({
      search: debouncedSearch,
      limit,
    }),
    queryFn: () =>
      warehouseService.getManufacturers({
        search: debouncedSearch || undefined,
        limit,
      }),
    select: (response) => response.data.data,
  });
}
