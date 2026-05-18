"use client";

import { use } from "react";
import { PermissionRoute } from "@/hooks/use-auth";
import { UserDetail } from "@/components/users/user-detail";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = use(params);

  return (
    <PermissionRoute permissions={["user:read"]}>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-semibold">User Details</h1>
        <UserDetail userId={id} />
      </div>
    </PermissionRoute>
  );
}
