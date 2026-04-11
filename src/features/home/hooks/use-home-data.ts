import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib";
import { homeService } from "../services";

export function useHomeData() {
  return useQuery({
    queryKey: queryKeys.home.all,
    queryFn: homeService.getData,
  });
}
