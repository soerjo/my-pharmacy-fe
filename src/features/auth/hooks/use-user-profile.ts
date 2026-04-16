"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, queryKeys } from "@/lib";
import { API_ROUTES } from "@/constants";
import type { ApiResponse } from "@/types";
import type { UserProfile } from "@/features/auth/types";

export function useUserProfile() {
  const query = useQuery<ApiResponse<UserProfile>>({
    queryKey: queryKeys.auth.me,
    queryFn: () => apiClient.get(API_ROUTES.me),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
