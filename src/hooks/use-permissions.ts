"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useUserProfile } from "@/hooks/use-user-profile";
import { TokenManager } from "@/lib/token-manager";

export function usePermissions() {
  const authUser = useAuthStore((s) => s.user);
  const authPermissions = useAuthStore((s) => s.permissions);
  const authUserPermissions = authUser?.permissions;
  const authUserRole = authUser?.role;
  const { user: profileUser } = useUserProfile();
  const profilePermissions = profileUser?.permissions;
  const profileRole = profileUser?.role;

  const permissions = useMemo(() => {
    if (authUserPermissions?.length) {
      return authUserPermissions;
    }
    if (authPermissions?.length) {
      return authPermissions;
    }
    if (profilePermissions?.length) {
      return profilePermissions;
    }
    return TokenManager.getTokenPermissions();
  }, [authUserPermissions, authPermissions, profilePermissions]);

  const roles = useMemo(() => {
    if (authUserRole) {
      return [authUserRole];
    }
    if (profileRole) {
      return [profileRole];
    }
    return TokenManager.getTokenRoles();
  }, [authUserRole, profileRole]);

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
