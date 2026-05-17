"use client";

import { useMemo } from "react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { TokenManager } from "@/lib/token-manager";

export function usePermissions() {
  const { user } = useUserProfile();

  const permissions = useMemo(() => {
    if (user?.permissions?.length) {
      return user.permissions;
    }
    return TokenManager.getTokenPermissions();
  }, [user?.permissions]);

  const roles = useMemo(() => {
    if (user?.roles?.length) {
      return user.roles;
    }
    return TokenManager.getTokenRoles();
  }, [user?.roles]);

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((p) => permissions.includes(p));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every((p) => permissions.includes(p));
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  return {
    permissions,
    roles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  };
}
