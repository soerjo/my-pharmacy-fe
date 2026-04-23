"use client";

import { Avatar, Button, Dropdown, Spinner } from "@heroui/react";
import { ArrowRightFromSquare, Bars, Bell, Person } from "@gravity-ui/icons";

import { useUserProfile } from "@/hooks/use-user-profile";
import { useAppStore, useAuthStore } from "@/stores";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";

export function TopNavbar() {
  const logout = useAuthStore((s) => s.logout);
  const isLoading = useAuthStore((s) => s.isLoading);
  const { user, isLoading: isUserLoading } = useUserProfile();
  const { toggleSidebar } = useAppStore();

  const initials = user
    ? user.userName.split(" ").map((n) => n.charAt(0)).join("").toUpperCase().slice(0, 2)
    : null;

  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b border-default-200 px-4 dark:border-default-100">
      <Button
        isIconOnly
        variant="ghost"
        className="mr-auto lg:hidden"
        onPress={toggleSidebar}
      >
        <Bars className="size-5" />
      </Button>

      <div className="flex items-center gap-2">
        <Button isIconOnly variant="tertiary" size="sm">
          <Bell className="size-5" />
        </Button>

        <div
          className={cn(
            "flex items-center gap-2 rounded-full outline-none ring-offset-background transition-opacity hover:opacity-80",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          <Avatar size="sm" color="accent" className="md:hidden flex">
            <Avatar.Fallback>
              {isUserLoading ? <Spinner size="sm" /> : initials ?? "U"}
            </Avatar.Fallback>
          </Avatar>
        </div>

        <div className="hidden md:flex">
          <Dropdown>
            <Dropdown.Trigger>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full outline-none ring-offset-background transition-opacity hover:opacity-80",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              >
                <Avatar size="sm" color="accent">
                  <Avatar.Fallback>
                    {isUserLoading ? <Spinner size="sm" /> : initials ?? "U"}
                  </Avatar.Fallback>
                </Avatar>
              </div>
            </Dropdown.Trigger>
            <Dropdown.Popover className="hidden md:flex flex-col p-2">
              {user && (
                <div className="border-b border-default-200 px-3 py-2.5 dark:border-default-100">
                  <p className="text-sm font-medium">
                    {isUserLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      user.userName
                    )}
                  </p>
                  <p className="text-xs text-default-400">{user.email}</p>
                </div>
              )}
              <Dropdown.Menu aria-label="User menu">
                <Dropdown.Item key="profile" href={ROUTES.settings}>
                  <Person className="size-4" />
                  Profile
                </Dropdown.Item>
                <Dropdown.Item
                  key="logout"
                  variant="danger"
                  onAction={() => { logout(); }}
                  isDisabled={isLoading}
                >
                  <ArrowRightFromSquare className="size-4" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>    
        </div>
      </div>
    </header>
  );
}
