"use client";

import { useCallback } from "react";
import { Spinner } from "@heroui/react";
import { useRole, useAllPermissions, useRolePermissions } from "@/hooks/use-roles";
import { RolePermissions } from "./role-permissions";

interface RoleDetailProps {
  roleId: string;
}

export function RoleDetail({ roleId }: RoleDetailProps) {
  const { role, isLoading } = useRole(roleId);
  const { permissions: allPermissions, isLoading: isLoadingPermissions } =
    useAllPermissions();
  const { permissions: assignedPermissions, assignPermissions, isAssigning } =
    useRolePermissions(roleId);

  const assignedPermissionIds = assignedPermissions.map((p) => p.id);

  const handleSavePermissions = useCallback(
    async (permissionIds: string[]) => {
      await assignPermissions(permissionIds);
    },
    [assignPermissions],
  );

  if (isLoading || isLoadingPermissions) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="py-12 text-center text-default-500">Role not found.</div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Role Info Card */}
      <div className="rounded-xl border border-default-200 p-6 dark:border-default-100">
        <h3 className="mb-4 text-lg font-semibold">Role Information</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-default-400">Name</p>
            <p className="font-medium">{role.name}</p>
          </div>
          <div>
            <p className="text-sm text-default-400">Description</p>
            <p className="font-medium">{role.description ?? "-"}</p>
          </div>
        </div>
      </div>

      {/* Permissions Card */}
      <div className="rounded-xl border border-default-200 p-6 dark:border-default-100">
        <h3 className="mb-4 text-lg font-semibold">
          Permissions ({assignedPermissionIds.length}/{allPermissions.length})
        </h3>

        <RolePermissions
          allPermissions={allPermissions}
          assignedPermissionIds={assignedPermissionIds}
          onSave={handleSavePermissions}
          isSaving={isAssigning}
        />
      </div>
    </div>
  );
}
