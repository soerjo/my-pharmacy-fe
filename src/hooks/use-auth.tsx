'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@heroui/react';
import { useAuthStore } from '@/stores/auth-store';
import { TokenManager } from '@/lib/token-manager';
import { ROUTES } from '@/constants';

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const router = useRouter();
  const mounted = useIsMounted();

  useEffect(() => {
    if (!mounted) return;

    const hasToken = !!TokenManager.getAccessToken() || !!TokenManager.getRefreshToken();
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
