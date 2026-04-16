"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { ErrorProvider, onServerError, useErrorAlert } from "./error-provider";
import { GlobalErrorAlert } from "@/components/ui";

function ServerErrorListener({ children }: { children: ReactNode }) {
  const { showError } = useErrorAlert();

  useEffect(() => {
    const handler = (e: Event) => {
      const { message } = (e as CustomEvent<{ message: string }>).detail;
      showError(message);
    };
    window.addEventListener("app:server-error", handler);
    return () => window.removeEventListener("app:server-error", handler);
  }, [showError]);

  return <>{children}</>;
}

const handleError = onServerError;

function QueryClientInner({ children }: { children: ReactNode }) {
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
      {children}
    </QueryClientProvider>
  );
}

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorProvider>
      <ServerErrorListener>
        <QueryClientInner>
          {children}
          <GlobalErrorAlert />
        </QueryClientInner>
      </ServerErrorListener>
    </ErrorProvider>
  );
}
