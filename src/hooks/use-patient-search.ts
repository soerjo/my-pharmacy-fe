import { useQuery } from "@tanstack/react-query";
import { depoService } from "@/services/depo-service";
import { queryKeys } from "@/lib/query-keys";
import { useDebounce } from "./use-debounce";

export function usePatientSearch(search: string, limit = 20) {
  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: queryKeys.patients.list({
      search: debouncedSearch,
      limit,
      isActive: true,
    }),
    queryFn: () =>
      depoService.getPatients({
        search: debouncedSearch || undefined,
        limit,
        isActive: true,
      }),
    select: (response) => response.data.data,
  });
}
