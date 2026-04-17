"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import { TokenManager } from "@/lib/token-manager";
import { queryKeys } from "@/lib/query-keys";
import { ROUTES } from "@/constants";
import type { LoginFormValues } from "@/types";
import { useRouter } from "next/navigation";

interface LoginContextValue {
  login: (data: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const LoginContext = createContext<LoginContextValue | undefined>(undefined);

export function LoginProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      if (response.data?.accessToken) {
        TokenManager.setAccessToken(response.data.accessToken);
        TokenManager.setRefreshToken(response.data.refreshToken);
        queryClient.setQueryData(
          ["auth", "verify"],
          { statusCode: 200, data: { valid: true } },
        );
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
        router.push(ROUTES.home);
      }
    },
  });

  const { mutateAsync, isPending, error } = loginMutation;

  const value = useMemo<LoginContextValue>(() => ({
    login: async (data: LoginFormValues) => {
      await mutateAsync(data);
    },
    isLoading: isPending,
    error,
  }), [mutateAsync, isPending, error]);

  return (
    <LoginContext.Provider value={value}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
}
