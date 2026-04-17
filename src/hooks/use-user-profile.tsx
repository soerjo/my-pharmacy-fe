"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { authService } from "@/services/auth-service";
export function useUserProfile() {
  const query = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authService.getProfile(),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
