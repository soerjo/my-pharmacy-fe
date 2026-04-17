"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import type { ResetPasswordFormValues } from "@/types";

interface ResetPasswordContextValue {
  resetPassword: (data: ResetPasswordFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const ResetPasswordContext = createContext<ResetPasswordContextValue | undefined>(undefined);

export function ResetPasswordProvider({ children }: { children: ReactNode }) {
  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
  });

  const { mutateAsync, isPending, error } = resetPasswordMutation;

  const value = useMemo<ResetPasswordContextValue>(() => ({
    resetPassword: async (data: ResetPasswordFormValues) => {
      await mutateAsync(data);
    },
    isLoading: isPending,
    error,
  }), [mutateAsync, isPending, error]);

  return (
    <ResetPasswordContext.Provider value={value}>
      {children}
    </ResetPasswordContext.Provider>
  );
}

export function useResetPassword() {
  const context = useContext(ResetPasswordContext);
  if (context === undefined) {
    throw new Error("useResetPassword must be used within a ResetPasswordProvider");
  }
  return context;
}
