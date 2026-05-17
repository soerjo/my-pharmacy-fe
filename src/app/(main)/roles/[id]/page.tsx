"use client";

import { use } from "react";
import { RoleDetail } from "@/components/roles/role-detail";

interface RoleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RoleDetailPage({ params }: RoleDetailPageProps) {
  const { id } = use(params);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Role Details</h1>
      <RoleDetail roleId={id} />
    </div>
  );
}
