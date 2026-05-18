"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { TokenManager } from "@/lib/token-manager";
import type { LoginResponseUser } from "@/types";

export function AuthInitializer({ children }: { children: ReactNode }) {
  const verify = useAuthStore((s) => s.verify);
  const setUser = useAuthStore((s) => s.setUser);
  const setPermissions = useAuthStore((s) => s.setPermissions);
  const setRoles = useAuthStore((s) => s.setRoles);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    verify();
  }, [verify]);

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = TokenManager.getStoredUser<LoginResponseUser>();
      if (storedUser && !user) {
        setUser(storedUser);
        setPermissions(storedUser.permissions);
      }
      const permissions = TokenManager.getTokenPermissions();
      const roles = TokenManager.getTokenRoles();
      if (permissions.length > 0) {
        setPermissions(permissions);
      }
      setRoles(roles);
    }
  }, [isAuthenticated, setPermissions, setRoles, setUser, user]);

  return <>{children}</>;
}
