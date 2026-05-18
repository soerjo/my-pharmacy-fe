"use client";

import { PermissionRoute } from "@/hooks/use-auth";
import { PatientsTable } from "@/components/patients/patients-table";

export default function PatientsPage() {
  return (
    <PermissionRoute permissions={["depo:read"]}>
      <div className="p-6">
        <PatientsTable />
      </div>
    </PermissionRoute>
  );
}
