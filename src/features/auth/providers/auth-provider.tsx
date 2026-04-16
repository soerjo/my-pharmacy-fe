"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/constants";
import { apiClient } from "@/lib";
import { TokenManager } from "@/features/auth/services/token-manager";
import type { ApiResponse } from "@/types";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const verifyTokenQuery = useQuery<ApiResponse<{ valid: boolean }>>({
    queryKey: ["auth", "verify"],
    queryFn: () => apiClient.get(API_ROUTES.verifyToken),
    retry: false,
    enabled: typeof window !== "undefined" && TokenManager.isAccessTokenValid(),
    staleTime: 1000 * 60 * 5,
  });

  const logout = useCallback(async () => {
    TokenManager.clearTokens();
    await verifyTokenQuery.refetch();
  }, [verifyTokenQuery]);

  const hasToken = !!TokenManager.getAccessToken();
  const isValid = TokenManager.isAccessTokenValid();
  const isVerified = verifyTokenQuery.data?.data?.valid !== false;
  const isAuthenticated = hasToken && isValid && isVerified;

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    isLoading: typeof window === "undefined" || verifyTokenQuery.isLoading,
    logout,
    error: verifyTokenQuery.error ?? null,
  }), [isAuthenticated, verifyTokenQuery.isLoading, logout, verifyTokenQuery.error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
