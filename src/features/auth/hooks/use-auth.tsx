"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { TokenManager } from "@/features/auth/services/token-manager";
import { ROUTES } from "@/constants";

export { useAuth };

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const mounted = useIsMounted();

  useEffect(() => {
    if (!mounted) return;

    const hasToken = !!TokenManager.getAccessToken() || !!TokenManager.getRefreshToken();
    if (!hasToken) {
      router.replace(ROUTES.login);
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  if (!mounted || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const mounted = useIsMounted();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(ROUTES.home);
    }
  }, [isAuthenticated, isLoading, router]);

  if (!mounted || isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
