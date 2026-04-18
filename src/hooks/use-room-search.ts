import { useQuery } from "@tanstack/react-query";
import { depoService } from "@/services/depo-service";
import { queryKeys } from "@/lib/query-keys";
import { useDebounce } from "./use-debounce";

export function useRoomSearch(search: string, limit = 20) {
  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: queryKeys.rooms.list({
      search: debouncedSearch,
      limit,
      isActive: true,
    }),
    queryFn: () =>
      depoService.getRooms({
        search: debouncedSearch || undefined,
        limit,
        isActive: true,
      }),
    select: (response) => response.data.data,
  });
}
