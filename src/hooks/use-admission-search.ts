import { useQuery } from "@tanstack/react-query";
import { depoService } from "@/services/depo-service";
import { queryKeys } from "@/lib/query-keys";
import { useDebounce } from "./use-debounce";

export function useAdmissionSearch(search: string, limit = 20) {
  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: queryKeys.admissions.list({
      search: debouncedSearch,
      limit,
      status: "ADMITTED",
    }),
    queryFn: () =>
      depoService.getAdmissions({
        search: debouncedSearch || undefined,
        limit,
        status: "ADMITTED",
      }),
    select: (response) => response.data.data,
  });
}
