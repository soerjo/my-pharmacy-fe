"use client";

import { PermissionRoute } from "@/hooks/use-auth";
import { RolesTable } from "@/components/roles/roles-table";

export default function RolesPage() {
  return (
    <PermissionRoute permissions={["role:manage"]}>
      <div className="p-6">
        <RolesTable />
      </div>
    </PermissionRoute>
  );
}
