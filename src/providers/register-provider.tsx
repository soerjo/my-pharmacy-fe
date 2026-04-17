"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import type { RegisterFormValues } from "@/types";

interface RegisterContextValue {
  register: (data: RegisterFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const RegisterContext = createContext<RegisterContextValue | undefined>(undefined);

export function RegisterProvider({ children }: { children: ReactNode }) {
  const registerMutation = useMutation({
    mutationFn: authService.register,
  });

  const { mutateAsync, isPending, error } = registerMutation;

  const value = useMemo<RegisterContextValue>(() => ({
    register: async (data: RegisterFormValues) => {
      await mutateAsync(data);
    },
    isLoading: isPending,
    error,
  }), [mutateAsync, isPending, error]);

  return (
    <RegisterContext.Provider value={value}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const context = useContext(RegisterContext);
  if (context === undefined) {
    throw new Error("useRegister must be used within a RegisterProvider");
  }
  return context;
}
