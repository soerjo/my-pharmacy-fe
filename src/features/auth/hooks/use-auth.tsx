"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useAuth as useAuthContext } from "@/features/auth/providers/auth-provider";
import { ROUTES } from "@/constants";

export function useAuth() {
  return useAuthContext();
}

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();
  const mounted = useIsMounted();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push(ROUTES.login);
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (!mounted || isAuthLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();
  const mounted = useIsMounted();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push(ROUTES.home);
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (!mounted || isAuthLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
