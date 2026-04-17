"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import type { ForgotPasswordFormValues } from "@/types";

interface ForgotPasswordContextValue {
  forgotPassword: (data: ForgotPasswordFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const ForgotPasswordContext = createContext<ForgotPasswordContextValue | undefined>(undefined);

export function ForgotPasswordProvider({ children }: { children: ReactNode }) {
  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
  });

  const { mutateAsync, isPending, error } = forgotPasswordMutation;

  const value = useMemo<ForgotPasswordContextValue>(() => ({
    forgotPassword: async (data: ForgotPasswordFormValues) => {
      await mutateAsync(data);
    },
    isLoading: isPending,
    error,
  }), [mutateAsync, isPending, error]);

  return (
    <ForgotPasswordContext.Provider value={value}>
      {children}
    </ForgotPasswordContext.Provider>
  );
}

export function useForgotPassword() {
  const context = useContext(ForgotPasswordContext);
  if (context === undefined) {
    throw new Error("useForgotPassword must be used within a ForgotPasswordProvider");
  }
  return context;
}
