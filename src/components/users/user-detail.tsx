"use client";

import { useState, useCallback } from "react";
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopover,
  ListBox,
  ListBoxItem,
  Spinner,
} from "@heroui/react";
import { useUser, useUserRoles } from "@/hooks/use-users";
import { useRoles } from "@/hooks/use-roles";

interface UserDetailProps {
  userId: string;
}

export function UserDetail({ userId }: UserDetailProps) {
  const { user, isLoading } = useUser(userId);
  const { roles, assignRole, removeRole, isAssigning, isRemoving } =
    useUserRoles(userId);
  const { roles: allRoles } = useRoles();
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const handleAssignRole = useCallback(async () => {
    if (!selectedRoleId) return;
    await assignRole(selectedRoleId);
    setSelectedRoleId("");
  }, [selectedRoleId, assignRole]);

  const handleRemoveRole = useCallback(
    async (roleId: string) => {
      await removeRole(roleId);
    },
    [removeRole],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center text-default-500">User not found.</div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-default-200 p-6 dark:border-default-100">
        <h3 className="mb-4 text-lg font-semibold">User Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-default-400">Name</p>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-default-400">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-default-400">Organization</p>
            <p className="font-medium">
              {user.organizationName ?? user.organizationId ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-default-400">Status</p>
            <p className="font-medium">
              {user.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-default-200 p-6 dark:border-default-100">
        <h3 className="mb-4 text-lg font-semibold">Assigned Roles</h3>

        <div className="mb-4 flex gap-2">
          <Select
            selectedKey={selectedRoleId}
            onSelectionChange={(key) =>
              setSelectedRoleId(key ? String(key) : "")
            }
            className="flex-1"
            placeholder="Select a role to assign"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectPopover>
              <ListBox items={allRoles}>
                {(role: { id: string; name: string }) => (
                  <ListBoxItem key={role.id} textValue={role.name}>
                    {role.name}
                  </ListBoxItem>
                )}
              </ListBox>
            </SelectPopover>
          </Select>
          <Button
            variant="primary"
            onPress={handleAssignRole}
            isDisabled={!selectedRoleId || isAssigning}
          >
            {isAssigning ? <Spinner size="sm" color="current" /> : "Assign"}
          </Button>
        </div>

        {roles.length === 0 ? (
          <p className="text-sm text-default-400">No roles assigned.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {roles.map((userRole) => (
              <div
                key={userRole.id}
                className="flex items-center justify-between rounded-lg border border-default-100 px-4 py-2 dark:border-default-50"
              >
                <span className="text-sm font-medium">
                  {userRole.roleName ?? userRole.roleId}
                </span>
                <Button
                  size="sm"
                  variant="danger"
                  onPress={() => handleRemoveRole(userRole.roleId)}
                  isDisabled={isRemoving}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
