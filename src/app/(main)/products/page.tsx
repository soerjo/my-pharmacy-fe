"use client";

import { PermissionRoute } from "@/hooks/use-auth";
import { ProductsTable } from "@/components/products/products-table";

export default function ProductsPage() {
  return (
    <PermissionRoute permissions={["warehouse:read"]}>
      <div className="p-6">
        <ProductsTable />
      </div>
    </PermissionRoute>
  );
}
