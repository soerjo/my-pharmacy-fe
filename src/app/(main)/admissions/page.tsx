"use client";

import { PermissionRoute } from "@/hooks/use-auth";
import { AdmissionsTable } from "@/components/admissions/admissions-table";

export default function AdmissionsPage() {
  return (
    <PermissionRoute permissions={["depo:read"]}>
      <div className="p-6">
        <AdmissionsTable />
      </div>
    </PermissionRoute>
  );
}
