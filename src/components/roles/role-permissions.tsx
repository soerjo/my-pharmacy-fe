"use client";

import { useState, useMemo, useCallback } from "react";
import { Button, Checkbox, Spinner } from "@heroui/react";
import type { Permission } from "@/types";

interface RolePermissionsProps {
  allPermissions: Permission[];
  assignedPermissionIds: string[];
  onSave: (permissionIds: string[]) => Promise<void>;
  isSaving?: boolean;
}

export function RolePermissions({
  allPermissions,
  assignedPermissionIds,
  onSave,
  isSaving = false,
}: RolePermissionsProps) {
  const [selectedIds, setSelectedIds] =
    useState<string[]>(assignedPermissionIds);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    for (const perm of allPermissions) {
      const group = perm.group ?? "Other";
      if (!groups[group]) groups[group] = [];
      groups[group].push(perm);
    }
    return groups;
  }, [allPermissions]);

  const handleGroupToggle = useCallback(
    (group: string, checked: boolean) => {
      const groupPermIds = groupedPermissions[group].map((p) => p.id);
      if (checked) {
        setSelectedIds((prev) => [...new Set([...prev, ...groupPermIds])]);
      } else {
        setSelectedIds((prev) =>
          prev.filter((id) => !groupPermIds.includes(id)),
        );
      }
    },
    [groupedPermissions],
  );

  const isGroupChecked = useCallback(
    (group: string) => {
      const groupPermIds = groupedPermissions[group].map((p) => p.id);
      return groupPermIds.every((id) => selectedIds.includes(id));
    },
    [groupedPermissions, selectedIds],
  );

  const handleSave = useCallback(async () => {
    await onSave(selectedIds);
  }, [selectedIds, onSave]);

  if (allPermissions.length === 0) {
    return (
      <p className="text-sm text-default-400">No permissions available.</p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(groupedPermissions).map(([group, perms]) => (
        <div
          key={group}
          className="rounded-xl border border-default-200 p-4 dark:border-default-100"
        >
          <div className="mb-3 flex items-center gap-3">
            <Checkbox
              isSelected={isGroupChecked(group)}
              onChange={(checked: boolean) =>
                handleGroupToggle(group, checked)
              }
            >
              {group}
            </Checkbox>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {perms.map((perm) => (
              <Checkbox
                key={perm.id}
                isSelected={selectedIds.includes(perm.id)}
                onChange={(checked: boolean) => {
                  if (checked) {
                    setSelectedIds((prev) => [...prev, perm.id]);
                  } else {
                    setSelectedIds((prev) =>
                      prev.filter((id) => id !== perm.id),
                    );
                  }
                }}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{perm.name}</span>
                  {perm.description && (
                    <span className="text-xs text-default-400">
                      {perm.description}
                    </span>
                  )}
                </div>
              </Checkbox>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-2">
        <Button
          variant="primary"
          onPress={handleSave}
          isDisabled={isSaving}
        >
          {isSaving ? (
            <>
              <Spinner size="sm" color="current" /> Saving...
            </>
          ) : (
            "Save Permissions"
          )}
        </Button>
      </div>
    </div>
  );
}
