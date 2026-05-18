"use client";

import { use } from "react";
import { PermissionRoute } from "@/hooks/use-auth";
import { PatientDetail } from "@/components/patients/patient-detail";

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <PermissionRoute permissions={["depo:read"]}>
      <div className="p-6">
        <PatientDetail id={id} />
      </div>
    </PermissionRoute>
  );
}
