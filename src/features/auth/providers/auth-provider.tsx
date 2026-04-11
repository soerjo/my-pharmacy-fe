"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ROUTES, API_ROUTES } from "@/constants";
import { apiClient } from "@/lib";
import { TokenManager } from "@/features/auth/services/token-manager";
import type { LoginResponse, LoginFormValues } from "@/features/auth/types";
import type { ApiResponse } from "@/types";

function generateDummyToken(expireInMinutes: number): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    exp: now + (expireInMinutes * 60),
    iat: now,
    sub: "user123",
    username: "dev-user",
  }));
  const signature = btoa("dummy-signature");
  return `${header}.${payload}.${signature}`;
}

const isDevelopment = process.env.NODE_ENV === "development";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const verifyTokenQuery = useQuery<ApiResponse<{ valid: boolean }>>({
    queryKey: ["auth", "verify"],
    queryFn: async () => {
      if (isDevelopment) {
        return { data: { valid: true } };
      }
      return apiClient.get(API_ROUTES.verifyToken);
    },
    retry: false,
    enabled: typeof window !== "undefined" && TokenManager.isAccessTokenValid(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (isDevelopment) {
        return;
      }
      return apiClient.post<void>(API_ROUTES.logout);
    },
    onMutate: () => {
      TokenManager.clearTokens();
    },
    onSettled: async () => {
      await verifyTokenQuery.refetch();
      router.push(ROUTES.login);
    },
  });

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      if (isDevelopment) {
        const newAccessToken = generateDummyToken(15);
        const newRefreshToken = generateDummyToken(60 * 24 * 7);
        return {
          data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        };
      }
      return apiClient.post<ApiResponse<LoginResponse>>(API_ROUTES.refreshToken, { 
        refreshToken: TokenManager.getRefreshToken() 
      }, { skipAuth: true });
    },
    onSuccess: (response) => {
      if (response.data?.accessToken) {
        TokenManager.setAccessToken(response.data.accessToken);
        if (response.data.refreshToken) {
          TokenManager.setRefreshToken(response.data.refreshToken);
        }
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => 
      apiClient.post<ApiResponse<LoginResponse>>(API_ROUTES.login, data),
    onSuccess: (response) => {
      if (response.data?.accessToken) {
        TokenManager.setAccessToken(response.data.accessToken);
        TokenManager.setRefreshToken(response.data.refreshToken);
      }
    },
  });

  const login = useCallback(async (data: LoginFormValues) => {
    try {
      if (isDevelopment) {
        const dummyAccessToken = generateDummyToken(15);
        const dummyRefreshToken = generateDummyToken(60 * 24 * 7);
        
        TokenManager.setAccessToken(dummyAccessToken);
        TokenManager.setRefreshToken(dummyRefreshToken);
        
        verifyTokenQuery.refetch();
        router.push(ROUTES.home);
      } else {
        const response = await loginMutation.mutateAsync(data);
        if (response.data?.accessToken) {
          verifyTokenQuery.refetch();
          router.push(ROUTES.home);
        }
      }
    } catch (error) {
      throw error;
    }
  }, [loginMutation, verifyTokenQuery, router]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const hasToken = !!TokenManager.getAccessToken();
  const isValid = TokenManager.isAccessTokenValid();
  const isVerified = verifyTokenQuery.data?.data?.valid !== false;
  const isAuthenticated = hasToken && isValid && isVerified;

  const isLoading = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return (
      verifyTokenQuery.isLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending
    );
  }, [verifyTokenQuery.isLoading, loginMutation.isPending, logoutMutation.isPending]);

  const error = useMemo(() => {
    if (verifyTokenQuery.error) return verifyTokenQuery.error;
    if (loginMutation.error) return loginMutation.error;
    if (logoutMutation.error) return logoutMutation.error;
    return null;
  }, [verifyTokenQuery.error, loginMutation.error, logoutMutation.error]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== ROUTES.login) {
      router.push(ROUTES.login);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  useEffect(() => {
    if (!isAuthenticated || !TokenManager.getAccessToken()) return;

    const checkAndRefreshToken = () => {
      const token = TokenManager.getAccessToken();
      if (!token) return;

      const timeUntilExpiration = TokenManager.getTimeUntilExpiration(token);
      
      if (timeUntilExpiration <= 5 * 60 * 1000 && timeUntilExpiration > 0) {
        refreshTokenMutation.mutate();
      }
    };

    const token = TokenManager.getAccessToken();
    if (token) {
      const timeUntilExpiration = TokenManager.getTimeUntilExpiration(token);
      const initialDelay = Math.max(0, timeUntilExpiration - 5 * 60 * 1000);
      
      const timer = setTimeout(() => {
        checkAndRefreshToken();
        
        const intervalId = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
        
        return () => clearInterval(intervalId);
      }, initialDelay);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, refreshTokenMutation]);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    isLoading,
    login,
    logout,
    error,
  }), [isAuthenticated, isLoading, login, logout, error]);

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
