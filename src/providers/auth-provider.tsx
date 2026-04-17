"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import { TokenManager } from "@/lib/token-manager";
import { queryKeys } from "@/lib/query-keys";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const verifyTokenQuery = useQuery({
    queryKey: ["auth", "verify"],
    queryFn: () => authService.verifyToken(),
    retry: false,
    enabled: typeof window !== "undefined" && TokenManager.isAccessTokenValid(),
    staleTime: 1000 * 60 * 5,
  });

  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    TokenManager.clearTokens();
    queryClient.setQueryData(["auth", "verify"], { data: { valid: false } });
    queryClient.removeQueries({ queryKey: queryKeys.auth.me });
  }, [queryClient]);

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
