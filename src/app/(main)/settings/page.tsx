"use client";

import { Card, CardContent, CardHeader, CardTitle, Separator, Avatar, Spinner, Button } from "@heroui/react";
import { Person, Shield, CircleInfo, Lock } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { usePermissions } from "@/hooks/use-permissions";
import { InfoField } from "@/components/ui/info-field";
import { APP_NAME, ROUTES } from "@/constants";

export default function SettingsPage() {
  const { user, isLoading } = useUserProfile();
  const { roles, permissions } = usePermissions();
  const router = useRouter();

  const initials = user
    ? user.userName
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Card>
        <CardHeader className="gap-4 px-6 py-5">
          <Avatar size="lg" color="accent">
            <Avatar.Fallback>
              {isLoading ? <Spinner size="sm" /> : initials ?? <Person className="size-6" />}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-lg">{isLoading ? 'Loading...' : user?.userName ?? 'User'}</CardTitle>
            <p className="text-sm text-default-400">{user?.email}</p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="gap-3 px-6 py-4">
          <Person className="size-5 text-default-400" />
          <CardTitle className="text-base">Profile Information</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-x-8 gap-y-4 px-6 py-5 sm:grid-cols-2">
          <InfoField label="Full Name" value={user?.userName} />
          <InfoField label="Email" value={user?.email} />
          <InfoField label="Organization" value={user?.organizationName} />
          <InfoField label="Roles" value={roles.join(', ') || '-'} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-3 px-6 py-4">
          <Shield className="size-5 text-default-400" />
          <CardTitle className="text-base">Permissions</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="px-6 py-5">
          {permissions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {permissions.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center rounded-md bg-default-100 px-2.5 py-1 text-xs font-medium text-default-600 dark:bg-default-150"
                >
                  {p}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-default-400">No permissions assigned</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-3 px-6 py-4">
          <Lock className="size-5 text-default-400" />
          <CardTitle className="text-base">Security</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-3 px-6 py-5">
          <Button
            variant="secondary"
            className="w-fit"
            onPress={() => router.push(ROUTES.changePassword)}
          >
            <Lock className="size-4" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-3 px-6 py-4">
          <CircleInfo className="size-5 text-default-400" />
          <CardTitle className="text-base">Application Information</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-x-8 gap-y-4 px-6 py-5 sm:grid-cols-2">
          <InfoField label="Application" value={APP_NAME} />
          <InfoField label="Version" value="0.1.0" />
          <InfoField label="Environment" value={process.env.NODE_ENV} />
          <InfoField label="API Status" value="Connected" />
        </CardContent>
      </Card>
    </div>
  );
}
