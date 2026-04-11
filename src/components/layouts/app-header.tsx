"use client";

import Link from "next/link";
import { Button, Spinner } from "@heroui/react";
import { useAuth } from "@/features/auth/hooks";

export function AppHeader() {
  const { logout, isLoading } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
      <Link href="/" className="text-lg font-semibold">
        My App
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
          Home
        </Link>
        <Button 
          size="sm" 
          variant="ghost" 
          onPress={logout}
          isDisabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Logout"}
        </Button>
      </nav>
    </header>
  );
}
