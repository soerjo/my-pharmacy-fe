"use client";

import { PermissionRoute } from "@/hooks/use-auth";
import { UsersTable } from "@/components/users/users-table";

export default function UsersPage() {
  return (
    <PermissionRoute permissions={["user:read"]}>
      <div className="p-6">
        <UsersTable />
      </div>
    </PermissionRoute>
  );
}
