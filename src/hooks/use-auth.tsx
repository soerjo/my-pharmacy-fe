"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useAuthStore } from "@/stores/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { TokenManager } from "@/lib/token-manager";
import { ROUTES } from "@/constants";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: string[];
}

export function ProtectedRoute({ children, permissions }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const router = useRouter();
  const mounted = useIsMounted();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (!mounted) return;

    const hasToken =
      !!TokenManager.getAccessToken() || !!TokenManager.getRefreshToken();
    if (!hasToken) {
      router.replace(ROUTES.login);
      return;
    }

    if (isInitialized && !isLoading && !isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [mounted, isAuthenticated, isLoading, isInitialized, router]);

  if (!mounted || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Check permissions if specified
  if (permissions && permissions.length > 0) {
    const hasAllPermissions = permissions.every((p) => hasPermission(p));
    if (!hasAllPermissions) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-danger">
              Access Denied
            </h1>
            <p className="mt-2 text-default-500">
              You do not have permission to access this page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

export function PermissionRoute({
  children,
  permissions,
  fallback,
}: {
  children: React.ReactNode;
  permissions: string[];
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = usePermissions();
  const isLoading = useAuthStore((s) => s.isLoading);
  const mounted = useIsMounted();

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const hasAllPermissions = permissions.every((p) => hasPermission(p));

  if (!hasAllPermissions) {
    return (
      <>
        {fallback ?? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-danger">
                Access Denied
              </h1>
              <p className="mt-2 text-default-500">
                You do not have permission to access this page.
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const router = useRouter();
  const mounted = useIsMounted();

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated) {
      router.push(ROUTES.home);
    }
  }, [isAuthenticated, isLoading, isInitialized, router]);

  if (!mounted || isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
