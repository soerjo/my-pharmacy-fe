"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { onServerError } from "./error-provider";
import { Toast } from "@heroui/react";

const handleError = onServerError;

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
        queryCache: new QueryCache({ onError: handleError }),
        mutationCache: new MutationCache({ onError: handleError }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toast.Provider placement="top end"/>
      {children}
    </QueryClientProvider>
  );
}
