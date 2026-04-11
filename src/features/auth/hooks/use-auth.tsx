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
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const mounted = useIsMounted();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.login);
    }
  }, [isAuthenticated, isLoading, router]);

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
