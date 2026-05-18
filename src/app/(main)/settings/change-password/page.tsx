"use client";

import { Card, CardContent, CardHeader } from "@heroui/react";
import { Lock } from "@gravity-ui/icons";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Change Password</h1>
      <Card>
        <CardHeader className="gap-3 px-6 py-4">
          <Lock className="size-5 text-default-400" />
          <span className="text-base font-semibold">Change Password</span>
        </CardHeader>
        <CardContent className="px-6 py-5">
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
