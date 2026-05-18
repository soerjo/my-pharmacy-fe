"use client";

import { PermissionRoute } from "@/hooks/use-auth";
import { DispenseOrdersTable } from "@/components/dispense-orders/dispense-orders-table";

export default function DispenseOrderPage() {
  return (
    <PermissionRoute permissions={["depo:read"]}>
      <div className="p-6">
        <DispenseOrdersTable />
      </div>
    </PermissionRoute>
  );
}
