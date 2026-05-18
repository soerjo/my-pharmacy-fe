"use client";

import { PermissionRoute } from "@/hooks/use-auth";
import { RoomsTable } from "@/components/rooms/rooms-table";

export default function RoomsPage() {
  return (
    <PermissionRoute permissions={["depo:read"]}>
      <div className="p-6">
        <RoomsTable />
      </div>
    </PermissionRoute>
  );
}
