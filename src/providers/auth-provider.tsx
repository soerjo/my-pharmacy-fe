"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { TokenManager } from "@/lib/token-manager";

export function AuthInitializer({ children }: { children: ReactNode }) {
  const verify = useAuthStore((s) => s.verify);
  const setPermissions = useAuthStore((s) => s.setPermissions);
  const setRoles = useAuthStore((s) => s.setRoles);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    verify();
  }, [verify]);

  useEffect(() => {
    if (isAuthenticated) {
      const permissions = TokenManager.getTokenPermissions();
      const roles = TokenManager.getTokenRoles();
      setPermissions(permissions);
      setRoles(roles);
    }
  }, [isAuthenticated, setPermissions, setRoles]);

  return <>{children}</>;
}
