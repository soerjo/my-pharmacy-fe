"use client";

import Link from "next/link";
import { Button, Spinner } from "@heroui/react";
import { Bars } from "@gravity-ui/icons";
import { useAuth } from "@/providers/auth-provider";
import { ROUTES } from "@/constants";
import { useAppStore } from "@/stores";

export function AppHeader() {
  const { logout, isLoading } = useAuth();
  const { toggleSidebar } = useAppStore();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-zinc-200 px-6 dark:border-zinc-800 lg:px-4">
      <Button
        isIconOnly
        variant="tertiary"
        className="lg:hidden"
        onPress={toggleSidebar}
      >
        <Bars className="size-5" />
      </Button>
      <Link href="/" className="text-lg font-semibold lg:hidden">
        My App
      </Link>
      <div className="hidden lg:block" />
      <div className="ml-auto flex items-center gap-4">
        <Link href={ROUTES.home} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
          Home
        </Link>
        <Link href={ROUTES.patients} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
          Patients
        </Link>
        <Link href={ROUTES.dispenseOrders} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
          Dispense Orders
        </Link>
        <Button
          size="sm"
          variant="ghost"
          onPress={logout}
          isDisabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Logout"}
        </Button>
      </div>
    </header>
  );
}
